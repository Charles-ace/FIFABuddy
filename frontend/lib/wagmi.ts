import { injected } from "@wagmi/core";
import type { EIP1193Provider } from "viem";
import { createConfig, http } from "wagmi";

export const xlayerMainnet = {
  id: 196,
  name: "X Layer Mainnet",
  nativeCurrency: { name: "OKB", symbol: "OKB", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.xlayer.tech", "https://xlayerrpc.okx.com"] },
    public: { http: ["https://rpc.xlayer.tech", "https://xlayerrpc.okx.com"] },
  },
  blockExplorers: {
    default: { name: "OKX Explorer", url: "https://www.okx.com/web3/explorer/xlayer" },
  },
} as const;

type WalletProvider = EIP1193Provider & {
  providers?: WalletProvider[];
  isMetaMask?: true;
  isOkxWallet?: true;
  isOKExWallet?: true;
  [key: string]: unknown;
};

function findInjectedProvider(
  windowRef: unknown,
  predicate: (provider: WalletProvider) => boolean
) {
  const provider = (windowRef as { ethereum?: WalletProvider } | undefined)?.ethereum;
  if (!provider) return undefined;

  if (Array.isArray(provider.providers)) {
    return provider.providers.find(predicate);
  }

  return predicate(provider) ? provider : undefined;
}

const metaMaskConnector = injected({ target: "metaMask" });
const okxWalletConnector = injected({
  target: {
    id: "okxWallet",
    name: "OKX Wallet",
    provider(windowRef) {
      return findInjectedProvider(windowRef, (provider) => Boolean(provider.isOkxWallet || provider.isOKExWallet));
    },
  },
});

export const supportedWalletConnectors = [metaMaskConnector, okxWalletConnector] as const;

export const activeXLayerChain = xlayerMainnet;

export function getSupportedConnector<T extends { id: string }>(connectors: readonly T[], connectorId?: string) {
  if (connectorId) {
    return connectors.find((connector) => connector.id === connectorId);
  }

  return (
    connectors.find((connector) => connector.id === "metaMask") ??
    connectors.find((connector) => connector.id === "okxWallet") ??
    connectors[0]
  );
}

export function getSupportedWalletConnectors<T extends { id: string }>(connectors: readonly T[]) {
  return connectors.filter((connector) => connector.id === "metaMask" || connector.id === "okxWallet");
}

export function getXLayerExplorerTxUrl(hash: string) {
  return `${activeXLayerChain.blockExplorers.default.url}/tx/${hash}`;
}

export const wagmiConfig = createConfig({
  chains: [xlayerMainnet],
  connectors: [...supportedWalletConnectors],
  transports: {
    [xlayerMainnet.id]: http(xlayerMainnet.rpcUrls.default.http[0]),
  },
});
