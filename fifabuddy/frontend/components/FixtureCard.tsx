"use client";

import type { MergedFixture } from "@/lib/football";

type Props = {
  fixture: MergedFixture;
  active?: boolean;
  onSelect?: () => void;
  onBet?: (outcome: 1 | 2 | 3) => void;
  odds?: { home: bigint; draw: bigint; away: bigint };
  sentiment?: { home: number; draw: number; away: number };
  onToggleCommunity?: () => void;
  communityOpen?: boolean;
};

export function FixtureCard({
  fixture, active, onSelect, onBet,
  odds, sentiment, onToggleCommunity, communityOpen,
}: Props) {
  const total = sentiment ? sentiment.home + sentiment.draw + sentiment.away : 1;
  const homePct = sentiment ? (sentiment.home / total) * 100 : 33;
  const drawPct = sentiment ? (sentiment.draw / total) * 100 : 33;
  const awayPct = sentiment ? (sentiment.away / total) * 100 : 33;
  const isLive = fixture.live?.status === "LIVE" || fixture.live?.status === "1H" || fixture.live?.status === "2H";

  return (
    <div
      className={`glass-card ${active ? "border-glow anim-glow" : ""}`}
      style={{
        padding: 16,
        border: active ? "1px solid transparent" : "1px solid var(--border-subtle)",
        marginBottom: 12,
        cursor: "pointer",
      }}
      onClick={onSelect}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="gradient-green" style={{
            fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700,
          }}>
            {fixture.round}
          </span>
          {isLive && <span className="live-badge">LIVE {fixture.live?.minute}'</span>}
        </div>
        <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>
          {fixture.date} {fixture.time}
        </span>
      </div>

      {/* Teams */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ flex: 1, textAlign: "left" }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
            {fixture.team1}
          </span>
          {isLive && fixture.live && (
            <span style={{ fontSize: 15, fontWeight: 800, color: "var(--green)", marginLeft: 8, fontFamily: "var(--font-display)" }}>
              {fixture.live.homeGoals}
            </span>
          )}
        </div>
        <div style={{ padding: "0 16px" }}>
          <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, fontFamily: "var(--font-display)", letterSpacing: "1px" }}>
            VS
          </span>
        </div>
        <div style={{ flex: 1, textAlign: "right" }}>
          {isLive && fixture.live && (
            <span style={{ fontSize: 15, fontWeight: 800, color: "var(--green)", marginRight: 8, fontFamily: "var(--font-display)" }}>
              {fixture.live.awayGoals}
            </span>
          )}
          <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
            {fixture.team2}
          </span>
        </div>
      </div>

      {/* Odds */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 12 }}>
        {[
          { label: "1", outcome: 1 as const },
          { label: "X", outcome: 2 as const },
          { label: "2", outcome: 3 as const },
        ].map(({ label, outcome }) => (
          <button
            key={label}
            type="button"
            onClick={(e) => { e.stopPropagation(); onBet?.(outcome); }}
            className="btn-outline"
            style={{ padding: "8px 0", fontSize: 12, fontWeight: 700, fontFamily: "var(--font-display)" }}
          >
            {label} {odds ? formatOdds(odds[outcome === 1 ? "home" : outcome === 2 ? "draw" : "away"]) : "-"}
          </button>
        ))}
      </div>

      {/* Sentiment bar */}
      {sentiment && (
        <div style={{ display: "flex", height: 4, borderRadius: 2, overflow: "hidden", marginBottom: 10 }}>
          <div style={{ flex: homePct, background: "linear-gradient(90deg, var(--green), var(--green-bright))" }} />
          <div style={{ flex: drawPct, background: "var(--text-dim)" }} />
          <div style={{ flex: awayPct, background: "linear-gradient(90deg, var(--blue), #6db3ff)" }} />
        </div>
      )}

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>
          {fixture.ground}
        </span>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggleCommunity?.(); }}
          className="btn-outline"
          style={{
            fontSize: 10, padding: "4px 10px",
            color: communityOpen ? "var(--green)" : undefined,
            borderColor: communityOpen ? "var(--green)" : undefined,
          }}
        >
          {communityOpen ? "Hide Community" : "Show Community"}
        </button>
      </div>
    </div>
  );
}

function formatOdds(value: bigint): string {
  if (value === 0n) return "-";
  return `$${(Number(value) / 1_000_000).toFixed(0)}`;
}
