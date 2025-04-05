const express = require('express');
const router = express.Router();
const { calculateTieredReward } = require('../utils/burnRewards'); // Import the reward calculation function
const { ethers } = require('ethers');
const BurnAndMintToken = require('../contracts/BurnAndMintToken.json'); // Import the contract ABI

// Connect to Ethereum provider
const provider = new ethers.providers.Web3Provider(window.ethereum);
const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your contract address
const tokenContract = new ethers.Contract(contractAddress, BurnAndMintToken.abi, provider);

// Endpoint to fetch personalized rewards
router.get('/personalized-rewards', async (req, res) => {
    const userId = parseInt(req.query.userId);
    
    try {
        // Fetch rewards from the smart contract
        const rewards = await tokenContract.getRewards(userId); // Assuming getRewards is a function in your contract
        res.json(rewards);
    } catch (error) {
        console.error("Error fetching rewards:", error);
        res.status(500).json({ message: 'Error fetching rewards' });
    }
});

module.exports = router;
