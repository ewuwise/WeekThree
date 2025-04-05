// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BMTSafeKeeper is Ownable {
    // Contract to hold and safeguard funds
    constructor(address initialOwner) {
        transferOwnership(initialOwner);
    }
    
    function withdraw(address payable to, uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        to.transfer(amount);
    }
}
