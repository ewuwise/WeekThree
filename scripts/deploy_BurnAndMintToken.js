const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying BurnAndMintToken with account:", deployer.address);

    // Get contract factory
    const BurnAndMintToken = await ethers.getContractFactory("BurnAndMintToken");
    
    // Deploy contract
    const token = await BurnAndMintToken.deploy();
    await token.deployed();

    console.log("BurnAndMintToken deployed to:", token.address);
    
    // Save the contract address to a file for frontend use
    const fs = require('fs');
    const contractAddresses = {
        BurnAndMintToken: token.address
    };
    fs.writeFileSync('./src/BMTverse/contract-addresses.json', JSON.stringify(contractAddresses, null, 2));
    
    console.log("Contract address saved to contract-addresses.json");
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
