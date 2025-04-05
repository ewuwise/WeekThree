import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { BurnMintDashboard } from './components/BurnMintDashboard';
import { LiveTokenMetrics } from './components/LiveTokenMetrics';
import { TransactionHistory } from './components/TransactionHistory';

const App = () => {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState('');

    useEffect(() => {
        const initWeb3 = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                setWeb3(web3Instance);
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const accounts = await web3Instance.eth.getAccounts();
                setAccount(accounts[0]);
            } else {
                alert('Please install MetaMask to use this app.');
            }
        };
        initWeb3();
    }, []);

    return (
        <div>
            <h1>Burn & Mint Dashboard</h1>
            <p>Connected Account: {account}</p>
            <BurnMintDashboard web3={web3} account={account} />
            <LiveTokenMetrics web3={web3} />
            <TransactionHistory web3={web3} account={account} />
        </div>
    );
};

export default App;
