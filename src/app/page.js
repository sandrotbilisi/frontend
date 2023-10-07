"use client"
import React, { useState, createContext } from 'react';
import { Connector } from './components/connector';


import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

import { WagmiConfig, useAccount } from 'wagmi'
import { mainnet } from 'wagmi/chains'

const projectId = '81930398528edb6502ab848c5ff7305b'

export const walletConnectContext = createContext()

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains })

const App = () => {

const [account, setAccount] = useState(null)
const [ isConnected, setIsConnected ] = useState(false)

    return (
        <walletConnectContext.Provider value={[ account, setAccount, isConnected, setIsConnected ]}>
                <Connector />
        </walletConnectContext.Provider>
        
    )
};

export default App;
