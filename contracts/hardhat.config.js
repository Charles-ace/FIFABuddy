require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY;
const accounts = privateKey && /^0x[a-fA-F0-9]{64}$/.test(privateKey) ? [privateKey] : [];

module.exports = {
  solidity: "0.8.20",
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    xlayerTestnet: {
      url: "https://testrpc.xlayer.tech",
      chainId: 195,
      accounts
    },
    xlayer: {
      url: "https://rpc.xlayer.tech",
      chainId: 196,
      accounts
    }
  },
  etherscan: {
    apiKey: {
      xlayerTestnet: process.env.OKLINK_API_KEY,
      xlayer: process.env.OKLINK_API_KEY
    },
    customChains: [
      {
        network: "xlayerTestnet",
        chainId: 195,
        urls: {
          apiURL:
            "https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/XLAYER_TEST",
          browserURL: "https://www.oklink.com/xlayer-test"
        }
      },
      {
        network: "xlayer",
        chainId: 196,
        urls: {
          apiURL:
            "https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/XLAYER",
          browserURL: "https://www.oklink.com/xlayer"
        }
      }
    ]
  }
};
