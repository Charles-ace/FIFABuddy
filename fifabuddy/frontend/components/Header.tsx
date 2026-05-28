"use client";

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { xlayerTestnet } from "@/lib/wagmi";

export function Header() {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();

  const isCorrectNetwork = chainId === xlayerTestnet.id;

  const handleConnect = async () => {
    const connector = connectors[0];
    if (!connector) return;
    try {
      await connectAsync({ connector, chainId: xlayerTestnet.id });
    } catch (error) {
      console.error("Wallet connection failed", error);
    }
  };

  const handleSwitchNetwork = async () => {
    try {
      await switchChainAsync({ chainId: xlayerTestnet.id });
    } catch (error) {
      console.error("Network switch failed", error);
    }
  };

  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  return (
    <header style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 24px",
      borderBottom: "1px solid var(--border)",
      background: "var(--card)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "linear-gradient(135deg, var(--green), #00b862)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: 14, color: "#080810",
        }}>
          MM
        </div>
          <span style={{ fontWeight: 700, fontSize: 18, color: "var(--text)" }}>FIFABuddy</span>
        <span style={{
          fontSize: 11, padding: "2px 8px", borderRadius: 4,
          background: "var(--blue-dim)", color: "var(--blue)",
          fontWeight: 600, letterSpacing: "0.3px",
        }}>
          X Layer Testnet
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {isConnected && !isCorrectNetwork ? (
          <button
            type="button"
            onClick={handleSwitchNetwork}
            style={{
              padding: "8px 16px", borderRadius: 8, border: "none",
              background: "var(--gold)", color: "#080810",
              fontWeight: 600, fontSize: 13, cursor: "pointer",
            }}
          >
            Switch to X Layer Testnet
          </button>
        ) : isConnected ? (
          <button
            type="button"
            onClick={() => disconnect()}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)",
              background: "transparent", color: "var(--text)", cursor: "pointer",
            }}
          >
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "var(--green)", display: "inline-block",
            }} />
            <strong style={{ fontSize: 13 }}>{truncatedAddress}</strong>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleConnect}
            style={{
              padding: "8px 20px", borderRadius: 8, border: "none",
              background: "var(--green)", color: "#080810",
              fontWeight: 600, fontSize: 13, cursor: "pointer",
            }}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}
