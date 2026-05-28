"use client";

const predictors = [
  { rank: 1, name: "GoalPredator", winRate: 82, bets: 47, roi: "+34.5%" },
  { rank: 2, name: "MatchMindPro", winRate: 76, bets: 63, roi: "+28.2%" },
  { rank: 3, name: "WCOracle", winRate: 79, bets: 38, roi: "+31.8%" },
  { rank: 4, name: "BetSage", winRate: 71, bets: 52, roi: "+22.4%" },
  { rank: 5, name: "FootyAnalyst", winRate: 68, bets: 44, roi: "+19.7%" },
];

export function LeaderboardPreview() {
  return (
    <div className="glass-strong" style={{ padding: 24, borderRadius: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div className="section-label">Leaderboard</div>
          <h3 style={{
            fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700,
            color: "var(--text-primary)", marginTop: 4,
          }}>
            Top Predictors
          </h3>
        </div>
        <button className="btn-outline" style={{ padding: "6px 14px", fontSize: 11 }}>
          View All
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {predictors.map((p, i) => (
          <div
            key={p.name}
            className="glass-card"
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 14px",
              animation: `fadeUp 0.3s ease ${i * 0.04}s forwards`,
              opacity: 0,
            }}
          >
            <span style={{
              fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 800,
              color: p.rank <= 3 ? "var(--gold)" : "var(--text-muted)",
              width: 24, textAlign: "center",
            }}>
              {p.rank}
            </span>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: `linear-gradient(135deg, ${p.rank <= 3 ? "var(--gold)" : "var(--green)"}, ${p.rank <= 3 ? "#d4a832" : "var(--emerald)"})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: "#06060e",
              fontFamily: "var(--font-display)",
            }}>
              {p.name[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                {p.name}
              </div>
              <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                {p.bets} bets
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{
                fontSize: 13, fontWeight: 700,
                color: "var(--green)", fontFamily: "var(--font-display)",
              }}>
                {p.winRate}%
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: "var(--gold)" }}>
                {p.roi}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
