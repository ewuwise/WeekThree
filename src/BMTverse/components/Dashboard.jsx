import React, { useEffect, useState } from "react";

import BurnSimulator from "./BurnSimulator";
import LiveTokenMetrics from "./LiveTokenMetrics";
import { ethers } from "ethers";

export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    connectWallet();
  }, []);

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const balance = await provider.getBalance(address);
        setBalance(ethers.formatEther(balance));
      } catch (error) {
        console.error("Wallet connection error:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold">BMTverse Dashboard</h1>
      <div className="mt-6 p-4 bg-gray-800 rounded-xl">
        <p className="text-lg">Wallet Address: {account || "Not connected"}</p>
        <p className="text-lg">Balance: {balance} ETH</p>
        {!account && (
          <button
            onClick={connectWallet}
            className="mt-4 bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
          >
            Connect Wallet
          </button>
        )}
      </div>
      <LiveTokenMetrics />
      <BurnSimulator />
    </div>
  );
}
