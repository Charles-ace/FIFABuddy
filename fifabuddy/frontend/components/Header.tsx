"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { xlayerTestnet, xlayerMainnet } from "@/lib/wagmi";

const FAUCET_URL = "https://www.okx.com/xlayer/faucet";

export function Header() {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const [showFaucet, setShowFaucet] = useState(false);

  const isTestnet = chainId === xlayerTestnet.id;
  const isMainnet = chainId === xlayerMainnet.id;
  const isCorrectNetwork = isTestnet || isMainnet;
  const currentChain = isMainnet ? xlayerMainnet : xlayerTestnet;

  const handleConnect = async () => {
    const connector = connectors[0];
    if (!connector) return;
    try {
      await connectAsync({ connector, chainId: currentChain.id });
    } catch { /* ignore */ }
  };

  const handleToggleNetwork = async () => {
    const target = isMainnet ? xlayerTestnet.id : xlayerMainnet.id;
    try {
      await switchChainAsync({ chainId: target });
    } catch { /* ignore */ }
  };

  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  return (
    <header className="animate-fadeIn" style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 24px",
      borderBottom: "1px solid var(--border)",
      background: "var(--card)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="animate-glow" style={{
          width: 32, height: 32, borderRadius: 8,
          background: "linear-gradient(135deg, var(--green), #00b862)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: 14, color: "#080810",
        }}>
          MM
        </div>
        <span className="gradient-text" style={{ fontWeight: 800, fontSize: 20 }}>FIFABuddy</span>
        <div style={{
          display: "flex", alignItems: "center", gap: 4,
          padding: 3, borderRadius: 8,
          background: "rgba(255,255,255,0.04)",
        }}>
          <button
            type="button"
            onClick={() => { if (isMainnet) handleToggleNetwork(); }}
            style={{
              padding: "3px 10px", borderRadius: 5, border: "none",
              background: isTestnet ? "var(--blue-dim)" : "transparent",
              color: isTestnet ? "var(--blue)" : "var(--muted)",
              fontWeight: 600, fontSize: 11, cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Testnet
          </button>
          <button
            type="button"
            onClick={() => { if (isTestnet) handleToggleNetwork(); }}
            style={{
              padding: "3px 10px", borderRadius: 5, border: "none",
              background: isMainnet ? "var(--green-dim)" : "transparent",
              color: isMainnet ? "var(--green)" : "var(--muted)",
              fontWeight: 600, fontSize: 11, cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Mainnet
          </button>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {isConnected && isTestnet && (
          <>
            <button
              type="button"
              onClick={() => window.open(FAUCET_URL, "_blank")}
              className="btn-gold"
              style={{ padding: "8px 14px", fontSize: 12 }}
            >
              Faucet
            </button>
          </>
        )}
        {isConnected && !isCorrectNetwork ? (
          <button
            type="button"
            onClick={handleToggleNetwork}
            className="btn-gold"
            style={{ padding: "8px 16px", fontSize: 13 }}
          >
            Switch Network
          </button>
        ) : isConnected ? (
          <button
            type="button"
            onClick={() => disconnect()}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)",
              background: "transparent", color: "var(--text)", cursor: "pointer",
              transition: "border-color 0.2s",
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
            className="btn-primary"
            style={{ padding: "8px 20px", fontSize: 13 }}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}
