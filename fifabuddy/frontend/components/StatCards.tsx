"use client";

type Stat = {
  label: string;
  value: string;
  accent: "green" | "gold" | "blue" | "red";
};

const stats: Stat[] = [
  { label: "Portfolio Value", value: "$1,284.50", accent: "green" },
  { label: "Active Bets", value: "3", accent: "gold" },
  { label: "Win Rate", value: "68%", accent: "blue" },
  { label: "Markets Open", value: "12", accent: "red" },
];

const accents = {
  green: { grad: "linear-gradient(135deg, var(--green), var(--green-bright))", shadow: "rgba(0,232,122,0.15)" },
  gold:  { grad: "linear-gradient(135deg, var(--gold), #ffd700)", shadow: "rgba(245,200,66,0.15)" },
  blue:  { grad: "linear-gradient(135deg, var(--blue), #6db3ff)", shadow: "rgba(79,142,247,0.15)" },
  red:   { grad: "linear-gradient(135deg, var(--red), #ff6b8a)", shadow: "rgba(255,77,109,0.15)" },
};

export function StatCards() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 12,
      marginBottom: 28,
    }}>
      {stats.map((stat, i) => {
        const a = accents[stat.accent];
        return (
          <div
            key={stat.label}
            className="glass-card"
            style={{
              padding: "18px 20px",
              position: "relative", overflow: "hidden",
              animation: `fadeUp 0.4s ease ${0.05 + i * 0.06}s forwards`,
              opacity: 0,
            }}
          >
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 3,
              background: a.grad,
            }} />
            <p style={{
              margin: "0 0 8px", fontSize: 11, color: "var(--text-muted)",
              fontWeight: 500, letterSpacing: "0.5px",
              fontFamily: "var(--font-display)",
            }}>
              {stat.label}
            </p>
            <p style={{
              margin: 0, fontSize: 24, fontWeight: 800,
              fontFamily: "var(--font-display)",
              background: a.grad,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
