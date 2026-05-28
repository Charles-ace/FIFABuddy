import { createConfig, http, createConnector } from "wagmi";
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

const injectedConnector = createConnector((config) => ({
  id: "injected",
  name: "Browser Wallet",
  type: "injected" as const,
  async connect() {
    const provider = typeof window !== "undefined" ? (window as any).ethereum : undefined;
    if (!provider) throw new Error("No injected wallet found");
    const accounts: `0x${string}`[] = await provider.request({ method: "eth_requestAccounts" });
    const chainId = await provider.request({ method: "eth_chainId" }).then(Number).catch(() => xlayerTestnet.id);
    return { accounts, chainId };
  },
  async disconnect() {
    config.emitter.emit("disconnect");
  },
  async getAccounts() {
    const provider = typeof window !== "undefined" ? (window as any).ethereum : undefined;
    if (!provider) return [] as `0x${string}`[];
    return provider.request({ method: "eth_accounts" }) as Promise<`0x${string}`[]>;
  },
  async getChainId() {
    const provider = typeof window !== "undefined" ? (window as any).ethereum : undefined;
    if (!provider) return xlayerTestnet.id;
    return provider.request({ method: "eth_chainId" }).then(Number).catch(() => xlayerTestnet.id);
  },
  async isAuthorized() {
    try { const accounts = await this.getAccounts(); return accounts.length > 0; } catch { return false; }
  },
  onAccountsChanged(accounts: `0x${string}`[]) {
    if (accounts.length === 0) config.emitter.emit("disconnect");
    else config.emitter.emit("change", { accounts });
  },
  onChainChanged(chainId: string) {
    config.emitter.emit("change", { chainId: Number(chainId) });
  },
  onDisconnect() {
    config.emitter.emit("disconnect");
  },
}));

export const wagmiConfig = createConfig({
  chains: [xlayerTestnet],
  connectors: [injectedConnector],
  transports: {
    [xlayerTestnet.id]: http("https://testrpc.xlayer.tech"),
  },
});
