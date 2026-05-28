"use client";

import { useState } from "react";
import type { MergedFixture } from "@/lib/football";

type Props = {
  fixture: MergedFixture;
  active?: boolean;
  onSelect?: () => void;
  onBet?: (outcome: 1 | 2 | 3) => void;
  odds?: { home: bigint; draw: bigint; away: bigint };
  sentiment?: { home: number; draw: number; away: number };
  onToggleCommunity?: () => void;
  communityOpen?: boolean;
};

export function FixtureCard({
  fixture, active, onSelect, onBet,
  odds, sentiment, onToggleCommunity, communityOpen,
}: Props) {
  const total = sentiment
    ? sentiment.home + sentiment.draw + sentiment.away
    : 1;
  const homePct = sentiment ? (sentiment.home / total) * 100 : 33;
  const drawPct = sentiment ? (sentiment.draw / total) * 100 : 33;
  const awayPct = sentiment ? (sentiment.away / total) * 100 : 33;

  const isLive = fixture.live?.status === "LIVE" || fixture.live?.status === "1H" || fixture.live?.status === "2H";

  return (
    <div
      className={`card-enter card-hover ${active ? "animate-glowPulse gradient-border" : ""}`}
      style={{
        padding: 16,
        borderRadius: 12,
        background: "var(--card)",
        border: active ? "1px solid transparent" : "1px solid var(--border)",
        marginBottom: 12,
        transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
      }}
      onClick={onSelect}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="gradient-text-green" style={{ fontSize: 13, fontWeight: 700 }}>
            {fixture.round}
          </span>
          {isLive && (
            <span className="live-badge">
              LIVE {fixture.live?.minute}'
            </span>
          )}
        </div>
        <span style={{ fontSize: 12, color: "var(--muted)" }}>
          {fixture.date} {fixture.time}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ flex: 1, textAlign: "left" }}>
          <strong style={{ fontSize: 15, color: "var(--text)" }}>{fixture.team1}</strong>
          {isLive && fixture.live && (
            <span style={{ fontSize: 15, fontWeight: 700, color: "var(--green)", marginLeft: 8 }}>
              {fixture.live.homeGoals}
            </span>
          )}
        </div>
        <div style={{ padding: "0 16px" }}>
          <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>VS</span>
        </div>
        <div style={{ flex: 1, textAlign: "right" }}>
          {isLive && fixture.live && (
            <span style={{ fontSize: 15, fontWeight: 700, color: "var(--green)", marginRight: 8 }}>
              {fixture.live.awayGoals}
            </span>
          )}
          <strong style={{ fontSize: 15, color: "var(--text)" }}>{fixture.team2}</strong>
        </div>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6,
        marginBottom: 12,
      }}>
        {[
          { label: "1", outcome: 1 as const },
          { label: "X", outcome: 2 as const },
          { label: "2", outcome: 3 as const },
        ].map(({ label, outcome }) => (
          <button
            key={label}
            type="button"
            onClick={(e) => { e.stopPropagation(); onBet?.(outcome); }}
            className="btn-outline"
            style={{
              padding: "8px 0", fontSize: 13, fontWeight: 700,
              transition: "all 0.2s",
            }}
          >
            {label} {odds ? `${formatOdds(odds[outcome === 1 ? "home" : outcome === 2 ? "draw" : "away"])}` : "-"}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", height: 6, borderRadius: 3, overflow: "hidden", marginBottom: 8 }}>
        <div style={{ flex: homePct, background: "linear-gradient(135deg, var(--green), #00ff88)" }} />
        <div style={{ flex: drawPct, background: "var(--muted-light)" }} />
        <div style={{ flex: awayPct, background: "linear-gradient(135deg, var(--blue), #6db3ff)" }} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "var(--muted)" }}>
          {fixture.ground}
        </span>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggleCommunity?.(); }}
          className="btn-outline"
          style={{
            fontSize: 11, padding: "4px 10px",
            color: communityOpen ? "var(--green)" : undefined,
            borderColor: communityOpen ? "var(--green)" : undefined,
          }}
        >
          {communityOpen ? "Hide Community" : "Show Community"}
        </button>
      </div>
    </div>
  );
}

function formatOdds(value: bigint): string {
  if (value === 0n) return "-";
  const n = Number(value) / 1_000_000;
  return `$${n.toFixed(0)}`;
}
