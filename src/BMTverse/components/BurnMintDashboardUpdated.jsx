import React, { useEffect, useState } from 'react';

import BurnAndMintToken from '../contracts/BurnAndMintToken.json';
import LiveTokenMetrics from './LiveTokenMetrics';
import { calculateTieredReward } from '../utils/burnRewards';
import { ethers } from 'ethers';

function BurnMintDashboard() {
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [error, setError] = useState(null); // State for error handling
    const [isLoading, setIsLoading] = useState(false); // State for loading indicator
    const [burnAmount, setBurnAmount] = useState(0);
    const [mintAmount, setMintAmount] = useState(0);
    const [totalSupply, setTotalSupply] = useState(0);
    const [contract, setContract] = useState(null);
    const [totalBurned, setTotalBurned] = useState(0);
    const [totalMinted, setTotalMinted] = useState(0);
    const [burnRate, setBurnRate] = useState(10); // Default burn rate
    const [reward, setReward] = useState(0);
    const [alerts, setAlerts] = useState([]); // State for alerts
    const paymentWallet = "0x48Ee92E54C291b68275A1123f9F751BDBF2B8011"; // User's payment wallet account

    // Function to fetch alerts
    const fetchAlerts = async () => {
        const response = await fetch('/api/alerts');
        const data = await response.json();
        setAlerts(data.alerts);
    };

    useEffect(() => {
        fetchAlerts(); // Fetch alerts on component mount
    }, []);

    return (
        <div>
            <h1>Burn and Mint Dashboard</h1>
            {isLoading && <p>Loading...</p>} {/* Loading indicator */}
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Error message */}
            {alerts.length > 0 && (
                <div>
                    <h2>Alerts:</h2>
                    <ul>
                        {alerts.map((alert, index) => (
                            <li key={index}>{alert}</li>
                        ))}
                    </ul>
                </div>
            )}
            <input
                type="number"
                value={burnAmount}
                onChange={(e) => setBurnAmount(e.target.value)}
                placeholder="Amount to Burn"
            />
            <button onClick={handleBurn} disabled={isLoading}>Burn Tokens</button>
            <input
                type="number"
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
                placeholder="Amount to Mint"
            />
            <button onClick={handleMint} disabled={isLoading}>Mint Tokens</button>
            <LiveTokenMetrics />
            <h2>Total Supply: {totalSupply}</h2>
            <h2>Total Burned: {totalBurned} BMT</h2>
            <h2>Total Minted: {totalMinted} BMT</h2>
            <h2>Current Burn Rate: {burnRate}%</h2>
            <h2>Base Reward: {reward.baseReward}</h2>
            <h2>Bonus Reward: {reward.bonus}</h2>
            <h2>Total Potential Reward: {reward.baseReward + reward.bonus}</h2>
            <h2>Payment Wallet: {paymentWallet}</h2> {/* Displaying the payment wallet */}
        </div>
    );
}

export default BurnMintDashboard;
