require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.24",
  networks: {
    development: {
      url: "http://127.0.0.1:8545", // Local Ethereum node
      accounts: ["YOUR_VALID_PRIVATE_KEY_HERE"], // Replace with a valid private key
    },
    goerli: {
      url: "https://goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID", // Replace with a valid Infura project ID
      accounts: ["YOUR_VALID_PRIVATE_KEY_HERE"], // Replace with a valid private key
    },
    // Add other networks as needed
  },
};
