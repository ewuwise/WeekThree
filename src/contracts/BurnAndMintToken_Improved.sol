// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

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

    constructor() ERC20("BurnAndMintToken", "BMT") {
        currentBurnRate = 3;
    }
}
