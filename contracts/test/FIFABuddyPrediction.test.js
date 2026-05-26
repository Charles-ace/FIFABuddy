const { expect } = require("chai");
const { loadFixture, time } = require("@nomicfoundation/hardhat-network-helpers");

describe("FIFABuddyPrediction", function () {
  async function deployFixture() {
    const [owner, alice, bob, feeRecipient] = await ethers.getSigners();

    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    const usdt = await MockUSDT.deploy(ethers.parseUnits("1000000", 6));
    await usdt.waitForDeployment();

    const FIFABuddyPrediction = await ethers.getContractFactory("FIFABuddyPrediction");
    const prediction = await FIFABuddyPrediction.deploy(await usdt.getAddress(), feeRecipient.address);
    await prediction.waitForDeployment();

    const deadline = (await time.latest()) + 3600;
    await prediction.connect(owner).createMarket(1, "Spain", "Argentina", deadline);

    const mintAmount = ethers.parseUnits("1000", 6);
    await usdt.mint(alice.address, mintAmount);
    await usdt.mint(bob.address, mintAmount);

    await usdt.connect(alice).approve(await prediction.getAddress(), mintAmount);
    await usdt.connect(bob).approve(await prediction.getAddress(), mintAmount);

    return { owner, alice, bob, feeRecipient, usdt, prediction, deadline };
  }

  it("creates markets and places bets", async function () {
    const { prediction, alice } = await loadFixture(deployFixture);
    const amount = ethers.parseUnits("100", 6);

    await expect(prediction.connect(alice).placeBet(1, 1, amount))
      .to.emit(prediction, "BetPlaced")
      .withArgs(1, alice.address, 1, amount);

    const odds = await prediction.getOdds(1);
    expect(odds[0]).to.equal(amount);
    expect(odds[1]).to.equal(0);
    expect(odds[2]).to.equal(0);

    const userBet = await prediction.getUserBet(1, alice.address);
    expect(userBet[0]).to.equal(amount);
    expect(userBet[1]).to.equal(0);
    expect(userBet[2]).to.equal(0);
  });

  it("resolves matches only after the deadline", async function () {
    const { owner, prediction, deadline } = await loadFixture(deployFixture);

    await expect(prediction.connect(owner).resolveMatch(1, 1)).to.be.revertedWith("Match not ended");

    await time.increaseTo(deadline + 1);

    await expect(prediction.connect(owner).resolveMatch(1, 4)).to.be.revertedWith("Invalid result");

    await expect(prediction.connect(owner).resolveMatch(1, 1))
      .to.emit(prediction, "MatchResolved")
      .withArgs(1, 1);

    const market = await prediction.markets(1);
    expect(market.result).to.equal(1);
    expect(market.status).to.equal(1);
  });

  it("pays winnings and fee recipient correctly", async function () {
    const { owner, alice, bob, feeRecipient, usdt, prediction, deadline } = await loadFixture(deployFixture);

    const aliceBet = ethers.parseUnits("600", 6);
    const bobBet = ethers.parseUnits("400", 6);

    await prediction.connect(alice).placeBet(1, 1, aliceBet);
    await prediction.connect(bob).placeBet(1, 3, bobBet);

    await time.increaseTo(deadline + 1);
    await prediction.connect(owner).resolveMatch(1, 1);

    const aliceBalanceBefore = await usdt.balanceOf(alice.address);
    const feeBalanceBefore = await usdt.balanceOf(feeRecipient.address);
    const contractBalanceBefore = await usdt.balanceOf(await prediction.getAddress());

    expect(contractBalanceBefore).to.equal(aliceBet + bobBet);

    await expect(prediction.connect(alice).claimWinnings(1))
      .to.emit(prediction, "WinningsClaimed")
      .withArgs(1, alice.address, ethers.parseUnits("980", 6));

    const aliceBalanceAfter = await usdt.balanceOf(alice.address);
    const feeBalanceAfter = await usdt.balanceOf(feeRecipient.address);
    const contractBalanceAfter = await usdt.balanceOf(await prediction.getAddress());

    expect(aliceBalanceAfter - aliceBalanceBefore).to.equal(ethers.parseUnits("980", 6));
    expect(feeBalanceAfter - feeBalanceBefore).to.equal(ethers.parseUnits("20", 6));
    expect(contractBalanceAfter).to.equal(0);

    await expect(prediction.connect(alice).claimWinnings(1)).to.be.revertedWith("Already claimed");
    await expect(prediction.connect(bob).claimWinnings(1)).to.be.revertedWith("No winning bet");
  });
});
