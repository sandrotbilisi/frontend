"use client"

import React, { useState, useContext } from 'react'
import { walletConnectContext } from '../page'



const ConnectButton = () => {

    const [ account, setAccount, isConnected, setIsConnected ] = useContext(walletConnectContext)


    const ConnectButtonHandler = async () => {
        await window.ethereum.enable();
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        console.log(account)
    }


return (
    <button onClick={ConnectButtonHandler}>{isConnected
        ? 'Disconnect Wallet'
        : 'Connect Wallet'
    }</button>
  )


}
