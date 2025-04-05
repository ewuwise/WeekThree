import React, { useState } from 'react';

import Web3 from 'web3';
import { useWeb3Modal } from '@web3modal/react';

const ConnectWalletCommand = () => {
    const [connectionStatus, setConnectionStatus] = useState('');

    const connectWallet = async (walletProvider) => {
        try {
            const web3Modal = new Web3Modal();
            const provider = await web3Modal.connect(walletProvider);
            const web3 = new Web3(provider);
            const accounts = await web3.eth.getAccounts();
            setConnectionStatus(`🎉 Wallet linked: ${accounts[0]}! You’re now eligible for **AI Airdrops**.`);
        } catch (error) {
            setConnectionStatus('⚠️ Connection failed. Please try again.');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">/connect-wallet Command</h1>
            <h2 className="text-xl font-semibold">Stack:</h2>
            <ul className="list-disc pl-5">
                <li>WalletConnect API</li>
                <li>Chainalysis for activity insights</li>
            </ul>

            <h2 className="text-xl font-semibold mt-4">Connect to Wallet:</h2>
            <button onClick={() => connectWallet('binance')}>Connect Binance Chain Wallet</button>
            <button onClick={() => connectWallet('brave')}>Connect Brave Wallet</button>
            <button onClick={() => connectWallet('phantom')}>Connect Phantom Wallet</button>

            <p>{connectionStatus}</p>
        </div>
    );
};

export default ConnectWalletCommand;
