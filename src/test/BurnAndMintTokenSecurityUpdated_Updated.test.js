const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BurnAndMintToken Security Features", function () {
    let token;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        const Token = await ethers.getContractFactory("BurnAndMintToken");
        token = await Token.deploy();
        [owner, addr1, addr2] = await ethers.getSigners();
    });
    
    it("Should calculate voting power correctly with community engagement", async function () {
        const tokensBurned = 1000;
        const reputationScore = 80;
        const communityEngagement = 50; // New factor

        const votingPower = await token.calculateVotingPower(tokensBurned, reputationScore, communityEngagement);
        expect(votingPower).to.be.a('number'); // Check if voting power is a number
        // Add more specific assertions based on expected behavior
    });

    it("Should trigger alert when volatility index exceeds threshold", async function () {
        const volatilityIndex = 75; // Above threshold
        await expect(token.stabilityCheck(volatilityIndex)).to.be.revertedWith("Market paused due to high volatility");
    });

    it("Should allow operations when volatility index is below threshold", async function () {
        const volatilityIndex = 25; // Below threshold
        await expect(token.stabilityCheck(volatilityIndex)).to.not.be.reverted;
    });

    it("Should pause and unpause the contract", async function () {
        await token.pause();
        await expect(token.burn(100)).to.be.revertedWith("Contract is paused");
        await token.unpause();
        await expect(token.burn(100)).to.not.be.reverted;
    });

    it("Should burn tokens and emit TokensBurned event", async function () {
        await token.mint(addr1.address, 1000);
        await token.connect(addr1).burn(100);
        expect(await token.burnBalances(addr1.address)).to.equal(100);
        await expect(token.connect(addr1).burn(100))
            .to.emit(token, "TokensBurned")
            .withArgs(addr1.address, 100);
    });

    it("Should mint tokens and emit TokensMinted event", async function () {
        await token.mint(addr1.address, 1000);
        await expect(token.mint(addr1.address, 100))
            .to.emit(token, "TokensMinted")
            .withArgs(addr1.address, 100);
    });

    it("Should not allow burning when paused", async function () {
        await token.pause();
        await expect(token.connect(addr1).burn(100)).to.be.revertedWith("Contract is paused");
    });

    // New tests for Chainlink Price Feed
    it("Should return the latest price from Chainlink Price Feed", async function () {
        const price = await token.getLatestPrice();
        expect(price).to.be.a('number'); // Check if price is a number
    });

    // New tests for Burn-Lock Mechanism
    it("Should lock burned tokens for a specified period", async function () {
        await token.mint(addr1.address, 1000);
        await token.connect(addr1).burn(100);
        const burnLock = await token.burnLocks(addr1.address);
        expect(burnLock.amount).to.equal(100);
        expect(burnLock.unlockTime).to.be.greaterThan(Math.floor(Date.now() / 1000)); // Check if unlock time is in the future
    });

    it("Should allow unlocking of burned tokens after the lock period", async function () {
        await token.mint(addr1.address, 1000);
        await token.connect(addr1).burn(100);
        const burnLock = await token.burnLocks(addr1.address);
        await ethers.provider.send("evm_increaseTime", [86400]); // Fast forward 1 day
        await ethers.provider.send("evm_mine"); // Mine the next block
        await token.connect(addr1).unlockBurn();
        const updatedBurnLock = await token.burnLocks(addr1.address);
        expect(updatedBurnLock.amount).to.equal(0); // Check if the lock has been cleared
    });
});
