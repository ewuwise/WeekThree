import React, { useState } from 'react';
import { abi, contractAddress } from '../constants'; // Adjust the path as necessary

import { useContractWrite } from 'wagmi';

const BurnSimulator = () => {
    const [burnAmount, setBurnAmount] = useState(0);
    const [mintReward, setMintReward] = useState(0);
    const [newBurnRate, setNewBurnRate] = useState(10); // Default burn rate

    const { write: burnTokens } = useContractWrite({
        address: contractAddress,
        abi: abi,
        functionName: 'burn', // Replace with the actual function name in your contract
    });

    const handleBurnSimulation = async () => {
        if (burnAmount <= 0) {
            alert('Please enter a valid amount to burn.');
            return;
        }

        try {
            const tx = await burnTokens({ args: [burnAmount] }); // Adjust args as necessary
            await tx.wait(); // Wait for the transaction to be mined
            const calculatedMintReward = burnAmount * 0.05; // Calculate mint reward (5% of burned amount)
            setMintReward(calculatedMintReward.toFixed(2));
        } catch (error) {
            console.error("Error burning tokens:", error);
            alert('Transaction failed. Please try again.');
        }
    };


const [burnRate, setBurnRate] = useState(3); // Default burn rate

useEffect(() => {
    // Logic to fetch and set dynamic burn rates
}, []);

return (
    <div>
        <h2>Burn Simulator</h2>
        <p>Current Burn Rate: {burnRate}%</p>

            <input 
                type="number" 
                value={burnAmount} 
                onChange={(e) => setBurnAmount(e.target.value)} 
                placeholder="Enter BMT amount to burn" 
            />
            <button onClick={handleBurnSimulation}>Simulate Burn</button>
            <div id="simulationResults">
                <p>Estimated Mint Reward: <span>{mintReward}</span> BMT</p>
                <p>New Burn Rate: <span>{newBurnRate}</span>%</p>
            </div>
        </div>
    );
};

export default BurnSimulator;
