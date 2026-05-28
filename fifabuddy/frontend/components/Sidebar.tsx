"use client";

import { useState } from "react";
import { Logo } from "@/components/Logo";

const mainNav = [
  { label: "Dashboard", icon: "◈" },
  { label: "Live Matches", icon: "●" },
  { label: "Upcoming", icon: "◇" },
  { label: "AI Predictions", icon: "◆" },
  { label: "Odds Tracker", icon: "◎" },
  { label: "Statistics", icon: "▣" },
  { label: "Leaderboard", icon: "▲" },
  { label: "Watchlist", icon: "★" },
];

const leagues = [
  { label: "Premier League", color: "var(--purple)" },
  { label: "Champions League", color: "var(--violet)" },
  { label: "La Liga", color: "var(--gold)" },
  { label: "Serie A", color: "var(--green)" },
  { label: "Bundesliga", color: "var(--blue)" },
  { label: "Ligue 1", color: "var(--red)" },
];

export function Sidebar() {
  const [active, setActive] = useState("Live Matches");

  return (
    <aside className="sidebar" style={{ padding: "16px 0", display: "flex", flexDirection: "column" }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 14px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
        <Logo size={28} />
        <span className="gradient-text" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, letterSpacing: "-0.3px" }}>
          FIFABuddy
        </span>
      </div>

      {/* Main Nav */}
      <div style={{ padding: "8px 0", flex: 1, overflowY: "auto" }}>
        {mainNav.map((item) => (
          <div
            key={item.label}
            className={`nav-item ${active === item.label ? "active" : ""}`}
            onClick={() => setActive(item.label)}
          >
            <span style={{ fontSize: 10, opacity: 0.7 }}>{item.icon}</span>
            {item.label}
          </div>
        ))}

        {/* Leagues */}
        <div className="nav-section">Leagues</div>
        {leagues.map((l) => (
          <div key={l.label} className="nav-item">
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: l.color, display: "inline-block",
            }} />
            {l.label}
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div style={{ padding: "12px 14px", borderTop: "1px solid var(--border-subtle)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <div style={{
            width: 24, height: 24, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--purple), var(--violet))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 700, color: "#fff",
          }}>
            U
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-display)" }}>
              User
            </div>
            <div style={{ fontSize: 9, color: "var(--text-muted)" }}>
              Free Plan
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
