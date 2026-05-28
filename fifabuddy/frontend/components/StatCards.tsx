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

const accentColors = {
  green: "var(--green)",
  gold: "var(--gold)",
  blue: "var(--blue)",
  red: "var(--red)",
};

const accentGradients = {
  green: "linear-gradient(135deg, var(--green), #00ff88)",
  gold: "linear-gradient(135deg, var(--gold), #ffd700)",
  blue: "linear-gradient(135deg, var(--blue), #6db3ff)",
  red: "linear-gradient(135deg, var(--red), #ff6b8a)",
};

export function StatCards() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 12,
      marginBottom: 24,
    }}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="card-enter card-hover"
          style={{
            padding: "18px 20px",
            borderRadius: 12,
            background: "var(--card)",
            border: "1px solid var(--border)",
            position: "relative", overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 3,
            background: accentGradients[stat.accent],
            backgroundSize: "200% 100%",
            animation: "gradientShift 3s ease infinite",
          }} />
          <p style={{
            margin: "0 0 8px", fontSize: 12, color: "var(--muted)",
            fontWeight: 500, letterSpacing: "0.3px",
          }}>
            {stat.label}
          </p>
          <p className={`animate-glowPulse`} style={{
            margin: 0, fontSize: 24, fontWeight: 800,
            background: accentGradients[stat.accent],
            backgroundSize: "200% 200%",
            animation: "gradientShift 4s ease infinite, glowPulse 2s ease-in-out infinite",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
