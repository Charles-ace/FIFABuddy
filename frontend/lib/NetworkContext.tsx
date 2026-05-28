"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { useAccount } from "wagmi";
import { xlayerMainnet, xlayerTestnet, type SupportedChain } from "@/lib/wagmi";

// ─── Contract address maps ────────────────────────────────────────────────────
// Mainnet addresses (from .env.local NEXT_PUBLIC_*_ADDRESS)
const MAINNET_ADDRESSES = {
  prediction: (process.env.NEXT_PUBLIC_PREDICTION_ADDRESS  || "0x0000000000000000000000000000000000000000") as `0x${string}`,
  community:  (process.env.NEXT_PUBLIC_COMMUNITY_ADDRESS   || "0x0000000000000000000000000000000000000000") as `0x${string}`,
  registry:   (process.env.NEXT_PUBLIC_REGISTRY_ADDRESS    || "0x0000000000000000000000000000000000000000") as `0x${string}`,
  usdt:       (process.env.NEXT_PUBLIC_USDT_ADDRESS        || "0x0000000000000000000000000000000000000000") as `0x${string}`,
};

// Testnet addresses (from .env.local NEXT_PUBLIC_TESTNET_*_ADDRESS)
const TESTNET_ADDRESSES = {
  prediction: (process.env.NEXT_PUBLIC_TESTNET_PREDICTION_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
  community:  (process.env.NEXT_PUBLIC_TESTNET_COMMUNITY_ADDRESS  || "0x0000000000000000000000000000000000000000") as `0x${string}`,
  registry:   (process.env.NEXT_PUBLIC_TESTNET_REGISTRY_ADDRESS   || "0x0000000000000000000000000000000000000000") as `0x${string}`,
  usdt:       (process.env.NEXT_PUBLIC_TESTNET_USDT_ADDRESS       || "0x0000000000000000000000000000000000000000") as `0x${string}`,
};

// ─── Context shape ────────────────────────────────────────────────────────────
export type NetworkMode = "mainnet" | "testnet";

interface NetworkContextValue {
  mode: NetworkMode;
  activeChain: SupportedChain;
  isTestnet: boolean;
  addresses: typeof MAINNET_ADDRESSES;
  toggleNetwork: () => void;
  setMode: (mode: NetworkMode) => void;
}

const NetworkContext = createContext<NetworkContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function NetworkProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<NetworkMode>("mainnet");
  const { chainId, isConnected } = useAccount();

  // Sync mode with the connected wallet's chain
  useEffect(() => {
    if (isConnected && chainId) {
      if (chainId === xlayerTestnet.id) {
        setModeState("testnet");
      } else if (chainId === xlayerMainnet.id) {
        setModeState("mainnet");
      }
    }
  }, [chainId, isConnected]);

  const setMode = useCallback((next: NetworkMode) => {
    setModeState(next);
  }, []);

  const toggleNetwork = useCallback(() => {
    setModeState((prev) => (prev === "mainnet" ? "testnet" : "mainnet"));
  }, []);

  const isTestnet = mode === "testnet";
  const activeChain: SupportedChain = isTestnet ? xlayerTestnet : xlayerMainnet;
  const addresses = isTestnet ? TESTNET_ADDRESSES : MAINNET_ADDRESSES;

  return (
    <NetworkContext.Provider value={{ mode, activeChain, isTestnet, addresses, toggleNetwork, setMode }}>
      {children}
    </NetworkContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useNetwork() {
  const ctx = useContext(NetworkContext);
  if (!ctx) {
    throw new Error("useNetwork must be used inside <NetworkProvider>");
  }
  return ctx;
}
