// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title BurnAndMintToken
 * @dev ERC20 token with burn and mint functionality, governance features, and reward distribution
 */
contract BurnAndMintToken is ERC20, Ownable, ReentrancyGuard {
    uint256 public currentBurnRate;
    mapping(address => uint256) public burnBalances;
    mapping(address => bool) public governanceMembers;
    address[] public users;
    bool public upkeepActive = true;

    constructor() ERC20("BurnAndMintToken", "BMT") {
        currentBurnRate = 3;
    }

    /**
     * @dev Checks if upkeep is needed
     * @return upkeepNeeded Boolean indicating if upkeep is needed
     */
    event UpkeepChecked(bool upkeepNeeded);
    event TokensBurned(address indexed user, uint256 amount);
    event TokensMinted(address indexed user, uint256 amount);

    bool public paused; // New state variable for emergency stop

    function checkUpkeep() public view returns (bool upkeepNeeded) {
        require(!paused, "Contract is paused"); // Check if contract is paused
=======
        upkeepNeeded = upkeepActive && (block.timestamp % 1 days == 0) && users.length > 0;
=======
        upkeepNeeded = upkeepActive && (block.timestamp % 1 days == 0) && users.length > 0 && !paused;
        emit UpkeepChecked(upkeepNeeded);
        return upkeepNeeded;
    }

    event ContractPaused();
    event ContractUnpaused();

    function pause() external onlyOwner {
        paused = true;
        emit ContractPaused();
    }

    function unpause() external onlyOwner {
        paused = false;
        emit ContractUnpaused();
    }

    function burn(uint256 amount) public nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(!paused, "Contract is paused"); // Check if contract is paused
        _burn(msg.sender, amount);
        burnBalances[msg.sender] += amount;
        emit TokensBurned(msg.sender, amount); // Log burn action
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(amount > 0, "Amount must be greater than 0 for minting");
        require(!paused, "Contract is paused"); // Check if contract is paused
        _mint(to, amount);
        emit TokensMinted(to, amount); // Log mint action
    }

    function setBurnRate(uint256 newRate) public onlyOwner {
        require(newRate <= 10, "Burn rate too high"); // Example limit
        currentBurnRate = newRate;
    }
        upkeepNeeded = upkeepActive && (block.timestamp % 1 days == 0) && users.length > 0;
        emit UpkeepChecked(upkeepNeeded);
        return upkeepNeeded;
    }

    /**
     * @dev Performs upkeep if conditions are met
     */
    function performUpkeep() public nonReentrant {
        require(checkUpkeep(), "Upkeep not needed");
        distributeRewards();
    }

    /**
     * @dev Distributes rewards to users based on their burn balances
     */
    function distributeRewards() internal {
        for (uint256 i = 0; i < users.length; i++) {
            if (burnBalances[users[i]] > 0) {
                uint256 reward = burnBalances[users[i]] * currentBurnRate;
                _mint(users[i], reward);
            }
        }
    }

    /**
     * @dev Burns tokens from caller's balance
     * @param amount Amount of tokens to burn
     */
    function burn(uint256 amount) public nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        _burn(msg.sender, amount);
        burnBalances[msg.sender] += amount;
    }

    /**
     * @dev Mints new tokens (owner only)
     * @param to Address to receive minted tokens
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(amount > 0, "Amount must be greater than 0 for minting");
        _mint(to, amount);
    }

    /**
     * @dev Adds a governance member (owner only)
     * @param member Address to add as governance member
     */
    function addGovernanceMember(address member) public onlyOwner {
        governanceMembers[member] = true;
    }

    /**
     * @dev Removes a governance member (owner only)
     * @param member Address to remove from governance
     */
    function removeGovernanceMember(address member) public onlyOwner {
        governanceMembers[member] = false;
    }

    /**
     * @dev Returns current burn rate
     * @return Current burn rate
     */
    function getCurrentBurnRate() public view returns (uint256) {
        return currentBurnRate;
    }

    /**
     * @dev Sets new burn rate (owner only)
     * @param newRate New burn rate to set
     */
    function setBurnRate(uint256 newRate) public onlyOwner {
        require(newRate <= 10, "Burn rate too high"); // Example limit
        currentBurnRate = newRate;
    }

    /**
     * @dev Mints tokens based on real-world assets (owner only)
     * @param to Address to receive minted tokens
     * @param amount Amount of tokens to mint
     */
    function mintBasedOnRWA(address to, uint256 amount) public onlyOwner {
        burn(amount);
    }
}
