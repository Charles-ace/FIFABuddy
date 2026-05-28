"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { xlayerTestnet, xlayerMainnet } from "@/lib/wagmi";

const tabs = ["Betting", "Live", "Analytics", "Leagues", "Top Predictors", "Bonuses"];

export function Navbar() {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const [activeTab, setActiveTab] = useState("Live");
  const [search, setSearch] = useState("");

  const isTestnet = chainId === xlayerTestnet.id;
  const isMainnet = chainId === xlayerMainnet.id;

  const handleConnect = async () => {
    const connector = connectors[0];
    if (!connector) return;
    try { await connectAsync({ connector, chainId: isMainnet ? xlayerMainnet.id : xlayerTestnet.id }); } catch { /* ignore */ }
  };

  const truncated = address ? `${address.slice(0, 4)}...${address.slice(-3)}` : "";

  return (
    <nav className="navbar">
      {/* Tabs */}
      <div style={{ display: "flex", gap: 2, flex: 1 }}>
        {tabs.map((t) => (
          <div key={t} className={`nav-tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
            {t}
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "5px 10px", borderRadius: 6,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid var(--border-glass)",
        marginRight: 12, minWidth: 160,
      }}>
        <span style={{ fontSize: 12, color: "var(--text-dim)" }}>⌕</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search matches..."
          style={{
            background: "none", border: "none", outline: "none",
            color: "var(--text)", fontSize: 11, width: "100%",
            fontFamily: "var(--font-body)",
          }}
        />
      </div>

      {/* Wallet */}
      {isConnected && (
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "4px 10px", borderRadius: 6,
          background: "var(--purple-dim)",
          border: "1px solid rgba(124,58,237,0.15)",
          marginRight: 10,
        }}>
          <span className="anim-liveDot" style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--green)", fontFamily: "var(--font-display)" }}>$1,284</span>
        </div>
      )}

      {/* Connect / Profile */}
      {isConnected ? (
        <button className="btn-ghost" onClick={() => disconnect()}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", fontSize: 11 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} />
          {truncated}
        </button>
      ) : (
        <button className="btn-primary" onClick={handleConnect} style={{ padding: "5px 14px", fontSize: 11 }}>
          Connect
        </button>
      )}
    </nav>
  );
}
