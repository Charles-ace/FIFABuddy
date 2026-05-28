"use client";

const leagues = [
  { name: "Premier League", code: "PL", color: "var(--green)" },
  { name: "Champions League", code: "UCL", color: "var(--blue)" },
  { name: "La Liga", code: "LL", color: "var(--gold)" },
  { name: "Serie A", code: "SA", color: "var(--red)" },
  { name: "Bundesliga", code: "BL", color: "var(--teal)" },
  { name: "World Cup", code: "WC", color: "var(--green-bright)" },
  { name: "MLS", code: "MLS", color: "var(--blue)" },
];

export function FeaturedLeagues() {
  return (
    <div style={{
      display: "flex", gap: 8, flexWrap: "wrap",
      justifyContent: "center", marginBottom: 28,
    }}>
      {leagues.map((l, i) => (
        <div
          key={l.code}
          className="glass-card"
          style={{
            padding: "10px 18px",
            display: "flex", alignItems: "center", gap: 8,
            cursor: "pointer",
            animation: `fadeUp 0.4s ease ${0.05 + i * 0.04}s forwards`,
            opacity: 0,
          }}
        >
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: l.color,
            boxShadow: `0 0 8px ${l.color}40`,
          }} />
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: 12, fontWeight: 600, color: "var(--text-primary)",
          }}>
            {l.name}
          </span>
          <span style={{
            fontSize: 10, fontWeight: 700, color: l.color,
            fontFamily: "var(--font-display)",
          }}>
            {l.code}
          </span>
        </div>
      ))}
    </div>
  );
}
