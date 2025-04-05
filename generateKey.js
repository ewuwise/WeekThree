const Web3 = require('web3');
const web3 = new Web3();

// Generate new wallet (returns private key and address)
const newWallet = web3.eth.accounts.create();

console.log('New Wallet Address:', newWallet.address);
console.log('New Private Key:', newWallet.privateKey);
