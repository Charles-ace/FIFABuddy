const hre = require("hardhat");

async function deployMockUsdt(deployer) {
  const MockUSDT = await hre.ethers.getContractFactory("MockUSDT");
  const initialSupply = hre.ethers.parseUnits("1000000", 6);
  const mock = await MockUSDT.deploy(initialSupply);
  await mock.waitForDeployment();

  console.log("MockUSDT:", await mock.getAddress());
  console.log("MockUSDT deployer balance:", (await mock.balanceOf(deployer.address)).toString());

  return mock;
}

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  let usdtAddress = process.env.USDT_ADDRESS;
  let mockUsdt = null;

  if (!usdtAddress) {
    console.log("USDT_ADDRESS not set, deploying MockUSDT for this network...");
    mockUsdt = await deployMockUsdt(deployer);
    usdtAddress = await mockUsdt.getAddress();
  } else {
    console.log("Using USDT address from env:", usdtAddress);
  }

  const Registry = await hre.ethers.getContractFactory("AnalystRegistry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();
  console.log("AnalystRegistry:", await registry.getAddress());

  const Prediction = await hre.ethers.getContractFactory("FIFABuddyPrediction");
  const prediction = await Prediction.deploy(usdtAddress, deployer.address);
  await prediction.waitForDeployment();
  console.log("FIFABuddyPrediction:", await prediction.getAddress());

  const Board = await hre.ethers.getContractFactory("CommunityBoard");
  const board = await Board.deploy();
  await board.waitForDeployment();
  console.log("CommunityBoard:", await board.getAddress());

  await registry.setPredictionContract(await prediction.getAddress());
  console.log("Registry linked to Prediction contract");

  console.log("\n=== COPY THESE INTO frontend/.env.local ===");
  console.log(`NEXT_PUBLIC_PREDICTION_ADDRESS=${await prediction.getAddress()}`);
  console.log(`NEXT_PUBLIC_COMMUNITY_ADDRESS=${await board.getAddress()}`);
  console.log(`NEXT_PUBLIC_REGISTRY_ADDRESS=${await registry.getAddress()}`);
  console.log(`NEXT_PUBLIC_USDT_ADDRESS=${usdtAddress}`);

  if (mockUsdt) {
    console.log("MockUSDT was deployed because USDT_ADDRESS was not provided.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
