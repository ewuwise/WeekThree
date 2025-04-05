import { ethers } from 'ethers';
import { useState } from 'react';

const BatchBurn = ({ library, batchTransactions }) => {
  const [simulationResults, setSimulationResults] = useState([]);

  const simulateBatch = async () => {
    if (!library || batchTransactions.length === 0) return;
    
    const results = [];
    for (const tx of batchTransactions) {
      try {
        const contract = new ethers.Contract(
          "0xYourContractAddress",
          ["function burn(uint256 amount)"],
          library
        );
        
        const data = contract.interface.encodeFunctionData("burn", [
          ethers.utils.parseEther(tx.amount.toString())
        ]);
        
        const gasEstimate = await library.estimateGas({
          to: contract.address,
          data
        });
        
        results.push({
          id: tx.id,
          success: true,
          gasEstimate: ethers.utils.formatUnits(gasEstimate, 'gwei')
        });
      } catch (error) {
        results.push({
          id: tx.id,
          success: false,
          error: error.reason || error.message
        });
      }
    }
    setSimulationResults(results);
  };

  return (
    <div className="batch-simulation">
      <button onClick={simulateBatch}>Simulate Batch</button>
      {simulationResults.length > 0 && (
        <div className="simulation-results">
          <h4>Batch Simulation Results</h4>
          {batchTransactions.map(tx => {
            const result = simulationResults.find(r => r.id === tx.id);
            return (
              <div key={tx.id} className={`result ${result?.success ? 'success' : 'error'}`}>
                {tx.amount} BMT: {result?.success 
                  ? `✅ ${result.gasEstimate} gwei` 
                  : `❌ ${result?.error}`
                }
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BatchBurn;
