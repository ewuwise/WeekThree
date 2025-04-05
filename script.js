// State management
const state = {
  wallet: {
    connected: false,
    address: null,
    network: null
  },
  prices: {
    eth: null,
    bmt: null,
    history: []
  }
};

// State update functions
const updateState = (key, value) => {
  state[key] = {...state[key], ...value};
  updateUI();
};

const updateUI = () => {
  if (state.wallet.connected) {
    document.getElementById('connectWallet').innerHTML = `
      <i class="fas fa-check"></i> 
      ${state.wallet.address.substring(0, 6)}...${state.wallet.address.substring(38)}
    `;
  }
  // Update other UI elements based on state
};

// DOM Elements
const connectWalletBtn = document.getElementById('connectWallet');
const walletAddressEl = document.getElementById('walletAddress');
const totalSupplyEl = document.getElementById('totalSupply');
const circulatingSupplyEl = document.getElementById('circulatingSupply');
const burnedTokensEl = document.getElementById('burnedTokens');
const priceDisplay = document.createElement('div');
priceDisplay.id = 'priceDisplay';
document.querySelector('.metrics').prepend(priceDisplay);

// Chart initialization
const initChart = () => {
  const ctx = document.getElementById('tokenChart').getContext('2d');
  
  // Gradient for chart line
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(110, 69, 226, 0.8)');
  gradient.addColorStop(1, 'rgba(136, 211, 206, 0.2)');
  
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from({length: 30}, (_, i) => i + 1),
      datasets: [{
        label: 'Token Price (USD)',
        data: Array(30).fill(0),
        borderColor: gradient,
        backgroundColor: 'rgba(110, 69, 226, 0.1)',
        borderWidth: 3,
        pointRadius: 0,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Token Price History'
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(26, 26, 46, 0.9)',
          titleColor: '#88d3ce',
          bodyColor: '#ffffff',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: 'rgba(255, 255, 255, 0.6)' }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          ticks: { color: 'rgba(255, 255, 255, 0.6)' },
          beginAtZero: false
        }
      }
    }
  });
};

const tokenChart = initChart();

// Initialize with random data
for (let i = 0; i < 30; i++) {
    tokenChart.data.datasets[0].data[i] = 1800 + Math.sin(i/3) * 200 + Math.random() * 50;
}
tokenChart.update();

// Initialize price state


// Initialize simulated data
const initSimulatedData = () => {
  currentPrice = 1800 + Math.random() * 200;
  priceDisplay.innerHTML = `
    <i class="fab fa-ethereum"></i> Price: $${currentPrice.toFixed(2)} USD
    <small>(Simulated)</small>
  `;
  updateState('prices', {
    eth: currentPrice,
    bmt: currentPrice * 0.8,
    history: Array(30).fill(0).map((_, i) => currentPrice * (0.95 + Math.random() * 0.1))
  });
};

// Set initial price display
initSimulatedData();
// Check network
async function checkNetwork() {
    if (window.ethereum) {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        return chainId === '0x1'; // Mainnet
    }
    return false;
}

const connectWallet = async () => {
  try {
    if (!window.ethereum) throw new Error('No Ethereum provider found');
    
    // Request accounts
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    
    // Get network
    const chainId = await window.ethereum.request({ 
      method: 'eth_chainId' 
    });
    
    // Update state
    updateState('wallet', {
      connected: true,
      address: accounts[0],
      network: chainId
    });
    
    // Set up listeners
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    
  } catch (error) {
    console.error("Wallet connection error:", error);
    // Fallback to simulated data
    initSimulatedData();
  }
};

const handleAccountsChanged = (accounts) => {
  if (accounts.length === 0) {
    // Wallet disconnected
    updateState('wallet', {
      connected: false,
      address: null
    });
  } else {
    updateState('wallet', {
      address: accounts[0]
    });
  }
};

const handleChainChanged = (chainId) => {
  updateState('wallet', {
    network: chainId
  });
  checkNetwork();
};

// Fetch token price
async function fetchPrice() {
    if (window.ethereum) {
        try {
            const contractAddress = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"; 
            const abi = [{
                "constant": true,
                "inputs": [],
                "name": "latestAnswer",
                "outputs": [{"name": "", "type": "int256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }];
            
            const contract = new web3.eth.Contract(abi, contractAddress);
            const price = await contract.methods.latestAnswer().call();
            currentPrice = price / 1e8;
            
            priceDisplay.innerHTML = `
                <i class="fab fa-ethereum"></i> Price: $${currentPrice.toFixed(2)} USD
                <small>(Live from Chainlink)</small>
            `;
        } catch (error) {
            console.error("Using simulated data due to:", error);
            currentPrice = currentPrice * (1 + (Math.random() - 0.5) * 0.05);
            priceDisplay.innerHTML = `
                <i class="fab fa-ethereum"></i> Price: $${currentPrice.toFixed(2)} USD
                <small>(Simulated - MetaMask error)</small>
            `;
        }
    } else {
        currentPrice = currentPrice * (1 + (Math.random() - 0.5) * 0.05);
        priceDisplay.innerHTML = `
            <i class="fab fa-ethereum"></i> Price: $${currentPrice.toFixed(2)} USD
            <small>(Simulated - No MetaMask)</small>
        `;
    }
    
    // Update chart
    tokenChart.data.datasets[0].data.shift();
    tokenChart.data.datasets[0].data.push(currentPrice);
    tokenChart.update();
}

// Load token data
function loadTokenData() {
    totalSupplyEl.textContent = '10,000,000 BMT';
    circulatingSupplyEl.textContent = '8,500,000 BMT';
    burnedTokensEl.textContent = '1,500,000 BMT';
}

// Event Listeners
connectWalletBtn.addEventListener('click', connectWallet);

// Mock transactions array
const mockTransactions = [];

// Mint tokens function
async function mintTokens() {
    const amount = document.getElementById('mintAmount').value;
    if (!amount || isNaN(amount) || amount <= 0) {
        showToast('Please enter a valid amount', 'error');
        return;
    }

    try {
        toggleLoading('mintButton', true);
        const accounts = await web3.eth.getAccounts();
        const result = await bmtContract.methods.mint(web3.utils.toWei(amount, 'ether'))
            .send({ from: accounts[0] });
        
        showToast(`Successfully minted ${amount} BMT`, 'success');
        
        // Update UI
        const balance = await bmtContract.methods.balanceOf(accounts[0]).call();
        document.getElementById('bmtBalance').textContent = `${web3.utils.fromWei(balance, 'ether')} BMT`;
        
        mockTransactions.unshift({
            type: 'mint',
            amount: `${amount} BMT`,
            date: new Date().toLocaleString(),
            hash: result.transactionHash
        });
        renderTransactions();
    } catch (error) {
        console.error("Minting error:", error);
        showToast('Minting failed', 'error');
    } finally {
        toggleLoading('mintButton', false);
    }
}

// Burn tokens function
async function burnTokens() {
    const amount = document.getElementById('burnAmount').value;
    if (!amount || isNaN(amount) || amount <= 0) {
        showToast('Please enter a valid amount', 'error');
        return;
    }

    try {
        toggleLoading('burnButton', true);
        const accounts = await web3.eth.getAccounts();
        const result = await bmtContract.methods.burn(web3.utils.toWei(amount, 'ether'))
            .send({ from: accounts[0] });
        
        showToast(`Successfully burned ${amount} BMT`, 'success');
        
        // Update UI
        const balance = await bmtContract.methods.balanceOf(accounts[0]).call();
        document.getElementById('bmtBalance').textContent = `${web3.utils.fromWei(balance, 'ether')} BMT`;
        
        mockTransactions.unshift({
            type: 'burn',
            amount: `${amount} BMT`,
            date: new Date().toLocaleString(),
            hash: result.transactionHash
        });
        renderTransactions();
    } catch (error) {
        console.error("Burning error:", error);
        showToast('Burning failed', 'error');
    } finally {
        toggleLoading('burnButton', false);
    }
}

// Render transactions
function renderTransactions() {
    const container = document.getElementById('transactionsList');
    if (mockTransactions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exchange-alt"></i>
                <p>No transactions yet</p>
            </div>
        `;
        return;
    }

    container.innerHTML = mockTransactions.map(tx => `
        <div class="transaction">
            <div class="tx-type ${tx.type}">${tx.type.toUpperCase()}</div>
            <div class="tx-amount">${tx.amount}</div>
            <div class="tx-date">${tx.date}</div>
            <a href="#" class="tx-hash">${tx.hash.substring(0, 12)}...</a>
        </div>
    `).join('');
}

// Toggle loading state
function toggleLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    button.disabled = isLoading;
    button.innerHTML = isLoading ? 
        '<i class="fas fa-spinner fa-spin"></i> Processing...' : 
        button.textContent;
}

// Show toast notification
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// BMT Contract ABI (simplified)
const bmtAbi = [
    {
        "constant": false,
        "inputs": [{"name": "amount", "type": "uint256"}],
        "name": "mint",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{"name": "amount", "type": "uint256"}],
        "name": "burn",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{"name": "owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

// Contract address (replace with actual deployed contract address)
const bmtAddress = '0x123...'; 
let bmtContract;

// Initialize contract
function initContract() {
    if (window.ethereum && web3) {
        bmtContract = new web3.eth.Contract(bmtAbi, bmtAddress);
    }
}

// Auto-update price every 15 seconds
setInterval(fetchPrice, 15000);

// Check if wallet is already connected
window.addEventListener('load', async () => {
    initContract();
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
      updateState('wallet', {
        connected: true,
        address: accounts[0]
      });
      loadTokenData();
      fetchPrice();
    }
  }
  fetchPrice(); // Initial fetch
});
