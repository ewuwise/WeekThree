require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

console.log("Private Key:", process.env.PRIVATE_KEY); // Log the private key
console.log("User Wallet Address:", "0x48Ee92E54C291b68275A1123f9F751BDBF2B8011"); // Log the user's wallet address


console.log("Private Key Length:", process.env.PRIVATE_KEY.length); // Log the length of the private key

module.exports = {

    solidity: "0.8.17",
    paths: {
        sources: "./src/contracts",
        tests: "./src/test",
        artifacts: "./artifacts"
    },
    networks: {
        development: {
            url: "http://127.0.0.1:8545",
            accounts: [process.env.PRIVATE_KEY],
        },
        localhost: {
            url: "http://127.0.0.1:8545",
        }
    },
};
