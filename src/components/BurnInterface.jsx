import { useEffect, useState } from 'react';

import { calculateTieredReward } from '../utils/burnRewards';
import { ethers } from 'ethers';
import { useWeb3 } from '../context/Web3Context';

const BurnInterface = () => {
  const { account, library, active } = useWeb3();
  const [burnAmount, setBurnAmount] = useState('');
  const [txStatus, setTxStatus] = useState('');
  const [simulationResult, setSimulationResult] = useState(null);

  // Mock BMT contract ABI (replace with actual)
  const contractABI = [
    "function burn(uint256 amount) public",
    "function calculateReward(uint256 amount) public view returns (uint256)"
  ];
  
  const contractAddress = "0xYourContractAddress";

  const simulateBurn = async () => {
    if (!active) return alert("Connect wallet first");
    
    const amount = parseFloat(burnAmount); // Ensure amount is a number
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount to burn");
      return;
    }

    try {
      // Get tiered rewards
      const rewardData = calculateTieredReward(amount); // Calculate rewards based on amount
      console.log("Reward Data:", rewardData); // Debug log
      const baseReward = rewardData?.baseReward || 0; // Ensure baseReward is defined
      const bonus = rewardData?.bonus || 0; // Ensure bonus is defined
      const tier = rewardData?.tier || 0; // Ensure tier is defined

      const totalReward = baseReward + bonus;

      const newSupply = await contract.totalSupply(); // Fetch new supply from contract
      setSimulationResult({
        newSupply,
        tokensBurned: amount,
        baseReward,
        bonus,
        totalReward,
        tier,
        newSupply: "Calculating..." // Would fetch from contract
      });
      
    } catch (error) {
      console.error("Simulation error:", error);
    }
  };

  const executeBurn = async () => {
    setTxStatus('Pending...');
    try {
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        library.getSigner()
      );
      
      const tx = await contract.burn(
        ethers.utils.parseEther(burnAmount)
      );
      
      await tx.wait();
      setTxStatus('Success!');
      // Refresh data
      simulateBurn();
    } catch (error) {
      console.error(error);
      setTxStatus('Failed');
    }
  };

  return (
    <div className="burn-container">
      <h2>Burn Simulation</h2>
      
      <div className="input-group">
        <input
          type="number"
          value={burnAmount}
          onChange={(e) => setBurnAmount(e.target.value)}
          placeholder="Amount to burn"
        />
        <button onClick={simulateBurn}>Simulate</button>
      </div>
      
      {simulationResult && (
        <div className="simulation-results">
          <h3>Projected Results</h3>
          <p>Tokens to Burn: {simulationResult.tokensBurned}</p>
          <p>Base Reward: {simulationResult.baseReward.toFixed(2)} BMT</p>
          <p>Bonus: {simulationResult.bonus.toFixed(2)} BMT (+
            {((simulationResult.bonus / simulationResult.baseReward) * 100).toFixed(0)}%)
          </p>
          <p>Total Reward: <strong>{simulationResult.totalReward.toFixed(2)} BMT</strong></p>
          <p>Tier: {simulationResult.tier}</p>
          <p>New Supply: {simulationResult.newSupply}</p>
          
          <button 
            onClick={executeBurn}
            disabled={!burnAmount || txStatus === 'Pending...'}
          >
            {txStatus || "Confirm Burn"}
          </button>
        </div>
      )}
    </div>
  );
};

export default BurnInterface;
