import React, { useState } from 'react';

const RewardAdmin = () => {
    const [threshold, setThreshold] = useState('');
    const [multiplier, setMultiplier] = useState('');

    const handleAddTier = () => {
        // Logic to add a new tier to the rewards system
        console.log(`Adding tier with threshold: ${threshold} and multiplier: ${multiplier}`);
    };

    return (
        <div>
            <h1>Reward Management</h1>
            <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                placeholder="Threshold Amount"
            />
            <input
                type="number"
                value={multiplier}
                onChange={(e) => setMultiplier(e.target.value)}
                placeholder="Multiplier"
            />
            <button onClick={handleAddTier}>Add Reward Tier</button>
        </div>
    );
};

export default RewardAdmin;
