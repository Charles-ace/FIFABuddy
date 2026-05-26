// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AnalystRegistry
 * @notice On-chain leaderboard of prediction analysts with verified win rates
 */
contract AnalystRegistry is Ownable {
    struct Analyst {
        string handle;
        uint256 wins;
        uint256 total;
        bool registered;
        uint256 joinedAt;
    }

    mapping(address => Analyst) public analysts;
    address[] public analystList;
    address public predictionContract;

    event AnalystRegistered(address indexed analyst, string handle);
    event ResultRecorded(address indexed analyst, bool won, uint256 wins, uint256 total);

    constructor() Ownable(msg.sender) {}

    function setPredictionContract(address _contract) external onlyOwner {
        require(_contract != address(0), "Zero contract");
        predictionContract = _contract;
    }

    function register(string calldata handle) external {
        require(!analysts[msg.sender].registered, "Already registered");
        require(bytes(handle).length > 0, "Empty handle");

        analysts[msg.sender] = Analyst({
            handle: handle,
            wins: 0,
            total: 0,
            registered: true,
            joinedAt: block.timestamp
        });
        analystList.push(msg.sender);

        emit AnalystRegistered(msg.sender, handle);
    }

    function recordResult(address analyst, bool won) external {
        require(msg.sender == predictionContract || msg.sender == owner(), "Unauthorized");
        require(analysts[analyst].registered, "Not registered");

        analysts[analyst].total++;
        if (won) {
            analysts[analyst].wins++;
        }

        emit ResultRecorded(analyst, won, analysts[analyst].wins, analysts[analyst].total);
    }

    function getWinRate(address analyst) external view returns (uint256 wins, uint256 total) {
        return (analysts[analyst].wins, analysts[analyst].total);
    }

    function getLeaderboard(uint256 limit) external view returns (address[] memory) {
        uint256 count = analystList.length < limit ? analystList.length : limit;
        address[] memory result = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = analystList[i];
        }
        return result;
    }
}
