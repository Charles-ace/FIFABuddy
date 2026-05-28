"use client";

import type { MergedFixture } from "@/lib/football";

type Props = {
  fixtures: MergedFixture[];
  odds?: { home: bigint; draw: bigint; away: bigint };
  onSelect?: (fixture: MergedFixture) => void;
  onBet?: (fixture: MergedFixture, outcome: 1 | 2 | 3) => void;
};

export function MatchTable({ fixtures, odds, onSelect, onBet }: Props) {
  if (fixtures.length === 0) {
    return (
      <div className="glass-card" style={{ padding: 24, textAlign: "center" }}>
        <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>
          No matches available
        </span>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ overflow: "hidden" }}>
      {/* Header */}
      <div className="table-row" style={{
        gridTemplateColumns: "80px 1fr 60px 80px 80px 80px 60px",
        background: "rgba(255,255,255,0.02)",
        cursor: "default", fontSize: 10, color: "var(--text-dim)",
        fontWeight: 600, fontFamily: "var(--font-display)",
        letterSpacing: "0.5px", textTransform: "uppercase",
      }}>
        <div>Time</div><div>Match</div><div style={{ textAlign: "center" }}>Score</div>
        <div style={{ textAlign: "center" }}>1</div><div style={{ textAlign: "center" }}>X</div>
        <div style={{ textAlign: "center" }}>2</div><div style={{ textAlign: "center" }}>AI</div>
      </div>

      {/* Rows */}
      {fixtures.slice(0, 8).map((fixture, i) => {
        const homeOdd = odds ? (Number(odds.home) / 1_000_000).toFixed(0) : "-";
        const drawOdd = odds ? (Number(odds.draw) / 1_000_000).toFixed(0) : "-";
        const awayOdd = odds ? (Number(odds.away) / 1_000_000).toFixed(0) : "-";

        return (
          <div
            key={fixture.date + fixture.team1}
            className="table-row"
            style={{
              gridTemplateColumns: "80px 1fr 60px 80px 80px 80px 60px",
              animation: `fadeUp 0.3s ease ${i * 0.03}s forwards`,
              opacity: 0,
            }}
            onClick={() => onSelect?.(fixture)}
          >
            {/* Time */}
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
              {fixture.live ? (
                <span className="live-badge" style={{ fontSize: 8 }}>
                  {fixture.live.minute}'
                </span>
              ) : (
                fixture.time?.slice(0, 5) || "--:--"
              )}
            </div>

            {/* Teams */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: 2 }}>
                {fixture.team1}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-display)" }}>
                {fixture.team2}
              </div>
            </div>

            {/* Score */}
            <div style={{ textAlign: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text)" }}>
              {fixture.live ? `${fixture.live.homeGoals}-${fixture.live.awayGoals}` : "-"}
            </div>

            {/* Odds */}
            {[homeOdd, drawOdd, awayOdd].map((odd, j) => (
              <div
                key={j}
                style={{ textAlign: "center" }}
                onClick={(e) => { e.stopPropagation(); onBet?.(fixture, [1, 2, 3][j] as 1 | 2 | 3); }}
              >
                <span style={{
                  display: "inline-block", padding: "3px 8px", borderRadius: 4,
                  fontSize: 11, fontWeight: 700, fontFamily: "var(--font-display)",
                  color: "var(--text)", cursor: "pointer",
                  transition: "all 0.15s",
                  background: "rgba(255,255,255,0.03)",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--purple-dim)"; e.currentTarget.style.color = "var(--violet-bright)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "var(--text)"; }}
                >
                  {odd === "-" ? "-" : `$${odd}`}
                </span>
              </div>
            ))}

            {/* AI */}
            <div style={{ textAlign: "center" }}>
              <span className="anim-green" style={{
                display: "inline-block", padding: "2px 6px", borderRadius: 3,
                fontSize: 10, fontWeight: 700, fontFamily: "var(--font-display)",
                background: "var(--green-dim)", color: "var(--green)",
              }}>
                {(55 + (i * 7) % 35)}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
