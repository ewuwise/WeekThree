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
    const paymentWallet = "0x48Ee92E54C291b68275A1123f9F751BDBF2B8011"; // User's payment wallet account

    useEffect(() => {
        const fetchTokenMetrics = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const tokenContract = new ethers.Contract(
                'YOUR_CONTRACT_ADDRESS', // Replace with your contract address
                BurnAndMintToken.abi,
                provider
            );
            const totalBurnedFromBlockchain = await tokenContract.totalBurned(); // Replace with actual function
            const totalMintedFromBlockchain = await tokenContract.totalMinted(); // Replace with actual function
            
            setTotalBurned(totalBurnedFromBlockchain.toString());
            setTotalMinted(totalMintedFromBlockchain.toString());
        };

        const loadContract = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const tokenContract = new ethers.Contract(
                'YOUR_CONTRACT_ADDRESS', // Replace with your contract address
                BurnAndMintToken.abi,
                signer
            );
            setContract(tokenContract);
            const supply = await tokenContract.totalSupply();
            setTotalSupply(supply.toString());
        };

        loadContract();
        const interval = setInterval(() => {
            fetchTokenMetrics();
        }, 5000); // Fetch metrics every 5 seconds

        return () => clearInterval(interval); // Clear interval on unmount
    }, []);

    const handleBurn = async () => {
        const calculatedReward = calculateTieredReward(burnAmount);
        setReward(calculatedReward.baseReward + calculatedReward.bonus);

        if (contract) {
            const confirmBurn = window.confirm("Are you sure you want to burn these tokens?");
            if (confirmBurn) {
                setIsLoading(true); // Start loading
                try {
                    const tx = await contract.burn(ethers.utils.parseUnits(burnAmount.toString(), 18));
                    await tx.wait();
                    alert(`Tokens burned successfully! You earned ${calculatedReward.baseReward + calculatedReward.bonus} rewards!`);
                } catch (err) {
                    setError("Transaction failed. Please try again.");
                } finally {
                    setIsLoading(false); // Stop loading
                }
            }
        }
    };

    const handleMint = async () => {
        if (contract) {
            const confirmMint = window.confirm("Are you sure you want to mint these tokens?");
            if (confirmMint) {
                setIsLoading(true); // Start loading
                try {
                    const tx = await contract.mint(ethers.utils.parseUnits(mintAmount.toString(), 18));
                    await tx.wait();
                    alert('Tokens minted successfully! Check your wallet for the new tokens.');
                } catch (err) {
                    setError("Transaction failed. Please try again.");
                } finally {
                    setIsLoading(false); // Stop loading
                }
            }
        }
    };

    return (
        <div>
            <h1>Burn and Mint Dashboard</h1>
            {isLoading && <p>Loading...</p>} {/* Loading indicator */}
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Error message */}
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
