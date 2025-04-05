const HDWalletProvider = require('@truffle/hdwallet-provider');
const mnemonic = process.env.MNEMONIC; // Use environment variable for security

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost
      port: 7545,        // Ganache port
      network_id: "*",   // Any network id
    },
    // Other networks...
  },
  compilers: {
    solc: {
      version: "0.8.19", // Specify the correct Solidity version
    },
  },
};
