import React, { useState } from 'react';

import ConnectWalletCommand from './ConnectWalletCommand';

const PurchaseBMT = ({ purchaseTokens }) => {
    const [amount, setAmount] = useState(0);
    const [message, setMessage] = useState('');

    const handlePurchase = async () => {
        if (amount <= 0) {
            setMessage('Please enter a valid amount to purchase.');
            return;
        }

        try {
            await purchaseTokens(amount);
            setMessage(`Successfully purchased ${amount} BMT tokens!`);
        } catch (error) {
            setMessage('Error purchasing tokens. Please try again.');
        }
    };

    return (
        <div>
            <h2>Purchase BMT Tokens</h2>
            <ConnectWalletCommand />
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Enter amount to purchase"
            />
            <button onClick={handlePurchase}>Purchase Tokens</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default PurchaseBMT;
