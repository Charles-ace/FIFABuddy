import { injected } from "wagmi/connectors";
import type { EIP1193Provider } from "viem";
import { createConfig, http } from "wagmi";

// ─── X Layer Mainnet (Chain ID 196) ─────────────────────────────────────────
export const xlayerMainnet = {
  id: 196,
  name: "X Layer Mainnet",
  nativeCurrency: { name: "OKB", symbol: "OKB", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.xlayer.tech", "https://xlayerrpc.okx.com"] },
    public:  { http: ["https://rpc.xlayer.tech", "https://xlayerrpc.okx.com"] },
  },
  blockExplorers: {
    default: { name: "OKX Explorer", url: "https://www.okx.com/web3/explorer/xlayer" },
  },
  testnet: false,
} as const;

// ─── X Layer Testnet (Chain ID 195) ─────────────────────────────────────────
export const xlayerTestnet = {
  id: 195,
  name: "X Layer Testnet",
  nativeCurrency: { name: "OKB", symbol: "OKB", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testrpc.xlayer.tech", "https://xlayertestrpc.okx.com"] },
    public:  { http: ["https://testrpc.xlayer.tech", "https://xlayertestrpc.okx.com"] },
  },
  blockExplorers: {
    default: { name: "OKX Testnet Explorer", url: "https://www.okx.com/web3/explorer/xlayer-test" },
  },
  testnet: true,
} as const;

export type SupportedChain = typeof xlayerMainnet | typeof xlayerTestnet;

// ─── Provider detection helpers ──────────────────────────────────────────────
type WalletProvider = EIP1193Provider & {
  providers?: WalletProvider[];
  isMetaMask?: true;
  isOkxWallet?: true;
  isOKExWallet?: true;
  isOkx?: true;
  isOKX?: true;
  [key: string]: unknown;
};

type WalletWindow = {
  ethereum?: WalletProvider;
  okxwallet?: WalletProvider | { ethereum?: WalletProvider };
  okexchain?: WalletProvider;
};

function findInjectedProvider(
  windowRef: unknown,
  predicate: (provider: WalletProvider) => boolean
) {
  const provider = (windowRef as WalletWindow | undefined)?.ethereum;
  if (!provider) return undefined;

  if (Array.isArray(provider.providers)) {
    return provider.providers.find(predicate);
  }

  return predicate(provider) ? provider : undefined;
}

function getOkxProvider(windowRef: unknown) {
  const win = windowRef as WalletWindow | undefined;
  const flaggedProvider = findInjectedProvider(
    windowRef,
    (provider) =>
      Boolean(
        provider.isOkxWallet ||
          provider.isOKExWallet ||
          provider.isOkx ||
          provider.isOKX
      )
  );

  if (flaggedProvider) return flaggedProvider;

  const okxWallet = win?.okxwallet;
  if (okxWallet && "request" in okxWallet) return okxWallet;
  if (okxWallet && "ethereum" in okxWallet && okxWallet.ethereum) {
    return okxWallet.ethereum;
  }

  return win?.okexchain;
}

// ─── Connectors ──────────────────────────────────────────────────────────────
const metaMaskConnector = injected({ target: "metaMask" });
const okxWalletConnector = injected({
  target: {
    id: "okxWallet",
    name: "OKX Wallet",
    provider(windowRef) {
      return getOkxProvider(windowRef);
    },
  },
});

export const supportedWalletConnectors = [metaMaskConnector, okxWalletConnector] as const;

// ─── Wagmi Config (supports both networks) ───────────────────────────────────
export const wagmiConfig = createConfig({
  chains: [xlayerMainnet, xlayerTestnet],
  connectors: [...supportedWalletConnectors],
  transports: {
    [xlayerMainnet.id]: http(xlayerMainnet.rpcUrls.default.http[0]),
    [xlayerTestnet.id]: http(xlayerTestnet.rpcUrls.default.http[0]),
  },
});

// ─── Utility helpers ─────────────────────────────────────────────────────────
type ConnectorLike = {
  id: string;
  name?: string;
  rdns?: string | readonly string[];
};

function getConnectorSearchText(connector: ConnectorLike) {
  const rdns = Array.isArray(connector.rdns)
    ? connector.rdns.join(" ")
    : connector.rdns ?? "";
  return `${connector.id} ${connector.name ?? ""} ${rdns}`.toLowerCase();
}

export function getWalletKind(connector: ConnectorLike) {
  const searchText = getConnectorSearchText(connector);

  if (searchText.includes("okx") || searchText.includes("okex")) {
    return "okx" as const;
  }

  if (searchText.includes("metamask")) {
    return "metamask" as const;
  }

  return undefined;
}

function getWalletRank(connector: ConnectorLike) {
  const kind = getWalletKind(connector);
  const isEip6963 = connector.id.includes(".");

  if (kind === "metamask") return isEip6963 ? 0 : 1;
  if (kind === "okx") return isEip6963 ? 2 : 3;
  return 99;
}

export function getSupportedConnector<T extends ConnectorLike>(connectors: readonly T[], connectorId?: string) {
  if (connectorId) {
    return connectors.find((connector) => connector.id === connectorId);
  }

  return getSupportedWalletConnectors(connectors)[0] ?? connectors[0];
}

export function getSupportedWalletConnectors<T extends ConnectorLike>(connectors: readonly T[]) {
  const walletByKind = new Map<"metamask" | "okx", T>();

  for (const connector of [...connectors].sort((a, b) => getWalletRank(a) - getWalletRank(b))) {
    const kind = getWalletKind(connector);
    if (kind && !walletByKind.has(kind)) {
      walletByKind.set(kind, connector);
    }
  }

  return [...walletByKind.values()];
}

export function getXLayerExplorerTxUrl(hash: string, testnet = false) {
  const baseUrl = testnet
    ? xlayerTestnet.blockExplorers.default.url
    : xlayerMainnet.blockExplorers.default.url;
  return `${baseUrl}/tx/${hash}`;
}

/** @deprecated use NetworkContext instead */
export const activeXLayerChain = xlayerMainnet;
