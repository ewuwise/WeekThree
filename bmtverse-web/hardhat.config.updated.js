require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.24",
  networks: {
    development: {
      url: "http://127.0.0.1:8545", // Local Ethereum node
      accounts: ["04C291b68275A1123f9F751BDBF2B8011"], // Valid private key
    },
    goerli: {
      url: "https://goerli.infura.io/v3/J6xcw6bvVEkJTfRcYXncgbgorW4KMd6H", // Valid Infura project ID
      accounts: ["04C291b68275A1123f9F751BDBF2B8011"], // Valid private key
    },
    // Add other networks as needed
  },
};
