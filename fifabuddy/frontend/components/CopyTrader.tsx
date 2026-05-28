"use client";

import { useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { useCopyTrade } from "@/hooks/useCopyTrade";
import { xlayerTestnet } from "@/lib/wagmi";

type Analyst = {
  address: string;
  label: string;
  winRate: number;
  totalBets: number;
  roi: number;
  followers: number;
  topPick: string;
};

const SAMPLE_ANALYSTS: Analyst[] = [
  { address: "0x1234...5678", label: "GoalPredator", winRate: 82, totalBets: 47, roi: 34.5, followers: 128, topPick: "Brazil" },
  { address: "0x2345...6789", label: "MatchMindPro", winRate: 76, totalBets: 63, roi: 28.2, followers: 94, topPick: "France" },
  { address: "0x3456...7890", label: "WCOracle", winRate: 79, totalBets: 38, roi: 31.8, followers: 76, topPick: "Argentina" },
  { address: "0x4567...8901", label: "BetSage", winRate: 71, totalBets: 52, roi: 22.4, followers: 53, topPick: "Germany" },
  { address: "0x5678...9012", label: "FootyAnalyst", winRate: 68, totalBets: 44, roi: 19.7, followers: 41, topPick: "Spain" },
];

export function CopyTrader() {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { subscribed, toggleSubscription, autoExecuteEnabled, setAutoExecuteEnabled } = useCopyTrade();
  const [hovered, setHovered] = useState<string | null>(null);

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
        Top analysts ranked by ROI. Subscribe to mirror bets automatically.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {SAMPLE_ANALYSTS.map((analyst) => {
          const isSubscribed = subscribed.includes(analyst.label);
          return (
            <div
              key={analyst.label}
              onMouseEnter={() => setHovered(analyst.label)}
              onMouseLeave={() => setHovered(null)}
              className="glass-card"
              style={{
                padding: "10px 12px",
                border: isSubscribed ? "1px solid rgba(0,232,122,0.2)" : "1px solid var(--border-subtle)",
                background: isSubscribed ? "rgba(0,232,122,0.04)" : undefined,
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

      {isConnected && (
        <div style={{
          marginTop: 12, padding: "8px 12px", borderRadius: 8,
          background: "rgba(79,142,247,0.06)", border: "1px solid rgba(79,142,247,0.12)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <span className="anim-liveDot" style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--blue)", display: "inline-block" }} />
            <span style={{
              fontSize: 10, fontWeight: 700, color: "var(--blue)",
              fontFamily: "var(--font-display)",
            }}>
              Copy Trade Agent
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>
            {autoExecuteEnabled
              ? `Monitoring ${subscribed.length} analyst${subscribed.length !== 1 ? "s" : ""}.`
              : "Enable auto-execute to mirror trades."}
          </p>
        </div>
      )}
    </div>
  );
}
