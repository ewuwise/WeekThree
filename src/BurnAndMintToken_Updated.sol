// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable2Step.sol";

contract BurnAndMintToken is Ownable2Step {
    bool public paused; // State variable to track if the contract is paused

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    function pause() public onlyOwner {
        paused = true;
        emit Paused(msg.sender);
    }

    function unpause() public onlyOwner {
        paused = false;
        emit Unpaused(msg.sender);
    }

    string public name = "BurnAndMintToken";
    string public symbol = "BMT";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Burn(address indexed from, uint256 value);
    event Mint(address indexed to, uint256 value);
    event Paused(address account);
    event Unpaused(address account);
    event BurnRateAdjusted(uint256 newRate);

    uint256 public burnRate; // This will be set by AI based on market conditions

    constructor(uint256 initialSupply) {
        totalSupply = initialSupply * 10 ** uint256(decimals);
        balanceOf[msg.sender] = totalSupply;
        burnRate = 3; // Initial burn rate
    }

    function transfer(address to, uint256 value) public whenNotPaused returns (bool success) {
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function burn(uint256 value) public whenNotPaused returns (bool success) {
        require(balanceOf[msg.sender] >= value, "Insufficient balance to burn");
        balanceOf[msg.sender] -= value;
        totalSupply -= value;
        emit Burn(msg.sender, value);
        return true;
    }

    function mint(uint256 value) public onlyOwner whenNotPaused returns (bool success) {
        totalSupply += value;
        balanceOf[msg.sender] += value;
        emit Mint(msg.sender, value);
        return true;
    }

    function adjustBurnRate(uint256 newRate) public onlyOwner {
        require(newRate > 0 && newRate <= 100, "Burn rate must be positive and <= 100");
        burnRate = newRate;
        emit BurnRateAdjusted(newRate);
    }

    function crossChainBurn(address from, uint256 value) public returns (bool success) {
        require(balanceOf[from] >= value, "Insufficient balance to burn");
        balanceOf[from] -= value;
        totalSupply -= value;
        emit Burn(from, value);
        return true;
    }
}
