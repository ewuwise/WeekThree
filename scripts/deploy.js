const { ethers } = require("hardhat");

async function main() {
    try {
        const [deployer] = await ethers.getSigners();
        console.log("Deploying contracts with the account:", deployer.address);

        // Deploy BMTTimelock first
        const minDelay = 86400; // 1 day in seconds
        const proposers = []; // Can be empty initially
        const executors = []; // Can be empty initially
        const Timelock = await ethers.getContractFactory("BMTTimelock");
        const timelock = await Timelock.deploy(minDelay, proposers, executors);
        await timelock.deployed();
        console.log("BMTTimelock deployed to:", timelock.address);

        // Deploy BMTSafeKeeper with timelock as owner
        const SafeKeeper = await ethers.getContractFactory("BMTSafeKeeper");
        const safeKeeper = await SafeKeeper.deploy(timelock.address);
        await safeKeeper.deployed();
        console.log("BMTSafeKeeper deployed to:", safeKeeper.address);

        // Deploy BMTMarketplaceV2 with timelock as owner
        const Marketplace = await ethers.getContractFactory("BMTMarketplaceV2");
        const marketplace = await Marketplace.deploy(timelock.address);
        await marketplace.deployed();
        console.log("BMTMarketplaceV2 deployed to:", marketplace.address);

        console.log("Deployment completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

main();
