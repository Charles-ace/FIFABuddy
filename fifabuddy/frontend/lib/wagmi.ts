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

function injected(): any {
  let provider: any;
  return {
    id: "injected",
    name: "Browser Wallet",
    type: "injected",
    async connect() {
      provider = typeof window !== "undefined" ? (window as any).ethereum : undefined;
      if (!provider) throw new Error("No injected wallet found");
      const accounts: `0x${string}`[] = await provider.request({ method: "eth_requestAccounts" });
      const chainId = await provider.request({ method: "eth_chainId" }).then(Number).catch(() => xlayerTestnet.id);
      return { accounts, chainId };
    },
    async disconnect() {},
    async getAccounts() {
      if (!provider && typeof window !== "undefined") provider = (window as any).ethereum;
      if (!provider) return [];
      return provider.request({ method: "eth_accounts" });
    },
    async getChainId() {
      if (!provider && typeof window !== "undefined") provider = (window as any).ethereum;
      if (!provider) return xlayerTestnet.id;
      return provider.request({ method: "eth_chainId" }).then(Number).catch(() => xlayerTestnet.id);
    },
    async isAuthorized() {
      try { const accounts = await this.getAccounts(); return accounts.length > 0; } catch { return false; }
    },
  };
}

export const wagmiConfig = createConfig({
  chains: [xlayerTestnet],
  connectors: [injected()],
  transports: {
    [xlayerTestnet.id]: http("https://testrpc.xlayer.tech"),
  },
});
