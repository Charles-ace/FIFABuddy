"use client";

import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer style={{
      marginTop: 60,
      borderTop: "1px solid var(--border-subtle)",
      background: "rgba(6,6,14,0.6)",
      backdropFilter: "blur(20px)",
    }}>
      <div className="container" style={{ padding: "40px 24px 24px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 40,
          marginBottom: 32,
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <Logo size={28} />
              <span className="gradient-text" style={{
                fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16,
              }}>
                FIFABuddy
              </span>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 280 }}>
              AI-powered football prediction terminal. Real-time analytics, smart insights, and community-driven predictions on X Layer.
            </p>
          </div>

          {[
            { title: "Platform", links: ["Predictions", "Live Matches", "Leaderboard", "Analytics"] },
            { title: "Resources", links: ["Documentation", "API", "Blog", "FAQ"] },
            { title: "Connect", links: ["Twitter", "Discord", "GitHub", "Email"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 style={{
                fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 700,
                color: "var(--green)", marginBottom: 12, letterSpacing: "0.5px",
              }}>
                {col.title}
              </h4>
              {col.links.map((link) => (
                <div key={link} style={{
                  fontSize: 12, color: "var(--text-muted)", marginBottom: 8,
                  cursor: "pointer", transition: "color 0.2s",
                }}>
                  {link}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{
          borderTop: "1px solid var(--border-subtle)",
          paddingTop: 16,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 12,
        }}>
          <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
            &copy; 2026 FIFABuddy. All rights reserved.
          </span>
          <div style={{ display: "flex", gap: 16 }}>
            {["TW", "DC", "GH"].map((s) => (
              <span key={s} style={{
                fontSize: 10, fontWeight: 700, color: "var(--text-muted)",
                cursor: "pointer", transition: "color 0.2s",
                fontFamily: "var(--font-display)",
              }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
