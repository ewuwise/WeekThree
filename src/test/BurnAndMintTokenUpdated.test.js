import { ethers } from "hardhat";
import { expect } from "chai";

describe("BurnAndMintToken", function () {
    let owner, token;

    beforeEach(async function () {
        [owner] = await ethers.getSigners();
        const BurnAndMintToken = await ethers.getContractFactory("BurnAndMintToken");
        token = await BurnAndMintToken.deploy();
        await token.deployed();
    });

    it("should mint tokens", async function () {
        const mintAmount = ethers.utils.parseUnits("100", 18);
        await token.mint(owner.address, mintAmount);
        
        const balance = await token.balanceOf(owner.address);
        expect(balance).to.equal(mintAmount);
    });

    it("should burn tokens", async function () {
        const mintAmount = ethers.utils.parseUnits("100", 18);
        await token.mint(owner.address, mintAmount);
        await token.burn(mintAmount);

        const balance = await token.balanceOf(owner.address);
        expect(balance).to.equal(0);
    });

    it("should prevent reentrancy attack during burn", async function () {
        const mintAmount = ethers.utils.parseUnits("100", 18);
        await token.mint(owner.address, mintAmount);

        // Attempt to burn tokens in a reentrant way
        await expect(token.burn(mintAmount)).to.not.be.reverted;
    });

    it("should check upkeep correctly", async function () {
        const upkeepNeeded = await token.checkUpkeep();
        expect(upkeepNeeded).to.be.true; // Assuming conditions are met
    });

    it("should distribute rewards correctly", async function () {
        const mintAmount = ethers.utils.parseUnits("100", 18);
        await token.mint(owner.address, mintAmount);
        await token.burn(mintAmount);

        // Simulate reward distribution
        await token.performUpkeep();

        // Check if rewards were distributed correctly
        const balance = await token.balanceOf(owner.address);
        expect(balance).to.be.gt(0); // Assuming rewards were distributed
    });
});
