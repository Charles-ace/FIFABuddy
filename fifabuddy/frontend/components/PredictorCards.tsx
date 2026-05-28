"use client";

import { useState } from "react";
import { useAccount, useConnect } from "wagmi";

const predictors = [
  { name: "GoalPredator", winRate: 82, roi: "+34.5%", followers: 128, color: "var(--green)" },
  { name: "MatchMindPro", winRate: 76, roi: "+28.2%", followers: 94, color: "var(--purple)" },
  { name: "WCOracle", winRate: 79, roi: "+31.8%", followers: 76, color: "var(--violet)" },
  { name: "BetSage", winRate: 71, roi: "+22.4%", followers: 53, color: "var(--blue)" },
  { name: "FootyAnalyst", winRate: 68, roi: "+19.7%", followers: 41, color: "var(--gold)" },
];

export function PredictorCards() {
  const { isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const [following, setFollowing] = useState<string[]>([]);

  const toggleFollow = async (name: string) => {
    if (!isConnected) {
      const connector = connectors[0];
      if (connector) try { await connectAsync({ connector }); } catch { /* ignore */ }
      return;
    }
    setFollowing((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
      <div className="section-label">Top Predictors</div>
      {predictors.map((p, i) => {
        const isFollowing = following.includes(p.name);
        return (
          <div
            key={p.name}
            className="glass-card"
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px",
              animation: `fadeUp 0.3s ease ${i * 0.04}s forwards`,
              opacity: 0,
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: `linear-gradient(135deg, ${p.color}, transparent 150%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: "#fff",
              fontFamily: "var(--font-display)",
            }}>
              {p.name[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-display)" }}>
                {p.name}
              </div>
              <div style={{ fontSize: 9, color: "var(--text-muted)" }}>
                {p.followers} followers
              </div>
            </div>
            <div style={{ textAlign: "right", marginRight: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--green)", fontFamily: "var(--font-display)" }}>
                {p.winRate}%
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: "var(--gold)" }}>
                {p.roi}
              </div>
            </div>
            <button
              className={isFollowing ? "btn-outline" : "btn-primary"}
              onClick={() => toggleFollow(p.name)}
              style={{ padding: "4px 10px", fontSize: 10, whiteSpace: "nowrap" }}
            >
              {isFollowing ? "Followed" : "Follow"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
