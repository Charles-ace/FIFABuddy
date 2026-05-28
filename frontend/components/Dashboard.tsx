"use client";

import { useMemo, useState, useEffect } from "react";
import { formatUnits } from "viem";
import { FixtureCard } from "@/components/FixtureCard";
import { BetSlip } from "@/components/BetSlip";
import { AnalystRow } from "@/components/AnalystRow";
import { AgentInsights } from "@/components/AgentInsights";
import { Header } from "@/components/Header";
import { FlagIcon } from "@/components/FlagIcon";
import { analysts, communityPosts as mockPosts } from "@/lib/mockData";
import type { FootballFixture } from "@/lib/football";
import { useOdds } from "@/hooks/usePredictionMarket";

type Props = {
  fixtures: FootballFixture[];
};

type AgentSignal = {
  signal: "BUY" | "HOLD" | "AVOID";
  pick: string;
  confidence: number;
  reasoning: string;
};

type CopyTradeRequest = {
  id: number;
  amount: string;
  outcome: number;
  pickLabel: string;
  source: "agent";
};

export function Dashboard({ fixtures: initialFixtures }: Props) {
  const [fixtures, setFixtures] = useState(initialFixtures);
  const [activeFixtureId, setActiveFixtureId] = useState(initialFixtures[0]?.id ?? 0);
  const [isMarketRefreshing, setIsMarketRefreshing] = useState(false);
  const [marketRefreshToken, setMarketRefreshToken] = useState(0);
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [copyTradeRequest, setCopyTradeRequest] = useState<CopyTradeRequest | null>(null);

  const activeFixture = useMemo(
    () => fixtures.find((fixture) => fixture.id === activeFixtureId) ?? fixtures[0],
    [fixtures, activeFixtureId]
  );

  const { odds, refetch: refetchOdds } = useOdds(BigInt(activeFixture?.id ?? 0));

  const totalPoolWei = odds.home + odds.draw + odds.away;
  const totalPoolUsdt = parseFloat(formatUnits(totalPoolWei, 6));

  useEffect(() => {
    refetchOdds();
  }, [activeFixtureId, refetchOdds]);

  useEffect(() => {
    if (copyTradeRequest && copyTradeRequest.id !== activeFixture.id) {
      setCopyTradeRequest(null);
    }
  }, [activeFixture.id, copyTradeRequest]);

  const handleBetSlipSuccess = () => {
    void refetchOdds();
    setMarketRefreshToken((current) => current + 1);
    setCopyTradeRequest(null);
  };

  const handleAgentExecuteSignal = (signal: AgentSignal) => {
    const normalizedPick = signal.pick.toLowerCase();
    const outcome = normalizedPick.includes("draw")
      ? 2
      : normalizedPick.includes(activeFixture.home.toLowerCase())
        ? 1
        : normalizedPick.includes(activeFixture.away.toLowerCase())
          ? 3
          : 1;

    setCopyTradeRequest({
      id: activeFixture.id,
      amount: signal.confidence >= 90 ? "50" : signal.confidence >= 80 ? "35" : "25",
      outcome,
      pickLabel: signal.pick,
      source: "agent",
    });
  };

  const activeMockPosts = mockPosts
    .filter(
      (p) =>
        p.match.toLowerCase().includes(activeFixture.home.toLowerCase()) ||
        p.match.toLowerCase().includes(activeFixture.away.toLowerCase())
    )
    .map((p) => ({
      author: p.author,
      text: p.text,
      pick: p.pick,
      upvotes: p.votes.toString(),
    }));

  const communityUpvotes = activeMockPosts.reduce(
    (sum, post) => sum + Number(post.upvotes || 0),
    128
  );

  const visibleFixtures = fixtures.slice(0, 5);

  const formatPoolLabel = (val: number) => {
    if (val > 1000) return (val / 1000).toFixed(1) + "K";
    return val.toString();
  };

  return (
    <main className="app-shell colorful-theme">
      <div className="page">
        <Header />

        <section className="hero colorful-hero">
          <div className="hero-backdrop" style={{ backgroundImage: "url('/vibrant_stadium.png')" }}>
            <div className="hero-overlay"></div>
            <div className="hero-motion-layer" aria-hidden="true">
              <span className="motion-pitch motion-pitch-one" />
              <span className="motion-pitch motion-pitch-two" />
              <span className="motion-ball" />
              <span className="motion-trail motion-trail-one" />
              <span className="motion-trail motion-trail-two" />
              <span className="motion-ticker motion-ticker-one">AI FORM +12%</span>
              <span className="motion-ticker motion-ticker-two">POOL SHIFT</span>
            </div>
          </div>
          
          <div className="hero-content-wrapper">
            <div className="hero-main">
              <div className="market-strip">
                <span className="status-chip status-chip-strong">
                  <span className="status-dot status-dot-pulse" />
                  Mainnet live
                </span>
                <span className="status-chip">Smart Wallets Tracked</span>
              </div>

              <h2>Experience the beautiful game on-chain.</h2>
              <p>
                Track vibrant fixtures, follow the smartest on-chain wallets, and make your picks with our dynamic AI agent predicting the market.
              </p>

              <div className="hero-actions">
                <button className="btn btn-secondary" type="button" onClick={() => setIsMarketRefreshing(!isMarketRefreshing)}>
                  {isMarketRefreshing ? "Refreshing..." : "Refresh Market"}
                </button>
              </div>
            </div>

            <div className="hero-stats colorful-stats">
              <div className="stat-card">
                <p className="stat-label">Selected match</p>
                <div className="stat-match-teams">
                  <FlagIcon country={activeFixture.home} size={20} className="flag" />
                  <span>{activeFixture.home} vs {activeFixture.away}</span>
                  <FlagIcon country={activeFixture.away} size={20} className="flag" />
                </div>
                <p className="stat-note">
                  {activeFixture.date} · {activeFixture.time}
                </p>
              </div>

              <div className="stat-grid">
                <div className="kpi-card">
                  <strong>{communityUpvotes}</strong>
                  <span>upvotes</span>
                </div>
                <div className="kpi-card">
                  <strong>{analysts.length}</strong>
                  <span>analysts</span>
                </div>
                <div className="kpi-card">
                  <strong>87%</strong>
                  <span>agent conf</span>
                </div>
                <div className="kpi-card">
                  <strong>{totalPoolUsdt > 0 ? formatPoolLabel(totalPoolUsdt) : "48.2K"}</strong>
                  <span>pool USDT</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid main-grid">
          <div className="stack">
            <section className="section fixtures-section">
              <div className="section-header">
                <div>
                  <h3 className="vibrant-title">Upcoming Fixtures</h3>
                  <p>Select a match to update the dynamic prediction panels.</p>
                </div>
              </div>

              <div className="fixture-grid">
                {visibleFixtures.map((fixture) => (
                  <FixtureCard
                    key={fixture.id}
                    fixture={fixture}
                    active={activeFixture?.id === fixture.id}
                    onSelect={() => setActiveFixtureId(fixture.id)}
                    poolLabel={activeFixture?.id === fixture.id ? (totalPoolUsdt > 0 ? formatPoolLabel(totalPoolUsdt) : "48.2K") : "48.2K"}
                  />
                ))}
              </div>
            </section>
          </div>

          <aside className="side-panel">
            <BetSlip
              fixture={activeFixture}
              onBetPlaced={handleBetSlipSuccess}
              copyTradeRequest={copyTradeRequest}
            />

            <AgentInsights
              fixture={activeFixture}
              poolOdds={odds}
              communityPosts={activeMockPosts}
              topAnalysts={analysts}
              isAutoMode={isAutoMode}
              refreshToken={marketRefreshToken}
              onExecuteSignal={handleAgentExecuteSignal}
            />

            <div className="section colorful-section">
              <div className="section-header">
                <div>
                  <h3 className="vibrant-title">Top Analysts</h3>
                  <p>Smart money wallets we track.</p>
                </div>
                <span className="slip-chip">Tracking</span>
              </div>

              <div className="analyst-list">
                {analysts.map((analyst) => (
                  <AnalystRow key={analyst.wallet} analyst={analyst} />
                ))}
              </div>

              <div className="auto-mode-row" style={{ marginTop: "16px", paddingTop: "12px" }}>
                <span className={isAutoMode ? "auto-mode-label active" : "auto-mode-label"}>
                  {isAutoMode ? "Auto Agent Enabled" : "Manual Mode"}
                </span>
                <button
                  type="button"
                  className="ghost-sm"
                  onClick={() => setIsAutoMode(!isAutoMode)}
                >
                  Toggle
                </button>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
