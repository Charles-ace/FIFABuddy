"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useAccount } from "wagmi";
import { Header } from "@/components/Header";
import { StatCards } from "@/components/StatCards";
import { FixtureCard } from "@/components/FixtureCard";
import { BetSlip } from "@/components/BetSlip";
import { CommunityPanel } from "@/components/CommunityPanel";
import { AgentInsights } from "@/components/AgentInsights";
import { CopyTrader } from "@/components/CopyTrader";
import { getMergedFixtures, type MergedFixture } from "@/lib/football";
import { useOdds } from "@/hooks/usePredictionMarket";

const INITIAL_SHOW = 5;

export default function Page() {
  const { isConnected } = useAccount();
  const [fixtures, setFixtures] = useState<MergedFixture[]>([]);
  const [selectedFixture, setSelectedFixture] = useState<MergedFixture | null>(null);
  const [betOutcome, setBetOutcome] = useState<1 | 2 | 3 | null>(null);
  const [showCommunity, setShowCommunity] = useState<Record<string, boolean>>({});
  const [showAllFixtures, setShowAllFixtures] = useState(false);
  const [loading, setLoading] = useState(true);

  const activeFixture = selectedFixture || fixtures[0];

  useEffect(() => {
    setLoading(true);
    getMergedFixtures()
      .then((data) => { setFixtures(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const { odds } = useOdds(activeFixture ? BigInt(activeFixture.date.replace(/-/g, "")) : 0n);
  const communityPosts = useMemo(() => [], []);

  const handleBet = (fixture: MergedFixture, outcome: 1 | 2 | 3) => {
    setSelectedFixture(fixture);
    setBetOutcome(outcome);
  };

  const handleAgentBet = (fixture: { team1: string; team2: string; date: string }, outcome: 1 | 2 | 3) => {
    const match = fixtures.find((f) => f.date === fixture.date && f.team1 === fixture.team1 && f.team2 === fixture.team2);
    if (match) handleBet(match, outcome);
  };

  const visibleFixtures = fixtures.slice(0, showAllFixtures ? undefined : INITIAL_SHOW);
  const hiddenCount = fixtures.length - INITIAL_SHOW;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Header />

      <main className="animate-fadeIn" style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 24px" }}>
        {/* ─── Hero ─── */}
        <section className="hero-section">
          <h1 className="hero-title gradient-text">FIFABuddy</h1>
          <p className="hero-subtitle">
            AI-powered World Cup 2026 predictions on X Layer.
            Stake, earn, and follow top analysts.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
            {["BUY", "HOLD", "AVOID"].map((s, i) => (
              <span
                key={s}
                style={{
                  padding: "4px 14px", borderRadius: 20,
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.5px",
                  background: s === "BUY" ? "var(--green-dim)" : s === "HOLD" ? "var(--gold-dim)" : "var(--red-dim)",
                  color: s === "BUY" ? "var(--green)" : s === "HOLD" ? "var(--gold)" : "var(--red)",
                  border: `1px solid ${s === "BUY" ? "var(--green)" : s === "HOLD" ? "var(--gold)" : "var(--red)"}`,
                  animation: `fadeInUp 0.4s ease ${0.1 + i * 0.1}s forwards`,
                  opacity: 0,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* ─── Ticker ─── */}
        <div className="ticker-wrap">
          <div className="ticker-track">
            {[...Array(2)].map((_, i) => (
              <div key={i} style={{ display: "inline-flex", gap: 48 }}>
                <span className="ticker-item"><span className="ticker-dot" style={{ background: "var(--green)" }} /> Brazil +3.2%</span>
                <span className="ticker-item"><span className="ticker-dot" style={{ background: "var(--blue)" }} /> France +1.8%</span>
                <span className="ticker-item"><span className="ticker-dot" style={{ background: "var(--green)" }} /> Argentina +4.1%</span>
                <span className="ticker-item"><span className="ticker-dot" style={{ background: "var(--gold)" }} /> Portugal +0.5%</span>
                <span className="ticker-item"><span className="ticker-dot" style={{ background: "var(--red)" }} /> Germany -1.2%</span>
                <span className="ticker-item"><span className="ticker-dot" style={{ background: "var(--blue)" }} /> Spain +2.4%</span>
                <span className="ticker-item"><span className="ticker-dot" style={{ background: "var(--green)" }} /> England +3.7%</span>
              </div>
            ))}
          </div>
        </div>

        <StatCards />

        {/* ─── Fixtures + Sidebar ─── */}
        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ flex: 1 }}>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 120, width: "100%" }} />
                ))}
              </div>
            ) : (
              <>
                {visibleFixtures.map((fixture, i) => (
                  <div
                    key={fixture.date + fixture.team1}
                    style={{
                      animation: `fadeInUp 0.4s ease ${i * 0.06}s forwards`,
                      opacity: 0,
                    }}
                  >
                    <FixtureCard
                      fixture={fixture}
                      active={activeFixture?.date === fixture.date && activeFixture?.team1 === fixture.team1}
                      onSelect={() => setSelectedFixture(fixture)}
                      onBet={(outcome) => handleBet(fixture, outcome)}
                      odds={odds}
                      onToggleCommunity={() => setShowCommunity((prev) => ({ ...prev, [fixture.date.replace(/-/g, "")]: !prev[fixture.date.replace(/-/g, "")] }))}
                      communityOpen={showCommunity[fixture.date.replace(/-/g, "")]}
                    />
                    {showCommunity[fixture.date.replace(/-/g, "")] && (
                      <CommunityPanel
                        matchId={BigInt(fixture.date.replace(/-/g, ""))}
                        posts={communityPosts}
                      />
                    )}
                  </div>
                ))}
                {hiddenCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowAllFixtures((prev) => !prev)}
                    className={`${showAllFixtures ? "" : "animate-glowPulse"}`}
                    style={{
                      width: "100%", padding: "14px 0", borderRadius: 10,
                      border: showAllFixtures ? "1px solid var(--border)" : "1px dashed var(--green)",
                      background: showAllFixtures ? "transparent" : "var(--green-dim)",
                      color: "var(--green)", fontSize: 13, fontWeight: 700,
                      cursor: "pointer", transition: "all 0.25s",
                      marginTop: 4,
                    }}
                    onMouseEnter={(e) => { if (!showAllFixtures) { e.currentTarget.style.background = "var(--green)"; e.currentTarget.style.color = "#080810"; } }}
                    onMouseLeave={(e) => { if (!showAllFixtures) { e.currentTarget.style.background = "var(--green-dim)"; e.currentTarget.style.color = "var(--green)"; } }}
                  >
                    {showAllFixtures ? "Show Less" : `See ${hiddenCount} More Matches`}
                  </button>
                )}
              </>
            )}
          </div>

          <div style={{ width: 380, flexShrink: 0 }}>
            <div style={{ position: "sticky", top: 20, display: "flex", flexDirection: "column", gap: 12 }}>
              {betOutcome && activeFixture && (
                <BetSlip
                  fixture={activeFixture}
                  outcome={betOutcome}
                  onBetPlaced={() => setBetOutcome(null)}
                  onClose={() => setBetOutcome(null)}
                />
              )}
              <AgentInsights
                fixture={activeFixture || { team1: "", team2: "", date: "" }}
                poolOdds={odds}
                onBet={handleAgentBet}
              />
              <CopyTrader />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
