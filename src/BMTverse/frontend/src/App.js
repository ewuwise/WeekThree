import './App.css';

import React, { useState } from 'react';

import ConnectWalletCommand from './components/ConnectWalletCommand';
import GasEstimator from './components/GasEstimator';
import TransactionHistory from './components/TransactionHistory';
import WalletModal from './components/WalletModal';
import { Web3Provider } from './context/Web3Context';
import PurchaseBMT from './components/PurchaseBMT';

function App() {
  const [showWalletModal, setShowWalletModal] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <ConnectWalletCommand />

        <h1>BMTverse.io</h1>
        <p>Revolutionizing tokenomics through an innovative burn-and-mint model.</p>
      </header>
      <main> 
        <button onClick={() => setShowWalletModal(true)}>
          Connect Wallet
        </button>
        <WalletModal 
          isOpen={showWalletModal} 
          onClose={() => setShowWalletModal(false)} 
        />
        <TransactionHistory />
        <GasEstimator transactionData={{ contractAddress: "0xYourContractAddress", abi: contractABI, amount: burnAmount }} />
        <h2>Features</h2>
        <ul>
          <li>Burn-to-Mint: Users burn tokens to receive minting rewards.</li>
          <li>Governance: Token holders vote on burn rates and minting parameters.</li>
          <li>Gamification: Complete challenges to earn rewards.</li>
        </ul>
      </main>
    </div>
  );
}

export default App;
