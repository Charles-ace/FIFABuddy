"use client";

const leagues = [
  { name: "Premier League", code: "EPL", matches: 38, color: "var(--purple)", bg: "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(124,58,237,0.02))" },
  { name: "Champions League", code: "UCL", matches: 64, color: "var(--violet)", bg: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.02))" },
  { name: "La Liga", code: "LL", matches: 38, color: "var(--gold)", bg: "linear-gradient(135deg, rgba(245,200,66,0.1), rgba(245,200,66,0.02))" },
  { name: "Serie A", code: "SA", matches: 38, color: "var(--green)", bg: "linear-gradient(135deg, rgba(0,232,122,0.1), rgba(0,232,122,0.02))" },
  { name: "Bundesliga", code: "BL", matches: 34, color: "var(--blue)", bg: "linear-gradient(135deg, rgba(79,142,247,0.1), rgba(79,142,247,0.02))" },
  { name: "Ligue 1", code: "L1", matches: 38, color: "var(--red)", bg: "linear-gradient(135deg, rgba(255,77,109,0.1), rgba(255,77,109,0.02))" },
];

export function LeagueCards() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(6, 1fr)",
      gap: 10, marginBottom: 16,
    }}>
      {leagues.map((l, i) => (
        <div
          key={l.code}
          className="glass-card"
          style={{
            padding: "12px 14px",
            background: l.bg,
            cursor: "pointer",
            animation: `fadeUp 0.3s ease ${i * 0.04}s forwards`,
            opacity: 0,
            borderLeft: `2px solid ${l.color}`,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 800, color: l.color, fontFamily: "var(--font-display)", letterSpacing: "-0.5px", marginBottom: 2 }}>
            {l.code}
          </div>
          <div style={{ fontSize: 10, color: "var(--text-secondary)", fontFamily: "var(--font-display)", marginBottom: 4 }}>
            {l.name}
          </div>
          <div style={{ fontSize: 9, color: "var(--text-dim)" }}>
            {l.matches} matches
          </div>
        </div>
      ))}
    </div>
  );
}
