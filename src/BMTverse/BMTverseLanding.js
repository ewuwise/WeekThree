import React, { useEffect, useState } from 'react';
import {
    connectWallet,
    disconnectWallet,
    getBMTBalance,
    getDAIBalance,
    transferBMT,
    transferDAI
} from './wallet';

import { formatUnits } from 'ethers/lib/utils';

const BMTverseLanding = () => {
    const [walletAddress, setWalletAddress] = useState('');
    const [daiBalance, setDaiBalance] = useState('0');
    const [bmtBalance, setBMTBalance] = useState('0');
    const [burnAmount, setBurnAmount] = useState(0);
    const [mintReward, setMintReward] = useState(0);
    const [daiRecipient, setDaiRecipient] = useState('');
    const [daiAmount, setDaiAmount] = useState(0);
    const [bmtRecipient, setBMTRecipient] = useState('');
    const [bmtAmount, setBMTAmount] = useState(0);

    useEffect(() => {
        const checkWalletConnection = async () => {
            try {
                const address = await connectWallet();
                if (address) {
                    setWalletAddress(address);
                    // Fetch DAI balance when wallet connects
                const [daiBalance, bmtBalance] = await Promise.all([
                    getDAIBalance(),
                    getBMTBalance()
                ]);
                setDaiBalance(formatUnits(daiBalance, 18));
                setBMTBalance(formatUnits(bmtBalance, 18));
                }
            } catch (error) {
                console.error('Wallet connection error:', error);
            }
        };
        checkWalletConnection();
    }, []);

    const handleTransferDAI = async () => {
        try {
            await transferDAI(daiRecipient, daiAmount);
            alert('DAI transfer initiated!');
            // Refresh balances after transfer
            const [newDaiBalance, newBMTBalance] = await Promise.all([
                getDAIBalance(),
                getBMTBalance()
            ]);
            setDaiBalance(formatUnits(newDaiBalance, 18));
            setBMTBalance(formatUnits(newBMTBalance, 18));
        } catch (error) {
            console.error('DAI transfer failed:', error);
            alert(`Transfer failed: ${error.message}`);
        }
    };

    const handleTransferBMT = async () => {
        try {
            await transferBMT(bmtRecipient, bmtAmount);
            alert('BMT transfer initiated!');
            // Refresh balances after transfer
            const [newDaiBalance, newBMTBalance] = await Promise.all([
                getDAIBalance(),
                getBMTBalance()
            ]);
            setDaiBalance(formatUnits(newDaiBalance, 18));
            setBMTBalance(formatUnits(newBMTBalance, 18));
        } catch (error) {
            console.error('BMT transfer failed:', error);
            alert(`Transfer failed: ${error.message}`);
        }
    };

    const handleBurn = async () => {
        // Call the smart contract method to burn tokens
        const reward = await simulateBurn(burnAmount);
        setMintReward(reward);
    };

    const simulateBurn = async (amount) => {
        // Logic to interact with the smart contract and calculate mint rewards
        // This is a placeholder for the actual implementation
        return amount * 2; // Example: 2x the burn amount as reward
    };

    return (
        <div>
            <h1>BMTverse Landing Page</h1>
            <div>
                <p>Wallet Address: {walletAddress || 'Not Connected'}</p>
            <p>DAI Balance: {daiBalance}</p>
            <p>BMT Balance: {bmtBalance}</p>
                
                <h3>DAI Transfer</h3>
                <input
                    type="text"
                    value={daiRecipient}
                    onChange={(e) => setDaiRecipient(e.target.value)}
                    placeholder="Recipient address"
                />
                <input
                    type="number"
                    value={daiAmount}
                    onChange={(e) => setDaiAmount(e.target.value)}
                    placeholder="DAI amount"
                />
                <button onClick={handleTransferDAI}>Send DAI</button>

                <h3>BMT Transfer</h3>
                <input
                    type="text"
                    value={bmtRecipient}
                    onChange={(e) => setBMTRecipient(e.target.value)}
                    placeholder="Recipient address"
                />
                <input
                    type="number"
                    value={bmtAmount}
                    onChange={(e) => setBMTAmount(e.target.value)}
                    placeholder="BMT amount"
                />
                <button onClick={handleTransferBMT}>Send BMT</button>
                
                <h3>Burn Tokens</h3>
                <input
                    type="number"
                    value={burnAmount}
                    onChange={(e) => setBurnAmount(e.target.value)}
                    placeholder="Enter amount to burn"
                />
                <button onClick={handleBurn}>Burn Tokens</button>
                <p>Mint Reward: {mintReward} BMT</p>
            </div>
        </div>
    );
};

export default BMTverseLanding;
