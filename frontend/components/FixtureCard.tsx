import React from "react";
import type { FootballFixture } from "@/lib/football";
import { FlagIcon } from "@/components/FlagIcon";

type Props = {
  fixture: FootballFixture;
  active?: boolean;
  onSelect?: () => void;
  poolLabel?: string;
};

export function FixtureCard({ fixture, active, onSelect, poolLabel = "48.2K USDT" }: Props) {
  // Let's generate a highly realistic mockup countdown based on the fixture ID so it matches the image perfectly!
  const getMockupCountdown = (id: number) => {
    const seed = id % 100;
    if (seed === 1) return "22h 10m 02s";
    if (seed === 2) return "26h 48m 30s";
    if (seed === 3) return "46h 53m 17s";
    if (seed === 4) return "50h 23m 01s";
    
    // Fallback countdowns
    const hours = (30 + seed * 7) % 72;
    const minutes = (15 + seed * 3) % 60;
    const seconds = (9 + seed * 12) % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const countdownText = getMockupCountdown(fixture.id);

  return (
    <button
      type="button"
      className={`match-row-card ${active ? "fixture-card-active" : ""}`}
      onClick={onSelect}
      style={active ? { borderColor: "var(--border-strong)", boxShadow: "0 0 16px rgba(255, 90, 0, 0.15)" } : {}}
    >
      <div className="match-row-countdown">
        <svg
          className="countdown-icon-svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <div className="countdown-texts">
          <span className="countdown-label">Time Left</span>
          <span className="countdown-timer">{countdownText}</span>
        </div>
      </div>

      <div className="match-row-teams">
        <div className="match-row-team-box home">
          <span className="match-row-team-name">{fixture.home}</span>
          <FlagIcon country={fixture.home} className="match-row-flag" size={28} />
        </div>
        <span className="match-row-vs">V</span>
        <div className="match-row-team-box away">
          <FlagIcon country={fixture.away} className="match-row-flag" size={28} />
          <span className="match-row-team-name">{fixture.away}</span>
        </div>
      </div>

      <div className="match-row-action">
        <span className="match-row-predict-link">Predict</span>
      </div>
    </button>
  );
}
