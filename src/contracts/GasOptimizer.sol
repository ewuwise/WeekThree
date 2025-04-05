pragma solidity ^0.8.19;

contract GasOptimizer {
    // Original function
    function originalFunction(uint256[] memory values) public pure returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 0; i < values.length; i++) {
            sum += values[i];
        }
        return sum;
    }

    // Optimized function
    function optimizedFunction(uint256[] memory values) public pure returns (uint256) {
        uint256 sum = 0;
        uint256 length = values.length; // Cache length
        for (uint256 i = 0; i < length; i++) {
            sum += values[i];
        }
        return sum;
    }
}
