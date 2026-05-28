"use client";

import type { MergedFixture } from "@/lib/football";

type Props = {
  fixture: MergedFixture | null;
  odds?: { home: bigint; draw: bigint; away: bigint };
};

export function HeroMatch({ fixture, odds }: Props) {
  if (!fixture || !fixture.team1) return null;

  const homeOdds = odds ? Number(odds.home) / 1_000_000 : 0;
  const total = odds ? Number(odds.home) + Number(odds.draw) + Number(odds.away) : 1;
  const homeProb = total > 0 ? Math.round((Number(odds?.home || 0n) / total) * 100) : 45;
  const awayProb = total > 0 ? Math.round((Number(odds?.away || 0n) / total) * 100) : 45;

  return (
    <div className="border-glow anim-scale" style={{
      padding: 20, borderRadius: 12,
      background: "var(--bg-card)",
      border: "1px solid transparent",
      marginBottom: 16,
      position: "relative", overflow: "hidden",
    }}>
      {/* Gradient overlay */}
      <div style={{
        position: "absolute", top: 0, right: 0, width: "40%", height: "100%",
        background: "linear-gradient(135deg, transparent, rgba(124,58,237,0.04))",
        pointerEvents: "none",
      }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <div className="live-badge">LIVE</div>
        <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>
          World Cup 2026 • Group Stage
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Home */}
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: "linear-gradient(135deg, var(--purple-dim), var(--violet-dim))",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 8px", fontSize: 20, fontWeight: 700, color: "var(--violet-bright)",
            fontFamily: "var(--font-display)",
          }}>
            {fixture.team1[0]}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-display)" }}>
            {fixture.team1}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
            {homeProb}% win
          </div>
        </div>

        {/* Score */}
        <div style={{ padding: "0 24px", textAlign: "center" }}>
          {fixture.live ? (
            <div style={{ fontSize: 36, fontWeight: 900, color: "var(--text)", fontFamily: "var(--font-display)", letterSpacing: "-2px" }}>
              {fixture.live.homeGoals} : {fixture.live.awayGoals}
            </div>
          ) : (
            <div style={{ fontSize: 13, color: "var(--text-dim)", fontFamily: "var(--font-display)" }}>
              {fixture.time || "Kick-off"}
            </div>
          )}
          <div className="anim-green" style={{
            marginTop: 6, padding: "3px 12px", borderRadius: 4,
            background: "var(--green-dim)", fontSize: 10, fontWeight: 700,
            color: "var(--green)", fontFamily: "var(--font-display)",
            display: "inline-block",
          }}>
            {homeOdds > 0 ? `$${homeOdds.toFixed(0)}` : "AI Ready"}
          </div>
        </div>

        {/* Away */}
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: "linear-gradient(135deg, var(--purple-dim), var(--violet-dim))",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 8px", fontSize: 20, fontWeight: 700, color: "var(--violet-bright)",
            fontFamily: "var(--font-display)",
          }}>
            {fixture.team2[0]}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-display)" }}>
            {fixture.team2}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
            {awayProb}% win
          </div>
        </div>
      </div>

      {/* AI confidence bar */}
      <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 9, color: "var(--text-dim)", fontWeight: 700, fontFamily: "var(--font-display)" }}>
          AI CONFIDENCE
        </span>
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
          <div className="anim-green" style={{
            width: `${Math.max(homeProb, awayProb)}%`, height: "100%",
            background: "linear-gradient(90deg, var(--purple), var(--green))",
            borderRadius: 2,
          }} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 800, color: "var(--green)", fontFamily: "var(--font-display)" }}>
          {Math.max(homeProb, awayProb)}%
        </span>
      </div>

      {/* CTA */}
      <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
        <button className="btn-primary" style={{ flex: 1, padding: "10px 0", fontSize: 12 }}>
          Predict Now
        </button>
        <button className="btn-outline" style={{ padding: "10px 20px", fontSize: 11 }}>
          View Details
        </button>
      </div>
    </div>
  );
}
