// Import wallet connection module
import { initWalletConnect } from '../modules/wallet-connect';

// DOM Elements
const connectWalletBtn = document.getElementById('connectWallet');
const walletText = document.getElementById('walletText');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

// Initialize wallet connection
initWalletConnect(connectWalletBtn, walletText);

// Mobile Menu Toggle
function toggleMobileMenu() {
    mobileMenu.classList.toggle('hidden');
}

// Show Alert Function
function showAlert(message, type = 'info') {
    const alertBox = document.getElementById('transactionStatus');
    alertBox.textContent = message;
    alertBox.className = `p-3 rounded-lg text-sm ${
        type === 'success' ? 'bg-green-900/50 text-green-300' :
        type === 'error' ? 'bg-red-900/50 text-red-300' :
        'bg-blue-900/50 text-blue-300'
    }`;
    alertBox.classList.remove('hidden');
    
    setTimeout(() => {
        alertBox.classList.add('hidden');
    }, 5000);
}

// Initialize Charts
function initCharts() {
    // Market Chart
    const marketChart = new ApexCharts(document.querySelector("#marketChart"), {
        series: [{
            name: "Active Users",
            data: [1200, 1900, 3000, 5500, 8900, 14400, 25800]
        }],
        chart: {
            type: 'area',
            height: '100%',
            toolbar: { show: true }
        },
        colors: ['#8B5CF6'],
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth' },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.3
            }
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
        }
    });
    marketChart.render();
}

// Event Listeners
function setupEventListeners() {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    initCharts();
});
