// WalletActivator.sol - Multi-chain enabled
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract WalletActivator is Ownable {
    struct Activation {
        uint256 timestamp;
        uint256 initialBalance;
        bool isActive;
    }
    
    mapping(address => Activation) public activations;
    mapping(uint256 => bool) public supportedChains;
    IERC20 public bmtToken;
    
    uint256 public activationFee = 0.01 ether;
    uint256 public minTokenHold = 100 * 10**18; // 100 BMT
    
    event WalletActivated(address indexed wallet, uint256 chainId);
    event CrossChainActivated(address indexed wallet, uint256[] chainIds);

    constructor(address _token) {
        bmtToken = IERC20(_token);
        supportedChains[1] = true; // Ethereum
        supportedChains[137] = true; // Polygon
        supportedChains[56] = true; // BSC
    }
    
    function activateWallet(uint256 chainId) external payable {
        require(supportedChains[chainId], "Chain not supported");
        require(msg.value >= activationFee, "Insufficient fee");
        require(bmtToken.balanceOf(msg.sender) >= minTokenHold, "Insufficient BMT");
        
        activations[msg.sender] = Activation({
            timestamp: block.timestamp,
            initialBalance: bmtToken.balanceOf(msg.sender),
            isActive: true
        });
        
        emit WalletActivated(msg.sender, chainId);
    }
    
    function activateForChains(uint256[] calldata chainIds) external payable {
        require(msg.value >= activationFee * chainIds.length, "Insufficient fee");
        
        for (uint i = 0; i < chainIds.length; i++) {
            require(supportedChains[chainIds[i]], "Unsupported chain");
        }
        
        emit CrossChainActivated(msg.sender, chainIds);
    }
    
    function withdrawFees() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
