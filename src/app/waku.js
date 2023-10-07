"use strict";

import { useState, useEffect } from 'react';
import { createLightNode, waitForRemotePeer, createEncoder, createDecoder } from "@waku/sdk";
import protobuf from "protobufjs";

export const useWaku = () => {
    const [node, setNode] = useState(null);
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState('');  // New state for username

    useEffect(() => {
        const main = async () => {
            const node = await createLightNode({ defaultBootstrap: true });
            await node.start();
            await waitForRemotePeer(node);

            const contentTopic = "/light-guide/1/message/proto";
            const encoder = createEncoder({ contentTopic });
            const decoder = createDecoder(contentTopic);

            const ChatMessage = new protobuf.Type("ChatMessage")
                .add(new protobuf.Field("timestamp", 1, "uint64"))
                .add(new protobuf.Field("sender", 2, "string"))
                .add(new protobuf.Field("recipient", 3, "string"))
                .add(new protobuf.Field("message", 4, "string"))

            const callback = (wakuMessage) => {
                if (!wakuMessage.payload) return;
                try {
                    const messageObj = ChatMessage.decode(wakuMessage.payload);
                    console.log(messageObj)
                    setMessages(prevMessages => {
                        const index = prevMessages.findIndex(msg => msg.timestamp === messageObj.timestamp && msg.sender === messageObj.sender);
                        if (index !== -1) {
                            const updatedMessages = [...prevMessages];
                            updatedMessages[index] = messageObj;
                            return updatedMessages;
                        }
                        return [...prevMessages, messageObj];
                    });
                } catch (error) {
                    console.error('Error decoding message:', error);
                }
            };

            try {
                await node.filter.subscribe([decoder], callback);
            } catch (error) {
                console.error('Error subscribing to filter:', error);
            }

            setNode(node);
        };

        main();
    }, [username]);

    const sendMessage = async (sender, message, recipient) => {
        if (!node) return;

        const ChatMessage = new protobuf.Type("ChatMessage")
        .add(new protobuf.Field("timestamp", 1, "uint64"))
        .add(new protobuf.Field("sender", 2, "string"))
        .add(new protobuf.Field("recipient", 3, "string"))
        .add(new protobuf.Field("message", 4, "string"))

        const protoMessage = ChatMessage.create({ timestamp: Date.now(), sender, recipient, message });
        const serialisedMessage = ChatMessage.encode(protoMessage).finish();

        try {
            const contentTopic = "/light-guide/1/message/proto";
            const encoder = createEncoder({ contentTopic });
            await node.lightPush.send(encoder, { payload: serialisedMessage });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return { messages, sendMessage, setUsername };  // Include setUsername in the returned object
};
