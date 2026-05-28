import { injected } from "@wagmi/core";
import { createConfig, http } from "wagmi";
import type { Chain } from "viem";

export const xlayerTestnet = {
  id: 195,
  name: "X Layer Testnet",
  nativeCurrency: { name: "OKB", symbol: "OKB", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testrpc.xlayer.tech"] },
    public:  { http: ["https://testrpc.xlayer.tech"] },
  },
  blockExplorers: {
    default: { name: "OKLink Testnet", url: "https://www.oklink.com/xlayer-test" },
  },
  testnet: true,
} as const satisfies Chain;

export const xlayerMainnet = {
  id: 196,
  name: "X Layer Mainnet",
  nativeCurrency: { name: "OKB", symbol: "OKB", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.xlayer.tech"] },
    public:  { http: ["https://rpc.xlayer.tech"] },
  },
  blockExplorers: {
    default: { name: "OKLink", url: "https://www.oklink.com/xlayer" },
  },
  testnet: false,
} as const satisfies Chain;

export const CHAINS = [xlayerTestnet, xlayerMainnet] as const;

export const wagmiConfig = createConfig({
  chains: CHAINS,
  connectors: [injected()],
  transports: {
    [xlayerTestnet.id]: http("https://testrpc.xlayer.tech"),
    [xlayerMainnet.id]: http("https://rpc.xlayer.tech"),
  },
});
