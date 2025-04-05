import {
  connectWallet,
  defaultProvider,
  disconnectWallet,
  getActiveProvider,
  injectedProvider,
  signer
} from '../BMTverse/wallet';
import { createContext, useContext, useEffect, useState } from 'react';

import BMTverse from '../contracts/BMTverse.json';
import { ethers } from 'ethers';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [contract, setContract] = useState(null);
    const [error, setError] = useState(null);
    const [account, setAccount] = useState(null);
    const [chainId, setChainId] = useState(null);
    const [lastSignature, setLastSignature] = useState(null);
    const [lastVerifiedAddress, setLastVerifiedAddress] = useState(null);

  const handleError = (err, context) => {
    console.error(`[Web3Context] ${context} Error:`, err);
    setError({
      message: err.message,
      code: err.code,
      context
    });
    return null;
  };

  const switchNetwork = async (targetChainId) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (err) {
      handleError(err, 'Network Switch');
    }
  };

  const updateAccount = async () => {
    if (signer) {
      try {
        const address = await signer.getAddress();
        const network = await injectedProvider.getNetwork();
        setAccount(address);
        setChainId(network.chainId);
      } catch (err) {
        handleError(err, 'Account Update');
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        // Initialize contract with active provider
        const provider = getActiveProvider();
        const contract = new ethers.Contract(
          contractAddress, 
          BMTverse.abi, 
          signer || provider
        );
        setContract(contract);
        
        // Only try to update account if we have an injected provider
        if (injectedProvider) {
          await updateAccount();
        }
      } catch (err) {
        handleError(err, 'Contract Initialization');
      }
      setIsLoading(false);
    };

    init();

    return () => {
      // Clean up when context unmounts
      if (injectedProvider) {
        disconnectWallet();
      }
    };
  }, []);

  // Get current block number
  const getBlockNumber = async () => {
    try {
      const provider = getActiveProvider();
      return await provider.getBlockNumber();
    } catch (err) {
      return handleError(err, 'Get Block Number');
    }
  };

  // Get balance for address/ENS
  const getBalance = async (address) => {
    try {
      const provider = getActiveProvider();
      return await provider.getBalance(address);
    } catch (err) {
      return handleError(err, 'Get Balance');
    }
  };

  // Format wei to ether
  const formatEther = (wei) => {
    try {
      return ethers.utils.formatEther(wei);
    } catch (err) {
      return handleError(err, 'Format Ether');
    }
  };

  // Parse ether to wei
  const parseEther = (ether) => {
    try {
      return ethers.utils.parseEther(ether);
    } catch (err) {
      return handleError(err, 'Parse Ether');
    }
  };

  // Sign message wrapper with error handling
  const signMessage = async (message) => {
    try {
      const signature = await signer.signMessage(message);
      setLastSignature(signature);
      return signature;
    } catch (err) {
      return handleError(err, 'Sign Message');
    }
  };

  // Sign typed data wrapper with error handling
  const signTypedData = async (domain, types, value) => {
    try {
      const signature = await signer._signTypedData(domain, types, value);
      setLastSignature(signature);
      return signature;
    } catch (err) {
      return handleError(err, 'Sign Typed Data');
    }
  };

  // Verify message wrapper with error handling
  const verifyMessage = async (message, signature) => {
    try {
      const address = ethers.utils.verifyMessage(message, signature);
      setLastVerifiedAddress(address);
      return address;
    } catch (err) {
      return handleError(err, 'Verify Message');
    }
  };

  return (
    <Web3Context.Provider
      value={{
        connectWallet,
        switchNetwork,
        account,
        provider: getActiveProvider(),
        isConnected: !!injectedProvider,
        isLoading,
        error,
        contract,
        chainId,
        getBlockNumber,
        getBalance,
        formatEther,
        parseEther,
        signMessage,
        signTypedData,
        verifyMessage,
        lastSignature,
        lastVerifiedAddress
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
