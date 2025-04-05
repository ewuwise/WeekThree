const express = require('express');
const tf = require('@tensorflow/tfjs-node');
const cors = require('cors');
const { ethers } = require('ethers');

const app = express();
app.use(cors());
app.use(express.json());

let model;
const PORT = 5000;

// Load model on startup
async function loadModel() {
  model = await tf.loadLayersModel('file://./models/model.json');
  console.log('AI Model loaded');
}
loadModel();

// API Endpoints
app.post('/api/predict', async (req, res) => {
  try {
    const { walletAddress, chainId } = req.body;
    
    // Get blockchain data
    const provider = new ethers.providers.JsonRpcProvider(getRpcUrl(chainId));
    const balance = await provider.getBalance(walletAddress);
    const tokenBalance = await getTokenBalance(walletAddress, provider);
    
    // Prepare input tensor
    const inputData = [
      normalize(balance, 0, 100), 
      normalize(tokenBalance, 0, 10000),
      getActivityScore(walletAddress),
      Date.now() / 1000000000000 // Normalized timestamp
    ];
    
    const inputTensor = tf.tensor2d([inputData]);
    const prediction = model.predict(inputTensor);
    const results = await prediction.data();
    
    // Generate recommendation
    const action = getRecommendedAction(results);
    
    res.json({
      action,
      confidence: Math.max(...results),
      timestamp: Date.now(),
      suggestedAmount: calculateSuggestedAmount(results, tokenBalance)
    });
    
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'AI prediction failed' });
  }
});

// Wallet activation endpoint
app.post('/api/activate', async (req, res) => {
  const { signature, walletAddress, chainId } = req.body;
  
  // Verify signature
  const verified = verifySignature(signature, walletAddress, chainId);
  if (!verified) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Activation logic
  const activationTx = await createActivationTx(walletAddress, chainId);
  
  res.json({
    status: 'success',
    txHash: activationTx.hash,
    activatedChains: [chainId]
  });
});

// Helper functions
function getRpcUrl(chainId) {
  const rpcs = {
    1: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
    137: 'https://polygon-rpc.com',
    56: 'https://bsc-dataseed.binance.org/'
  };
  return rpcs[chainId];
}

function verifySignature(signature, address, chainId) {
  const message = `Activate ${address} on chain ${chainId}`;
  const recovered = ethers.utils.verifyMessage(message, signature);
  return recovered.toLowerCase() === address.toLowerCase();
}

app.listen(PORT, () => {
  console.log(`AI Service running on port ${PORT}`);
});
