import { createConfig, http } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";
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

export const wagmiConfig = createConfig({
  chains: [xlayerTestnet],
  connectors: [
    injected(),
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID! }),
  ],
  transports: {
    [xlayerTestnet.id]: http("https://testrpc.xlayer.tech"),
  },
});
