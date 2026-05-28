"use client";

import { useState, useEffect, useMemo } from "react";
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

export default function Page() {
  const { isConnected } = useAccount();
  const [fixtures, setFixtures] = useState<MergedFixture[]>([]);
  const [selectedFixture, setSelectedFixture] = useState<MergedFixture | null>(null);
  const [betOutcome, setBetOutcome] = useState<1 | 2 | 3 | null>(null);
  const [showCommunity, setShowCommunity] = useState<Record<string, boolean>>({});
  const [showAllFixtures, setShowAllFixtures] = useState(false);
  const INITIAL_SHOW = 5;

  const activeFixture = selectedFixture || fixtures[0];

  useEffect(() => {
    getMergedFixtures().then(setFixtures).catch(console.error);
  }, []);

  const { odds } = useOdds(activeFixture ? BigInt(activeFixture.date.replace(/-/g, "")) : 0n);

  const communityPosts = useMemo(() => [], []);

  const handleBet = (fixture: MergedFixture, outcome: 1 | 2 | 3) => {
    setSelectedFixture(fixture);
    setBetOutcome(outcome);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Header />

      <main className="animate-fadeIn" style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 24px" }}>
        <StatCards />

        <div className="animate-fadeInUp" style={{ display: "flex", gap: 20 }}>
          <div style={{ flex: 1 }}>
            {fixtures.slice(0, showAllFixtures ? undefined : INITIAL_SHOW).map((fixture) => (
              <div key={fixture.date + fixture.team1}>
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
            {fixtures.length > INITIAL_SHOW && (
              <button
                type="button"
                onClick={() => setShowAllFixtures((prev) => !prev)}
                style={{
                  width: "100%", padding: "12px 0", borderRadius: 10,
                  border: "1px dashed var(--border)", background: "transparent",
                  color: "var(--muted-light)", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.2s",
                  marginTop: 4,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--green)"; e.currentTarget.style.color = "var(--green)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted-light)"; }}
              >
                {showAllFixtures ? "Show Less" : `See ${fixtures.length - INITIAL_SHOW} More Matches`}
              </button>
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
              />
              <CopyTrader />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
