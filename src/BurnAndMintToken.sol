// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BurnAndMintToken is Ownable {

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

    constructor(uint256 _initialSupply) {
        totalSupply = _initialSupply * 10 ** uint256(decimals);
        balanceOf[msg.sender] = totalSupply;
        burnRate = 3; // Initial burn rate
    }

    function transfer(address _to, uint256 _value) public whenNotPaused returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function burn(uint256 _value) public whenNotPaused returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance to burn");
        balanceOf[msg.sender] -= _value;
        totalSupply -= _value;
        emit Burn(msg.sender, _value);
        return true;
    }

    function mint(uint256 _value) public onlyOwner whenNotPaused returns (bool success) {
        totalSupply += _value;
        balanceOf[msg.sender] += _value;
        emit Mint(msg.sender, _value);
        return true;
    }

    function adjustBurnRate(uint256 newRate) public onlyOwner {
        require(newRate > 0, "Burn rate must be positive");
        burnRate = newRate;
        emit BurnRateAdjusted(newRate);
    }

    function crossChainBurn(address _from, uint256 _value) public returns (bool success) {
        require(balanceOf[_from] >= _value, "Insufficient balance to burn");
        balanceOf[_from] -= _value;
        totalSupply -= _value;
        emit Burn(_from, _value);
        return true;
    }
}
