// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockUSDT
 * @notice 6-decimal mintable ERC20 used for local testing and X Layer testnet deployment
 */
contract MockUSDT is ERC20, Ownable {
    uint8 private constant _DECIMALS = 6;

    constructor(uint256 initialSupply) ERC20("Mock USDT", "mUSDT") Ownable(msg.sender) {
        if (initialSupply > 0) {
            _mint(msg.sender, initialSupply);
        }
    }

    function decimals() public pure override returns (uint8) {
        return _DECIMALS;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
