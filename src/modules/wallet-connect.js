import { ethers } from 'ethers';
import { 
  connectWallet, 
  disconnectWallet,
  getActiveProvider,
  getBMTBalance,
  getDAIBalance
} from '../BMTverse/wallet.js';

// Wallet connection state
let connectionState = {
  isConnected: false,
  account: null,
  network: null,
  balances: {
    bmt: '0',
    dai: '0'
  }
};

// Initialize wallet connection with enhanced features
export async function initWalletConnect() {
  try {
    // Set up event listeners if window.ethereum exists
    if (window.ethereum) {
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    // Initialize connect button if it exists
    const connectButton = document.getElementById('connect-btn');
    if (connectButton) {
      connectButton.addEventListener('click', async () => {
        try {
          await connectWallet();
          startBalancePolling();
        } catch (error) {
          console.error('Connection failed:', error);
        }
      });
    }

    // Auto-connect if previously connected
    if (localStorage.getItem('walletConnected') === 'true' && window.ethereum) {
      const connection = await connectWallet();
      updateConnectionState(connection);
      startBalancePolling();
    }

    return connectionState;
  } catch (error) {
    console.error('Wallet connection initialization failed:', error);
    throw error;
  }
}

// Update connection state
function updateConnectionState(connection) {
  connectionState = {
    ...connectionState,
    isConnected: true,
    account: connection.account,
    network: connection.network.name
  };
}

// Start polling for balance updates
function startBalancePolling() {
  if (!connectionState.isConnected) return;

  // Initial balance fetch
  updateBalances();

  // Set up interval for polling (every 15 seconds)
  const pollInterval = setInterval(updateBalances, 15000);

  // Clean up on disconnect
  window.addEventListener('beforeunload', () => {
    clearInterval(pollInterval);
  });
}

// Update token balances
async function updateBalances() {
  try {
    const [bmtBalance, daiBalance] = await Promise.all([
      getBMTBalance(connectionState.account),
      getDAIBalance(connectionState.account)
    ]);

    connectionState.balances = {
      bmt: ethers.utils.formatUnits(bmtBalance, 18),
      dai: ethers.utils.formatUnits(daiBalance, 18)
    };

    // Dispatch event for UI updates
    const event = new CustomEvent('walletBalanceUpdate', {
      detail: connectionState.balances
    });
    window.dispatchEvent(event);
  } catch (error) {
    console.error('Balance update failed:', error);
  }
}

// Get current connection state
export function getConnectionState() {
  return connectionState;
}

// Handle disconnection
export async function handleDisconnect() {
  try {
    await disconnectWallet();
    connectionState = {
      isConnected: false,
      account: null,
      network: null,
      balances: {
        bmt: '0',
        dai: '0'
      }
    };
    return true;
  } catch (error) {
    console.error('Disconnection failed:', error);
    throw error;
  }
}

// Handle chain changes
function handleChainChanged(chainId) {
  console.log('Chain changed:', chainId);
  window.location.reload();
}

// Handle account changes
function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    console.log('Disconnected');
    handleDisconnect().catch(console.error);
  } else {
    let currentAccount = accounts[0];
    console.log('Account changed:', currentAccount);
    updateConnectionState({ account: currentAccount });
  }
}

// Export the core wallet functions
export { connectWallet, disconnectWallet, getConnectionState, handleDisconnect };
