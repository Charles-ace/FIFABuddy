const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying from:", deployer.address);

  const MockUSDT = await hre.ethers.getContractFactory("MockUSDT");
  const usdt = await MockUSDT.deploy();
  await usdt.waitForDeployment();
  console.log("MockUSDT:", await usdt.getAddress());

  const Prediction = await hre.ethers.getContractFactory("FIFABuddyPrediction");
  const prediction = await Prediction.deploy(
    await usdt.getAddress(),
    deployer.address
  );
  await prediction.waitForDeployment();
  console.log("FIFABuddyPrediction:", await prediction.getAddress());

  const Board = await hre.ethers.getContractFactory("CommunityBoard");
  const board = await Board.deploy();
  await board.waitForDeployment();
  console.log("CommunityBoard:", await board.getAddress());

  console.log("\n--- Paste into frontend/.env.local ---");
  console.log("NEXT_PUBLIC_USDT_ADDRESS=" + await usdt.getAddress());
  console.log("NEXT_PUBLIC_PREDICTION_ADDRESS=" + await prediction.getAddress());
  console.log("NEXT_PUBLIC_COMMUNITY_ADDRESS=" + await board.getAddress());
}

main().catch((e) => { console.error(e); process.exit(1); });
