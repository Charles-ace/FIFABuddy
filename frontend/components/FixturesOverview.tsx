"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { FixtureCard } from "@/components/FixtureCard";
import type { FootballFixture } from "@/lib/football";

type Props = {
  fixtures: FootballFixture[];
};

export function FixturesOverview({ fixtures }: Props) {
  const [activeFixtureId, setActiveFixtureId] = useState(fixtures[0]?.id ?? 0);

  const activeFixture = useMemo(
    () => fixtures.find((fixture) => fixture.id === activeFixtureId) ?? fixtures[0],
    [fixtures, activeFixtureId]
  );

  const liveCount = fixtures.filter((fixture) => fixture.status === "LIVE").length;
  const upcomingCount = fixtures.filter((fixture) => fixture.status === "UPCOMING").length;
  const finishedCount = fixtures.filter((fixture) => fixture.status === "FT").length;

  return (
    <main className="app-shell">
      <div className="page fixtures-page">
        <Header />

        <section className="fixtures-hero section">
          <div>
            <div className="market-strip">
              <span className="status-chip status-chip-strong">Complete fixtures</span>
              <span className="status-chip">{fixtures.length} total matches</span>
              <span className="status-chip">Mainnet dashboard</span>
            </div>
            <h2 className="fixtures-title">Browse the full match board.</h2>
            <p className="fixtures-copy">
              Scan every fixture, jump between matches, and open the dashboard whenever you want a
              compact trading view.
            </p>
          </div>

          <div className="fixtures-hero-actions">
            <Link href="/" className="btn btn-secondary">
              Back to dashboard
            </Link>
            <Link href="/" className="btn btn-primary">
              Trade on dashboard
            </Link>
          </div>
        </section>

        <section className="fixtures-summary-grid">
          <div className="stat-card">
            <p className="stat-label">Live</p>
            <p className="stat-value">{liveCount}</p>
            <p className="stat-note">Fixtures currently in play.</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Upcoming</p>
            <p className="stat-value">{upcomingCount}</p>
            <p className="stat-note">Matches still open for action.</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Finished</p>
            <p className="stat-value">{finishedCount}</p>
            <p className="stat-note">Resolved fixtures and results.</p>
          </div>
        </section>

        {activeFixture ? (
          <section className="section fixtures-detail">
            <div className="section-header">
              <div>
                <h3>Selected fixture</h3>
                <p>
                  {activeFixture.round} · {activeFixture.date} · {activeFixture.time}
                </p>
              </div>
              <span className={`status-pill status-pill-${activeFixture.status.toLowerCase()}`}>
                <span className="status-dot" />
                {activeFixture.status}
              </span>
            </div>

            <div className="fixture-players">
              <div className="team">
                <strong>{activeFixture.home}</strong>
                <span>{activeFixture.venue}</span>
              </div>
              <div className="score-box">
                <strong>
                  {activeFixture.score ? `${activeFixture.score[0]} - ${activeFixture.score[1]}` : "v"}
                </strong>
                <span>{activeFixture.status === "LIVE" ? "In play" : "Pre-match"}</span>
              </div>
              <div className="team team-away">
                <strong>{activeFixture.away}</strong>
                <span>Selected from full list</span>
              </div>
            </div>
          </section>
        ) : null}

        <section className="section fixtures-board">
          <div className="section-header">
            <div>
              <h3>All fixtures</h3>
              <p>Tap any match below to preview it in the panel above.</p>
            </div>
            <span className="slip-chip slip-chip-muted">Complete list</span>
          </div>

          <div className="fixture-grid fixture-grid-full">
            {fixtures.map((fixture) => (
              <FixtureCard
                key={fixture.id}
                fixture={fixture}
                active={activeFixture?.id === fixture.id}
                onSelect={() => setActiveFixtureId(fixture.id)}
                poolLabel={activeFixture?.id === fixture.id ? "Featured" : "48.2K USDT"}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
