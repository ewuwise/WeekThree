import { ethers } from "hardhat";
import { expect } from "chai";

describe("BurnAndMintToken", function () {
    it("should mint tokens", async function () {
        const [owner] = await ethers.getSigners();
        const BurnAndMintToken = await ethers.getContractFactory("BurnAndMintToken");
        const token = await BurnAndMintToken.deploy();
        await token.deployed();

        const mintAmount = ethers.utils.parseUnits("100", 18);
        await token.mint(owner.address, mintAmount);
        
        const balance = await token.balanceOf(owner.address);
        expect(balance).to.equal(mintAmount);

    });

    it("should burn tokens", async function () {
        const [owner] = await ethers.getSigners();
        const BurnAndMintToken = await ethers.getContractFactory("BurnAndMintToken");
        const token = await BurnAndMintToken.deploy();
        await token.deployed();

        const mintAmount = ethers.utils.parseUnits("100", 18);
        await token.mint(owner.address, mintAmount);
        await token.burn(mintAmount);

        const balance = await token.balanceOf(owner.address);
        expect(balance).to.equal(0);

    });
});
