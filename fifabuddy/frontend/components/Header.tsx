"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { xlayerTestnet, xlayerMainnet } from "@/lib/wagmi";
import { Logo } from "@/components/Logo";

const FAUCET_URL = "https://www.okx.com/xlayer/faucet";

export function Header() {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();

  const isTestnet = chainId === xlayerTestnet.id;
  const isMainnet = chainId === xlayerMainnet.id;
  const isCorrectNetwork = isTestnet || isMainnet;
  const currentChain = isMainnet ? xlayerMainnet : xlayerTestnet;

  const handleConnect = async () => {
    const connector = connectors[0];
    if (!connector) return;
    try { await connectAsync({ connector, chainId: currentChain.id }); } catch { /* ignore */ }
  };

  const handleToggleNetwork = async () => {
    const target = isMainnet ? xlayerTestnet.id : xlayerMainnet.id;
    try { await switchChainAsync({ chainId: target }); } catch { /* ignore */ }
  };

  const truncated = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  return (
    <header className="anim-fadeDown" style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 24px",
      borderBottom: "1px solid var(--border-subtle)",
      background: "rgba(6,6,14,0.8)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Logo />
        <span className="gradient-text" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px" }}>
          FIFABuddy
        </span>
        <div style={{
          display: "flex", alignItems: "center", gap: 3,
          padding: 3, borderRadius: 8,
          background: "rgba(255,255,255,0.04)",
        }}>
          <button type="button" onClick={() => { if (isMainnet) handleToggleNetwork(); }} style={{
            padding: "3px 10px", borderRadius: 5, border: "none",
            background: isTestnet ? "rgba(79,142,247,0.15)" : "transparent",
            color: isTestnet ? "var(--blue)" : "var(--text-muted)",
            fontWeight: 600, fontSize: 11, cursor: "pointer",
            fontFamily: "var(--font-display)", transition: "all 0.2s",
          }}>
            Testnet
          </button>
          <button type="button" onClick={() => { if (isTestnet) handleToggleNetwork(); }} style={{
            padding: "3px 10px", borderRadius: 5, border: "none",
            background: isMainnet ? "rgba(0,232,122,0.15)" : "transparent",
            color: isMainnet ? "var(--green)" : "var(--text-muted)",
            fontWeight: 600, fontSize: 11, cursor: "pointer",
            fontFamily: "var(--font-display)", transition: "all 0.2s",
          }}>
            Mainnet
          </button>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {isConnected && isTestnet && (
          <button type="button" onClick={() => window.open(FAUCET_URL, "_blank")}
            className="btn-gold" style={{ padding: "7px 14px", fontSize: 11 }}>
            Faucet
          </button>
        )}
        {isConnected && !isCorrectNetwork ? (
          <button type="button" onClick={handleToggleNetwork}
            className="btn-gold" style={{ padding: "7px 16px", fontSize: 12 }}>
            Switch Network
          </button>
        ) : isConnected ? (
          <button type="button" onClick={() => disconnect()}
            className="btn-outline" style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "7px 14px", fontSize: 12,
            }}>
            <span className="anim-liveDot" style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "var(--green)", display: "inline-block",
            }} />
            {truncated}
          </button>
        ) : (
          <button type="button" onClick={handleConnect}
            className="btn-primary" style={{ padding: "7px 20px", fontSize: 12 }}>
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}
