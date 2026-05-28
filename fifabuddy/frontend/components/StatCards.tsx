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

export function StatCards() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 12,
      marginBottom: 20,
    }}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="card-enter card-hover"
          style={{
            padding: "16px 18px",
            borderRadius: 12,
            background: "var(--card)",
            border: "1px solid var(--border)",
            position: "relative", overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 3,
            background: accentColors[stat.accent],
          }} />
          <p style={{
            margin: 0, fontSize: 12, color: "var(--muted)",
            fontWeight: 500, marginBottom: 6,
          }}>
            {stat.label}
          </p>
          <p style={{
            margin: 0, fontSize: 22, fontWeight: 700,
            color: accentColors[stat.accent],
          }}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
