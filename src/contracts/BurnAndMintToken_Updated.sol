// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title BurnAndMintToken
 * @dev ERC20 token with burn and mint functionality
 */
contract BurnAndMintToken is ERC20, Ownable, ReentrancyGuard {
    uint256 public currentBurnRate;
    mapping(address => uint256) public burnBalances;
    mapping(address => bool) public governanceMembers;
    address[] public users;
    bool public upkeepActive = true;

    // Chainlink Price Feed
    AggregatorV3Interface internal priceFeed;

    // Burn-lock mechanism
    struct BurnLock {
        uint256 amount;
        uint256 unlockTime;
    }
    mapping(address => BurnLock) public burnLocks;

    constructor() ERC20("BurnAndMintToken", "BMT") {
        currentBurnRate = 3;
        priceFeed = AggregatorV3Interface(0xYourPriceFeedAddress); // Replace with actual Chainlink Price Feed address
    }

    function burn(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        _burn(msg.sender, amount);
        burnBalances[msg.sender] += amount;

        // Implement burn-lock mechanism
        burnLocks[msg.sender] = BurnLock({
            amount: amount,
            unlockTime: block.timestamp + 1 days // Lock for 1 day
        });
    }

    function unlockBurn() external {
        require(burnLocks[msg.sender].unlockTime < block.timestamp, "Burn is still locked");
        delete burnLocks[msg.sender]; // Clear the lock after unlocking
    }

    function getLatestPrice() public view returns (int) {
        (
            , 
            int price, 
            , 
            , 
        ) = priceFeed.latestRoundData();
        return price;
    }
}
