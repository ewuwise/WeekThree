import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import MessageSigner from './MessageSigner';
import WalletConnect from '@walletconnect/web3-provider';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';

const WalletModal = ({ isOpen, onClose }) => {
  const { activate } = useWeb3();
  const [connecting, setConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState(''); // New state for wallet address


  const providerOptions = {
    coinbasewallet: {
      package: CoinbaseWalletSDK,
      options: {
        appName: "BMT Burn Portal",
        infuraId: "YOUR_INFURA_KEY",
        rpc: {
          1337: "http://localhost:7545" // Ganache
        }
      }
    },
    walletconnect: {
      package: WalletConnect,
      options: {
        rpc: {
          1: "https://mainnet.infura.io/v3/YOUR_INFURA_KEY",
          5: "https://goerli.infura.io/v3/YOUR_INFURA_KEY"
        }
      }
    }
  };

  const connect = async (connector) => {
    setConnecting(true);
    try {
      if (connector === 'injected') {
        await activate(injected);
      } else if (connector === 'coinbase') {
        const web3Modal = new Web3Modal({
          cacheProvider: true,
          providerOptions
        });
        const provider = await web3Modal.connectTo('coinbasewallet');
        await activate(provider);
      } else {
        const web3Modal = new Web3Modal({
          cacheProvider: true,
          providerOptions
        });
        const provider = await web3Modal.connect();
        await activate(provider);
      }
      setWalletAddress(provider.accounts[0]); // Set the wallet address
      onClose();

    } catch (error) {
      console.error(error);
    } finally {
      setConnecting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        {!walletAddress ? (
          <>
            <h3>Connect Wallet</h3>
            <button 
              onClick={() => connect('injected')} 
              disabled={connecting}
            >
              {connecting ? 'Connecting...' : 'MetaMask'}
            </button>
            <button 
              onClick={() => connect('walletconnect')} 
              disabled={connecting}
            >
              {connecting ? 'Connecting...' : 'WalletConnect'}
            </button>
            <button 
              onClick={() => connect('coinbase')} 
              disabled={connecting}
            >
              {connecting ? 'Connecting...' : 'Coinbase Wallet'}
            </button>
            <button onClick={onClose}>Cancel</button>
          </>
        ) : (
          <>
            <div className="wallet-info">
              <h3>Connected Wallet</h3>
              <p>{walletAddress.substring(0, 6)}...{walletAddress.substring(38)}</p>
              <button onClick={onClose}>Close</button>
            </div>
            <MessageSigner />
          </>
        )}
      </div>
    </div>
  );
};

export default WalletModal;
