import { useEffect, useState } from 'react';

import { ethers } from 'ethers';

const TransactionSimulator = ({ transaction, provider, setSimulationCost }) => {
  const [simulation, setSimulation] = useState(null);
  const [error, setError] = useState('');

  const estimateSimulationCost = async (provider, simulationCount) => {
    const SIMULATION_GAS = 150000; 
    try {
      const gasPrice = await provider.getGasPrice();
      const totalGas = SIMULATION_GAS * simulationCount;
      const cost = gasPrice.mul(totalGas);
      return {
        eth: ethers.utils.formatEther(cost),
        usd: (parseFloat(ethers.utils.formatEther(cost)) * 3000) // Mock ETH price
      };
    } catch (error) {
      console.error("Cost estimation failed:", error);
      return null;
    }
  };

  useEffect(() => {
    if (transaction) {
      estimateSimulationCost(provider, 1).then(setSimulationCost);
    }
  }, [transaction, provider, setSimulationCost]);

  useEffect(() => {
    const simulate = async () => {
      try {
        const result = await provider.call({
          to: transaction.to,
          data: transaction.data,
          from: transaction.from,
          value: transaction.value
        });
        
        const iface = new ethers.utils.Interface(transaction.abi);
        const decoded = iface.decodeFunctionResult(transaction.method, result);
        
        setSimulation({
          success: true,
          result: decoded,
          gasUsed: await provider.estimateGas({
            to: transaction.to,
            data: transaction.data
          })
        });
      } catch (e) {
        setError(e.reason || e.message);
        setSimulation({ success: false });
      }
    };
    
    if (transaction) simulate();
  }, [transaction]);

  return (
    <div className="simulator">
      <h4>Transaction Simulation</h4>
      {error && <div className="error">{error}</div>}
      {simulation?.success && (
        <div className="simulation-result">
          <p>✅ Simulation successful</p>
          <p>Estimated gas: {ethers.utils.formatUnits(simulation.gasUsed, 'gwei')} gwei</p>
          <pre>{JSON.stringify(simulation.result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TransactionSimulator;
