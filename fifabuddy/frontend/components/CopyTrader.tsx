"use client";

import { useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { useCopyTrade, SAMPLE_ANALYSTS } from "@/hooks/useCopyTrade";
import { xlayerTestnet } from "@/lib/wagmi";

export function CopyTrader() {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const {
    subscribed, toggleSubscription, autoExecuteEnabled, setAutoExecuteEnabled,
    executedTrades, isPolling,
  } = useCopyTrade();

  const handleConnect = async () => {
    const connector = connectors[0];
    if (!connector) return;
    try { await connectAsync({ connector, chainId: xlayerTestnet.id }); } catch { /* ignore */ }
  };

  return (
    <div className="border-glow" style={{
      padding: 16, borderRadius: 12,
      background: "var(--bg-card)",
      border: "1px solid transparent",
      marginTop: 8,
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="4" width="4" height="10" rx="1" fill="var(--green)"/>
            <rect x="6" y="2" width="4" height="12" rx="1" fill="var(--blue)"/>
            <rect x="11" y="6" width="4" height="8" rx="1" fill="var(--gold)"/>
          </svg>
          <h4 className="gradient-green" style={{
            margin: 0, fontSize: 13, fontWeight: 700, fontFamily: "var(--font-display)",
          }}>
            Copy Trading Terminal
          </h4>
          {isPolling && (
            <span className="anim-liveDot" style={{
              width: 5, height: 5, borderRadius: "50%",
              background: "var(--green)", display: "inline-block",
            }} />
          )}
        </div>
        {isConnected && (
          <label style={{
            display: "flex", alignItems: "center", gap: 5, fontSize: 10,
            color: "var(--text-muted)", cursor: "pointer",
            fontFamily: "var(--font-display)",
          }}>
            <input type="checkbox" checked={autoExecuteEnabled}
              onChange={(e) => setAutoExecuteEnabled(e.target.checked)}
              style={{ accentColor: "var(--green)" }} />
            Auto-execute
          </label>
        )}
      </div>

      <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 12, fontFamily: "var(--font-display)" }}>
        Top analysts ranked by ROI. Subscribe to mirror their bets automatically.
      </div>

      {/* Analysts */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
        {SAMPLE_ANALYSTS.map((analyst, i) => {
          const isSubscribed = subscribed.includes(analyst.label);
          return (
            <div
              key={analyst.label}
              className="glass-card"
              style={{
                padding: "10px 12px",
                border: isSubscribed ? "1px solid rgba(0,232,122,0.2)" : "1px solid var(--border-subtle)",
                background: isSubscribed ? "rgba(0,232,122,0.04)" : undefined,
                animation: `fadeUp 0.3s ease ${i * 0.05}s forwards`,
                opacity: 0,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div className="anim-glow" style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--green), var(--blue))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 700, color: "#06060e",
                    fontFamily: "var(--font-display)",
                  }}>
                    {analyst.label[0]}
                  </div>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                      {analyst.label}
                    </span>
                    <span style={{ fontSize: 9, color: "var(--text-muted)", marginLeft: 6 }}>
                      {analyst.followers} followers
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (!isConnected) { await handleConnect(); return; }
                    toggleSubscription(analyst.label);
                  }}
                  className={isSubscribed ? "btn-outline" : "btn-primary"}
                  style={{
                    padding: "3px 10px", fontSize: 10, fontFamily: "var(--font-display)",
                    border: isSubscribed ? "1px solid var(--green)" : undefined,
                    color: isSubscribed ? "var(--green)" : undefined,
                  }}
                >
                  {isSubscribed ? "Unfollow" : "Copy Trade"}
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
                {[
                  { l: "Win Rate", v: `${analyst.winRate}%`, c: "var(--green)" },
                  { l: "Bets", v: `${analyst.totalBets}`, c: "var(--text-muted)" },
                  { l: "ROI", v: `+${analyst.roi}%`, c: "var(--gold)" },
                  { l: "Pick", v: analyst.topPick, c: "var(--blue)" },
                ].map(({ l, v, c }) => (
                  <div key={l}>
                    <div style={{ fontSize: 8, color: "var(--text-dim)", marginBottom: 1, fontFamily: "var(--font-display)" }}>
                      {l}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: c, fontFamily: "var(--font-display)" }}>
                      {v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Status card */}
      {isConnected && (
        <div style={{
          padding: "10px 12px", borderRadius: 8, marginBottom: executedTrades.length > 0 ? 12 : 0,
          background: autoExecuteEnabled
            ? "rgba(0,232,122,0.06)"
            : "rgba(79,142,247,0.06)",
          border: `1px solid ${
            autoExecuteEnabled ? "rgba(0,232,122,0.12)" : "rgba(79,142,247,0.12)"
          }`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <span className="anim-liveDot" style={{
              width: 5, height: 5, borderRadius: "50%",
              background: autoExecuteEnabled ? "var(--green)" : "var(--blue)",
              display: "inline-block",
            }} />
            <span style={{
              fontSize: 10, fontWeight: 700,
              color: autoExecuteEnabled ? "var(--green)" : "var(--blue)",
              fontFamily: "var(--font-display)",
            }}>
              Copy Trade Agent
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>
            {autoExecuteEnabled
              ? `Monitoring ${subscribed.length} analyst${subscribed.length !== 1 ? "s" : ""} — polling community board every 15s`
              : "Enable auto-execute to automatically mirror trades from subscribed analysts."}
          </p>
        </div>
      )}

      {/* Executed trades log */}
      {executedTrades.length > 0 && (
        <div>
          <p style={{
            fontSize: 10, color: "var(--text-muted)", fontWeight: 600,
            fontFamily: "var(--font-display)", marginBottom: 6,
          }}>
            Auto-Executed Trades
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {executedTrades.slice(-5).reverse().map((trade, i) => (
              <div key={i} className="glass-card" style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "6px 10px",
                border: trade.status === "confirmed"
                  ? "1px solid rgba(0,232,122,0.15)"
                  : trade.status === "failed"
                  ? "1px solid rgba(255,77,109,0.15)"
                  : "1px solid var(--border-subtle)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{
                    width: 5, height: 5, borderRadius: "50%",
                    background: trade.status === "confirmed" ? "var(--green)"
                      : trade.status === "failed" ? "var(--red)" : "var(--gold)",
                    display: "inline-block",
                  }} />
                  <span style={{ fontSize: 10, color: "var(--text-secondary)", fontFamily: "var(--font-display)" }}>
                    {trade.analyst}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: "var(--text-primary)" }}>
                    {trade.pick}
                  </span>
                  <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                    {trade.amount} USDT
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
