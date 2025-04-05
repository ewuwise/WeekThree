import React, { useState } from 'react';

const BurnInterface = ({ burnTokens, calculateTieredReward }) => {
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleBurn = async () => {
        const burnAmount = parseFloat(amount);
        if (burnAmount <= 0) {
            setError('Please enter a valid amount to burn');
            return;
        }

        try {
            const rewards = calculateTieredReward(burnAmount);
            await burnTokens(burnAmount);
            setMessage(`Successfully burned ${amount} tokens! You earned ${rewards.baseReward + rewards.bonus} rewards!`);
            setError('');
        } catch (err) {
            setError('Error occurred while burning tokens. Please try again.');
            setMessage('');
        }
    };

    return (
        <div>
            <h2>Burn Interface</h2>
            <input
                type="number"
                placeholder="Enter amount to burn"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={handleBurn}>Burn Tokens</button>
            {message && <div>{message}</div>}
            {error && <div>{error}</div>}
        </div>
    );
};

export default BurnInterface;
