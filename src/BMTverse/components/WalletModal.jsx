import React from 'react';

const WalletModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="wallet-modal">
      <div className="wallet-options">
        <button className="wallet-option" id="binanceOption">
          <img src="assets/wallets/binance.svg" alt="Binance Chain Wallet" />
          <span>Binance Chain Wallet</span>
        </button>
        <button className="wallet-option" id="braveOption">
          <img src="assets/wallets/brave.svg" alt="Brave Wallet" />
          <span>Brave Wallet</span>
        </button>
        <button className="wallet-option" id="phantomOption">
          <img src="assets/wallets/phantom.svg" alt="Phantom" />
          <span>Phantom (Solana)</span>
        </button>
      </div>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default WalletModal;
