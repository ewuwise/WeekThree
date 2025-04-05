import { ethers } from 'ethers';

// Token Contract Configurations
const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F'; // Mainnet DAI
const BMT_ADDRESS = '0x1234567890123456789012345678901234567890'; // Test BMT address - replace with official
const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address) view returns (uint)",
  "function transfer(address to, uint amount)",
  "event Transfer(address indexed from, address indexed to, uint amount)"
];

// Default provider configuration
const DEFAULT_RPC_URL = 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID';
let defaultProvider = new ethers.providers.JsonRpcProvider(DEFAULT_RPC_URL);

// Injected provider (MetaMask)
let injectedProvider;
let signer;
let currentAccount = null;

// Get the active provider (defaults to defaultProvider)
function getActiveProvider() {
  return injectedProvider || defaultProvider;
}

export function handleChainChanged(chainId) {
    console.log('Chain changed:', chainId);
    window.location.reload();
}

export function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        console.log('Disconnected');
        currentAccount = null;
    } else if (accounts[0] !== currentAccount) {
        currentAccount = accounts[0];
        console.log('Account changed:', currentAccount);
    }
}

export async function connectWallet() {
    const connectButton = document.getElementById('connect-btn');
    const statusElement = document.getElementById('wallet-status');
    
    try {
        // Update UI to show connecting state
        if (connectButton) {
            connectButton.innerText = 'Connecting...';
            connectButton.disabled = true;
        }
        if (statusElement) {
            statusElement.textContent = 'Connecting to wallet...';
            statusElement.className = 'text-yellow-500';
        }

        if (!window.ethereum) {
            throw new Error('NO_PROVIDER');
        }

        // Initialize provider and request accounts
        injectedProvider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await injectedProvider.send("eth_requestAccounts", []);
        
        if (accounts.length === 0) {
            throw new Error('NO_ACCOUNTS');
        }

        // Set up signer and current account
        signer = injectedProvider.getSigner();
        currentAccount = accounts[0];
        
        // Get network information
        const network = await injectedProvider.getNetwork();
        
        // Update UI with connection details
        if (connectButton) {
            connectButton.innerText = `Connected: ${currentAccount.substring(0, 6)}...`;
            connectButton.title = `Network: ${network.name} (${network.chainId})`;
        }
        if (statusElement) {
            statusElement.textContent = `Connected to ${network.name}`;
            statusElement.className = 'text-green-500';
        }

        // Set up listeners and persistence
        localStorage.setItem('walletConnected', 'true');
        setupWalletEventListeners();

        console.log("Wallet connected:", {
            account: currentAccount,
            network: network.name,
            chainId: network.chainId
        });

        return {
            account: currentAccount,
            network,
            provider: injectedProvider
        };
    } catch (error) {
        console.error("Wallet connection error:", error);
        
        let errorMsg = "Could not connect to wallet";
        if (error.message === 'NO_PROVIDER') {
            errorMsg = "Please install MetaMask or another Web3 wallet";
        } else if (error.code === 4001 || error.message === 'NO_ACCOUNTS') {
            errorMsg = "Connection rejected by user";
        } else if (error.code === -32002) {
            errorMsg = "Wallet connection already in progress";
        }

        // Update error state in UI
        if (statusElement) {
            statusElement.textContent = errorMsg;
            statusElement.className = 'text-red-500';
        }

        resetConnectionUI(connectButton);
        throw new Error(errorMsg);
    }
}

function setupWalletEventListeners() {
    if (!window.ethereum) return;

    // Remove existing listeners to avoid duplicates
    window.ethereum.removeAllListeners('chainChanged');
    window.ethereum.removeAllListeners('accountsChanged');

    // Set up new listeners
    window.ethereum.on('chainChanged', (chainId) => {
        console.log('Chain changed:', chainId);
        window.location.reload();
    });

    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
            console.log('Disconnected');
            disconnectWallet();
        } else {
            currentAccount = accounts[0];
            console.log('Account changed:', currentAccount);
            // Update UI with new account
            const connectButton = document.getElementById('connect-btn');
            if (connectButton) {
                connectButton.innerText = `Connected: ${currentAccount.substring(0, 6)}...`;
            }
        }
    });
}

export function resetConnectionUI(button) {
    if (button) {
        button.innerText = 'Connect Wallet';
        button.disabled = false;
    }
}

export function disconnectWallet() {
    // Clean up all active transfer listeners
    activeListeners.forEach((listener, key) => {
        const [contractAddress] = key.split(':');
        const contract = contractAddress === DAI_ADDRESS ? getDAIContract() : getBMTContract();
        contract.off("Transfer", listener);
    });
    activeListeners.clear();
    
    currentAccount = null;
    localStorage.removeItem('walletConnected');
    const connectButton = document.getElementById('connect-btn');
    resetConnectionUI(connectButton);
}

// Send ETH to an ENS name
async function sendToENS(ensName, amountEth) {
    if (!signer) {
        throw new Error("No signer available - connect wallet first");
    }
    
    try {
        const resolvedAddress = await getActiveProvider().resolveName(ensName);
        if (!resolvedAddress) {
            throw new Error(`Could not resolve ENS name: ${ensName}`);
        }
        
        const tx = await signer.sendTransaction({
            to: resolvedAddress,
            value: ethers.utils.parseEther(amountEth.toString())
        });
        
        console.log(`Sent ${amountEth} ETH to ${ensName} (${resolvedAddress})`);
        return tx;
    } catch (error) {
        console.error("ENS transaction error:", error);
        throw error;
    }
}

// Event listener storage
const activeListeners = new Map();

// Listen to all transfer events for a contract
function listenToAllTransfers(contract, callback) {
  const listener = (from, to, amount, event) => {
    callback({
      from,
      to,
      amount: ethers.utils.formatUnits(amount, 18),
      event
    });
  };
  
  contract.on("Transfer", listener);
  activeListeners.set(contract.address, listener);
  console.log(`Listening to all transfers for ${contract.address}`);
}

// Listen to transfers involving a specific account
function listenToAccountTransfers(contract, account, callback) {
  const filter = contract.filters.Transfer(null, account);
  const listener = (from, to, amount, event) => {
    callback({
      from,
      to,
      amount: ethers.utils.formatUnits(amount, 18),
      event
    });
  };
  
  contract.on(filter, listener);
  activeListeners.set(`${contract.address}:${account}`, listener);
  console.log(`Listening to transfers for account ${account} on ${contract.address}`);
}

// Stop listening to transfer events
function stopListeningToTransfers(contract, account = null) {
  const key = account ? `${contract.address}:${account}` : contract.address;
  const listener = activeListeners.get(key);
  
  if (listener) {
    contract.off("Transfer", listener);
    activeListeners.delete(key);
    console.log(`Stopped listening to transfers for ${key}`);
  }
}

// Query transfer events
async function queryTransfersFrom(address, fromBlock = 'latest', toBlock = 'latest') {
  if (!address) throw new Error("No address provided");
  const contract = getBMTContract();
  const filter = contract.filters.Transfer(address, null);
  const events = await contract.queryFilter(filter, fromBlock, toBlock);
  return processTransferEvents(events);
}

async function queryTransfersTo(address, fromBlock = 'latest', toBlock = 'latest') {
  if (!address) throw new Error("No address provided");
  const contract = getBMTContract();
  const filter = contract.filters.Transfer(null, address);
  const events = await contract.queryFilter(filter, fromBlock, toBlock);
  return processTransferEvents(events);
}

async function queryAllTransfers(fromBlock = 'latest', toBlock = 'latest') {
  const contract = getBMTContract();
  const events = await contract.queryFilter('Transfer', fromBlock, toBlock);
  return processTransferEvents(events);
}

function processTransferEvents(events) {
  return events.map(event => ({
    transactionHash: event.transactionHash,
    blockNumber: event.blockNumber,
    from: event.args.from,
    to: event.args.to,
    amount: ethers.utils.formatUnits(event.args.amount, 18),
    timestamp: null // Will be populated later
  }));
}

// Get token contract instances
function getDAIContract() {
  return new ethers.Contract(DAI_ADDRESS, ERC20_ABI, getActiveProvider());
}

function getBMTContract() {
  return new ethers.Contract(BMT_ADDRESS, ERC20_ABI, getActiveProvider());
}

// Get token balances
async function getDAIBalance(address = currentAccount) {
  if (!address) throw new Error("No address provided");
  const daiContract = getDAIContract();
  return await daiContract.balanceOf(address);
}

async function getBMTBalance(address = currentAccount) {
  if (!address) throw new Error("No address provided");
  const bmtContract = getBMTContract();
  return await bmtContract.balanceOf(address);
}

// Transfer tokens
async function transferDAI(toAddress, amount) {
  if (!signer) throw new Error("No signer available - connect wallet first");
  const daiContract = getDAIContract().connect(signer);
  const tx = await daiContract.transfer(toAddress, ethers.utils.parseUnits(amount.toString(), 18));
  return tx;
}

async function transferBMT(toAddress, amount) {
  if (!signer) throw new Error("No signer available - connect wallet first");
  const bmtContract = getBMTContract().connect(signer);
  const tx = await bmtContract.transfer(toAddress, ethers.utils.parseUnits(amount.toString(), 18));
  return tx;
}

// Sign a message with the current signer
async function signMessage(message) {
    if (!signer) throw new Error("No signer available - connect wallet first");
    try {
        return await signer.signMessage(message);
    } catch (error) {
        console.error("Message signing error:", error);
        throw error;
    }
}

// Sign typed data (EIP-712)
async function signTypedData(domain, types, value) {
    if (!signer) throw new Error("No signer available - connect wallet first");
    try {
        return await signer._signTypedData(domain, types, value);
    } catch (error) {
        console.error("Typed data signing error:", error);
        throw error;
    }
}

// Verify a signed message
function verifyMessage(message, signature) {
    try {
        return ethers.utils.verifyMessage(message, signature);
    } catch (error) {
        console.error("Message verification error:", error);
        throw error;
    }
}

export { 
    defaultProvider,
    injectedProvider,
    getActiveProvider,
    signer, 
    connectWallet, 
    disconnectWallet,
    sendToENS,
    getDAIContract,
    getBMTContract,
    getDAIBalance,
    getBMTBalance,
    transferDAI,
    transferBMT,
    listenToAllTransfers,
    listenToAccountTransfers,
    stopListeningToTransfers,
    queryTransfersFrom,
    queryTransfersTo,
    queryAllTransfers,
    signMessage,
    signTypedData,
    verifyMessage
};

