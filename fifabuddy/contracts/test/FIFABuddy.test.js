const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FIFABuddyPrediction", function () {
  let prediction, usdt, owner, user1, user2;
  const MATCH_ID = 1;
  const DEADLINE_DELTA = 86400; // 1 day in seconds
  let deadline;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    usdt = await MockUSDT.deploy();
    await usdt.waitForDeployment();

    const Prediction = await ethers.getContractFactory("FIFABuddyPrediction");
    prediction = await Prediction.deploy(await usdt.getAddress(), owner.address);
    await prediction.waitForDeployment();

    deadline = Math.floor(Date.now() / 1000) + DEADLINE_DELTA;

    // Mint USDT to users for betting
    await usdt.mint(user1.address, ethers.parseUnits("1000", 6));
    await usdt.mint(user2.address, ethers.parseUnits("1000", 6));
    await usdt.connect(user1).approve(await prediction.getAddress(), ethers.parseUnits("1000", 6));
    await usdt.connect(user2).approve(await prediction.getAddress(), ethers.parseUnits("1000", 6));
  });

  describe("createMarket", function () {
    it("should create a market correctly", async function () {
      await prediction.createMarket(MATCH_ID, "Brazil", "Argentina", deadline);
      const market = await prediction.markets(MATCH_ID);
      expect(market.homeTeam).to.equal("Brazil");
      expect(market.awayTeam).to.equal("Argentina");
      expect(market.status).to.equal(0); // Open
    });

    it("should revert on duplicate market", async function () {
      await prediction.createMarket(MATCH_ID, "Brazil", "Argentina", deadline);
      await expect(
        prediction.createMarket(MATCH_ID, "Brazil", "Argentina", deadline)
      ).to.be.revertedWith("Already exists");
    });

    it("should revert if deadline is in the past", async function () {
      const pastDeadline = Math.floor(Date.now() / 1000) - 100;
      await expect(
        prediction.createMarket(MATCH_ID, "Brazil", "Argentina", pastDeadline)
      ).to.be.revertedWith("Deadline in past");
    });

    it("should revert if not owner", async function () {
      await expect(
        prediction.connect(user1).createMarket(MATCH_ID, "Brazil", "Argentina", deadline)
      ).to.be.reverted;
    });
  });

  describe("placeBet", function () {
    beforeEach(async function () {
      await prediction.createMarket(MATCH_ID, "Brazil", "Argentina", deadline);
    });

    it("should place a bet correctly", async function () {
      const amount = ethers.parseUnits("100", 6);
      await prediction.connect(user1).placeBet(MATCH_ID, 1, amount);
      const totals = await prediction.getOdds(MATCH_ID);
      expect(totals.home).to.equal(amount);
    });

    it("should update totals for different outcomes", async function () {
      await prediction.connect(user1).placeBet(MATCH_ID, 1, ethers.parseUnits("100", 6));
      await prediction.connect(user2).placeBet(MATCH_ID, 2, ethers.parseUnits("50", 6));
      const totals = await prediction.getOdds(MATCH_ID);
      expect(totals.home).to.equal(ethers.parseUnits("100", 6));
      expect(totals.draw).to.equal(ethers.parseUnits("50", 6));
    });

    it("should revert after deadline", async function () {
      await ethers.provider.send("evm_increaseTime", [DEADLINE_DELTA + 1]);
      await ethers.provider.send("evm_mine", []);
      await expect(
        prediction.connect(user1).placeBet(MATCH_ID, 1, ethers.parseUnits("100", 6))
      ).to.be.revertedWith("Betting closed");
    });

    it("should revert on invalid outcome", async function () {
      await expect(
        prediction.connect(user1).placeBet(MATCH_ID, 0, ethers.parseUnits("100", 6))
      ).to.be.revertedWith("Invalid outcome");
    });

    it("should revert on zero amount", async function () {
      await expect(
        prediction.connect(user1).placeBet(MATCH_ID, 1, 0)
      ).to.be.revertedWith("Zero amount");
    });
  });

  describe("resolveMatch", function () {
    beforeEach(async function () {
      await prediction.createMarket(MATCH_ID, "Brazil", "Argentina", deadline);
      await prediction.connect(user1).placeBet(MATCH_ID, 1, ethers.parseUnits("100", 6));
    });

    it("should resolve correctly", async function () {
      await prediction.resolveMatch(MATCH_ID, 1);
      const market = await prediction.markets(MATCH_ID);
      expect(market.result).to.equal(1);
      expect(market.status).to.equal(1); // Resolved
    });

    it("should revert on non-owner", async function () {
      await expect(
        prediction.connect(user1).resolveMatch(MATCH_ID, 1)
      ).to.be.reverted;
    });

    it("should revert on invalid result", async function () {
      await expect(
        prediction.resolveMatch(MATCH_ID, 0)
      ).to.be.revertedWith("Invalid result");
    });
  });

  describe("claimWinnings", function () {
    beforeEach(async function () {
      await prediction.createMarket(MATCH_ID, "Brazil", "Argentina", deadline);
      await prediction.connect(user1).placeBet(MATCH_ID, 1, ethers.parseUnits("100", 6));
      await prediction.connect(user2).placeBet(MATCH_ID, 2, ethers.parseUnits("50", 6));
      await prediction.resolveMatch(MATCH_ID, 1);
    });

    it("should pay correct amount minus 2% fee", async function () {
      const balanceBefore = await usdt.balanceOf(user1.address);
      await prediction.connect(user1).claimWinnings(MATCH_ID);
      const balanceAfter = await usdt.balanceOf(user1.address);

      // User bet 100 on home, total pool = 150, winning pool = 100
      // gross = (100 * 150) / 100 = 150
      // fee = 150 * 200 / 10000 = 3
      // payout = 150 - 3 = 147
      const expectedPayout = ethers.parseUnits("147", 6);
      expect(balanceAfter - balanceBefore).to.equal(expectedPayout);
    });

    it("should revert on double claim", async function () {
      await prediction.connect(user1).claimWinnings(MATCH_ID);
      await expect(
        prediction.connect(user1).claimWinnings(MATCH_ID)
      ).to.be.revertedWith("Already claimed");
    });

    it("should revert if no winning bet", async function () {
      await expect(
        prediction.connect(user2).claimWinnings(MATCH_ID)
      ).to.be.revertedWith("No winning bet");
    });
  });

  describe("getOdds", function () {
    it("should return correct pool totals after bets", async function () {
      await prediction.createMarket(MATCH_ID, "Brazil", "Argentina", deadline);
      await prediction.connect(user1).placeBet(MATCH_ID, 1, ethers.parseUnits("100", 6));
      await prediction.connect(user2).placeBet(MATCH_ID, 3, ethers.parseUnits("75", 6));

      const odds = await prediction.getOdds(MATCH_ID);
      expect(odds.home).to.equal(ethers.parseUnits("100", 6));
      expect(odds.draw).to.equal(0);
      expect(odds.away).to.equal(ethers.parseUnits("75", 6));
    });
  });
});
