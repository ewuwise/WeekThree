import React, { useEffect, useState } from 'react';

import { ethers } from 'ethers'; // Import ethers for blockchain interaction

const contractAddress = "0xYourContractAddress"; // Replace with your actual contract address

const abi = [
    // Your contract ABI goes here
];


const LiveTokenMetrics = () => {
    const [totalBurned, setTotalBurned] = useState(0);
    const [totalMinted, setTotalMinted] = useState(0);
    const [burnRate, setBurnRate] = useState(10); // Default burn rate

    useEffect(() => {
    const fetchTokenMetrics = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi, provider);
        
        const totalBurnedFromBlockchain = await contract.totalBurned(); // Replace with actual function
        const totalMintedFromBlockchain = await contract.totalMinted(); // Replace with actual function
        
        setTotalBurned(totalBurnedFromBlockchain.toString());
        setTotalMinted(totalMintedFromBlockchain.toString());
    };

    useEffect(() => {
        fetchTokenMetrics();
    }, []);

    }, []);


    return (
        <div className="card">
            <h2>Token Metrics</h2>
            <div className="metrics">
                <p>Total Burned: <span>{totalBurned}</span> BMT</p>
                <p>Total Minted: <span>{totalMinted}</span> BMT</p>
                <p>Current Burn Rate: <span>{burnRate}</span>%</p>
            </div>
        </div>
    );
};

export default LiveTokenMetrics;
