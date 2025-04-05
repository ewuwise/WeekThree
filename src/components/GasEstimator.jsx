import { useEffect, useState } from 'react';

import { ethers } from 'ethers';
import { useWeb3 } from '../context/Web3Context';

const GasEstimator = ({ transactionData }) => {
  const { library } = useWeb3();
  const [gasInfo, setGasInfo] = useState({
    estimatedGas: '--',
    gasPrice: '--',
    costInEth: '--'
  });

  useEffect(() => {
    const estimateGas = async () => {
      if (!library || !transactionData) return;
      
      try {
        // Example for a burn transaction
        const contract = new ethers.Contract(
          transactionData.contractAddress,
          transactionData.abi,
          library.getSigner()
        );
        
        const [estimatedGas, gasPrice] = await Promise.all([
          contract.estimateGas.burn(
            ethers.utils.parseEther(transactionData.amount)
          ),
          library.getGasPrice()
        ]);
        
        const cost = estimatedGas.mul(gasPrice);
        
        setGasInfo({
          estimatedGas: estimatedGas.toString(),
          gasPrice: ethers.utils.formatUnits(gasPrice, 'gwei'),
          costInEth: ethers.utils.formatEther(cost)
        });
      } catch (error) {
        console.error("Gas estimation failed:", error);
      }
    };
    
    estimateGas();
  }, [transactionData, library]);

  return (
    <div className="gas-estimator">
      <h4>Gas Estimation</h4>
      <div className="gas-details">
        <p>Estimated Gas: <span>{gasInfo.estimatedGas}</span></p>
        <p>Gas Price: <span>{gasInfo.gasPrice} Gwei</span></p>
        <p>Estimated Cost: <span>{gasInfo.costInEth} ETH</span></p>
      </div>
    </div>
  );
};

export default GasEstimator;
