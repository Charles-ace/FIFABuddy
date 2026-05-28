"use client";

const hotMatches = [
  { team1: "Brazil", team2: "Argentina", score: "2-1", minute: 72, ai: 87 },
  { team1: "France", team2: "Germany", score: "1-1", minute: 58, ai: 74 },
  { team1: "England", team2: "Spain", score: "0-0", minute: 34, ai: 65 },
];

const headlines = [
  "Brazil's attacking form hits peak ahead of knockout stage",
  "AI predicts 72% chance of upset in France vs Germany clash",
  "Three top analysts back England to advance to quarter-finals",
];

export function RightPanel() {
  return (
    <aside className="right-panel" style={{ padding: "52px 12px 12px" }}>
      {/* AI Insights */}
      <div style={{ marginBottom: 16 }}>
        <div className="section-label">AI Insights</div>
        <div className="glass-card" style={{ padding: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <span className="anim-liveDot" style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--purple)", display: "inline-block" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--violet-bright)", fontFamily: "var(--font-display)" }}>
              Live Analysis
            </span>
          </div>
          <p style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
            Brazil-Argentina shows strong home bias. Pool concentration suggests smart money on the home side.
          </p>
          <div style={{ marginTop: 8, padding: "6px 8px", borderRadius: 6, background: "var(--green-dim)" }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--green)", fontFamily: "var(--font-display)" }}>
              Signal: BUY Brazil
            </span>
          </div>
        </div>
      </div>

      {/* Hot Matches */}
      <div style={{ marginBottom: 16 }}>
        <div className="section-label">Hot Matches</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {hotMatches.map((m, i) => (
            <div key={i} className="glass-card" style={{
              padding: "8px 10px",
              animation: `fadeUp 0.3s ease ${i * 0.05}s forwards`,
              opacity: 0,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-display)" }}>
                  {m.team1} vs {m.team2}
                </span>
                <span className="live-badge" style={{ fontSize: 8 }}>{m.minute}'</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)" }}>
                  {m.score}
                </span>
                <span style={{
                  padding: "1px 6px", borderRadius: 3, fontSize: 9,
                  fontWeight: 700, background: "var(--purple-dim)",
                  color: "var(--violet-bright)", fontFamily: "var(--font-display)",
                }}>
                  AI {m.ai}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* News */}
      <div>
        <div className="section-label">News</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {headlines.map((h, i) => (
            <div key={i} className="glass-card" style={{
              padding: "8px 10px",
              animation: `fadeUp 0.3s ease ${i * 0.06}s forwards`,
              opacity: 0,
            }}>
              <p style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.4, margin: 0 }}>
                {h}
              </p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
