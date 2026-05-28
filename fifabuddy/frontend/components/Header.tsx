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
        <span style={{ fontWeight: 700, fontSize: 18, color: "var(--text)" }}>FIFABuddy</span>
        <button
          type="button"
          onClick={handleToggleNetwork}
          style={{
            fontSize: 11, padding: "2px 8px", borderRadius: 4,
            background: isMainnet ? "var(--green-dim)" : "var(--blue-dim)",
            color: isMainnet ? "var(--green)" : "var(--blue)",
            fontWeight: 600, letterSpacing: "0.3px",
            border: "none", cursor: "pointer", transition: "all 0.2s",
            display: "flex", alignItems: "center", gap: 4,
          }}
        >
          <span className="animate-liveDot" style={{
            width: 4, height: 4, borderRadius: "50%",
            background: isMainnet ? "var(--green)" : "var(--blue)",
            display: "inline-block",
          }} />
          {isMainnet ? "X Layer Mainnet" : "X Layer Testnet"}
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {isConnected && isTestnet && (
          <>
            <button
              type="button"
              onClick={() => window.open(FAUCET_URL, "_blank")}
              style={{
                padding: "8px 14px", borderRadius: 8, border: "1px solid var(--gold)",
                background: "var(--gold-dim)", color: "var(--gold)",
                fontWeight: 600, fontSize: 12, cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Faucet
            </button>
          </>
        )}
        {isConnected && !isCorrectNetwork ? (
          <button
            type="button"
            onClick={handleToggleNetwork}
            style={{
              padding: "8px 16px", borderRadius: 8, border: "none",
              background: "var(--gold)", color: "#080810",
              fontWeight: 600, fontSize: 13, cursor: "pointer",
              transition: "filter 0.2s, transform 0.2s",
            }}
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
            style={{
              padding: "8px 20px", borderRadius: 8, border: "none",
              background: "var(--green)", color: "#080810",
              fontWeight: 600, fontSize: 13, cursor: "pointer",
              transition: "filter 0.2s, transform 0.2s",
            }}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}
