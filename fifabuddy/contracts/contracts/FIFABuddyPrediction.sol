// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FIFABuddyPrediction is Ownable, ReentrancyGuard {
    IERC20 public immutable usdt;
    address public feeRecipient;
    uint256 public constant FEE_BPS = 200;

    enum Status { Open, Resolved, Cancelled }

    struct Market {
        string homeTeam;
        string awayTeam;
        uint256 deadline;
        uint8 result;
        Status status;
        uint256[4] totals;
    }

    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(uint8 => mapping(address => uint256))) public bets;
    mapping(uint256 => mapping(address => bool)) public claimed;

    event MarketCreated(uint256 indexed matchId, string home, string away, uint256 deadline);
    event BetPlaced(uint256 indexed matchId, address indexed user, uint8 outcome, uint256 amount);
    event MatchResolved(uint256 indexed matchId, uint8 result);
    event WinningsClaimed(uint256 indexed matchId, address indexed user, uint256 amount);

    constructor(address _usdt, address _feeRecipient) Ownable(msg.sender) {
        usdt = IERC20(_usdt);
        feeRecipient = _feeRecipient;
    }

    function createMarket(
        uint256 matchId,
        string calldata homeTeam,
        string calldata awayTeam,
        uint256 deadline
    ) external onlyOwner {
        require(markets[matchId].deadline == 0, "Already exists");
        require(deadline > block.timestamp, "Deadline in past");
        markets[matchId] = Market({
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            deadline: deadline,
            result: 0,
            status: Status.Open,
            totals: [uint256(0), 0, 0, 0]
        });
        emit MarketCreated(matchId, homeTeam, awayTeam, deadline);
    }

    function placeBet(
        uint256 matchId,
        uint8 outcome,
        uint256 amount
    ) external nonReentrant {
        Market storage m = markets[matchId];
        require(m.status == Status.Open, "Market not open");
        require(block.timestamp < m.deadline, "Betting closed");
        require(outcome >= 1 && outcome <= 3, "Invalid outcome");
        require(amount > 0, "Zero amount");

        usdt.transferFrom(msg.sender, address(this), amount);
        bets[matchId][outcome][msg.sender] += amount;
        m.totals[outcome] += amount;

        emit BetPlaced(matchId, msg.sender, outcome, amount);
    }

    function resolveMatch(uint256 matchId, uint8 result) external onlyOwner {
        Market storage m = markets[matchId];
        require(m.status == Status.Open, "Not open");
        require(result >= 1 && result <= 3, "Invalid result");
        m.result = result;
        m.status = Status.Resolved;
        emit MatchResolved(matchId, result);
    }

    function claimWinnings(uint256 matchId) external nonReentrant {
        Market storage m = markets[matchId];
        require(m.status == Status.Resolved, "Not resolved");
        require(!claimed[matchId][msg.sender], "Already claimed");

        uint256 userBet = bets[matchId][m.result][msg.sender];
        require(userBet > 0, "No winning bet");

        uint256 totalWinning = m.totals[m.result];
        uint256 totalPool = m.totals[1] + m.totals[2] + m.totals[3];
        uint256 gross = (userBet * totalPool) / totalWinning;
        uint256 fee = (gross * FEE_BPS) / 10000;
        uint256 payout = gross - fee;

        claimed[matchId][msg.sender] = true;
        if (fee > 0) usdt.transfer(feeRecipient, fee);
        usdt.transfer(msg.sender, payout);

        emit WinningsClaimed(matchId, msg.sender, payout);
    }

    function getOdds(uint256 matchId) external view returns (
        uint256 home, uint256 draw, uint256 away
    ) {
        return (
            markets[matchId].totals[1],
            markets[matchId].totals[2],
            markets[matchId].totals[3]
        );
    }

    function getUserBet(uint256 matchId, address user) external view returns (
        uint256 home, uint256 draw, uint256 away
    ) {
        return (
            bets[matchId][1][user],
            bets[matchId][2][user],
            bets[matchId][3][user]
        );
    }
}
