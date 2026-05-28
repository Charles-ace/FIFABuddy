"use client";

import { useMemo, useState, useEffect, useRef } from "react";
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
  
  // Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Sidebar tab on Hero panel (Upcoming vs Results)
  const [heroSidebarTab, setHeroSidebarTab] = useState<"upcoming" | "results">("upcoming");
  
  // Search query in Choose Match section
  const [searchQuery, setSearchQuery] = useState("");
  
  // Choose match stage filter
  const [selectedStage, setSelectedStage] = useState("Quarter finals");



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

  if (!activeFixture) {
    return (
      <main className="app-shell">
        <div className="page">
          <div className="section" style={{ textAlign: "center", padding: "40px" }}>
            <h3>No fixtures available</h3>
            <p>OpenFootball returned an empty schedule. Try refreshing the page in a moment.</p>
          </div>
        </div>
      </main>
    );
  }

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

    // Automatically slide drawer open so the user sees the copy-trade execution state in the slip!
    setIsDrawerOpen(true);
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

  // Open drawer helper
  const openCopilotCockpit = (fixtureId: number) => {
    setActiveFixtureId(fixtureId);
    setIsDrawerOpen(true);
  };

  // Filtered fixtures based on search in the choose match grid
  const filteredFixtures = useMemo(() => {
    return fixtures.filter((f) => {
      const homeMatch = f.home.toLowerCase().includes(searchQuery.toLowerCase());
      const awayMatch = f.away.toLowerCase().includes(searchQuery.toLowerCase());
      return homeMatch || awayMatch;
    });
  }, [fixtures, searchQuery]);

  // Handle hero orange arrow click to scroll down to match selection
  const handleScrollToMatches = () => {
    const element = document.getElementById("choose-match-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Simulated list of results for the mockup hero right sidebar tab
  const mockupResults = [
    { home: "Japan", away: "Croatia", score: "1 (1) - 1 (3)", desc: "5 Dec, 16:00 · Round of 16" },
    { home: "Brazil", away: "South Korea", score: "4 - 1", desc: "5 Dec, 20:00 · Round of 16" },
    { home: "Morocco", away: "Spain", score: "0 (3) - 0 (0)", desc: "6 Dec, 16:00 · Round of 16" },
    { home: "Portugal", away: "Switzerland", score: "6 - 1", desc: "6 Dec, 20:00 · Round of 16" }
  ];

  return (
    <main className="app-shell">
      <div className="page">
        <Header />

        {/* —— TOP HERO LAYOUT BANNER —— */}
        <section className="hero-layout">
          {/* Featured Mbappe card */}
          <div
            className="hero-featured-card"
            style={{ backgroundImage: `url('/mbappe_hero.png')` }}
          >
            <div className="hero-featured-content">
              <div className="next-match-badge">
                Next Match · <span style={{ color: "var(--accent)" }}>ENG</span> v FRA
              </div>
              <h2 className="featured-headline">
                England Prepare To Stop Mbappe In Thrilling Encounter
              </h2>
              <div className="featured-actions">
                <button
                  type="button"
                  className="featured-btn-play"
                  onClick={() => alert("DOTBALL: Play promotional video highlight.")}
                >
                  How To Play
                </button>
                <button
                  type="button"
                  className="featured-btn-predict"
                  onClick={() => {
                    // Match England vs France if present in our fixtures, else use current active
                    const engFrance = fixtures.find(
                      (f) =>
                        f.home.toLowerCase().includes("england") ||
                        f.away.toLowerCase().includes("england")
                    );
                    openCopilotCockpit(engFrance ? engFrance.id : activeFixtureId);
                  }}
                >
                  Make a Prediction
                </button>
              </div>
              <div className="featured-slider-controls">
                <button type="button" className="slider-arrow-btn">
                  &lt;
                </button>
                <button type="button" className="slider-arrow-btn active">
                  &gt;
                </button>
              </div>
            </div>

            {/* Thumbnail selector overlay at bottom of featured banner */}
            <div className="hero-thumbnails-container">
              <div
                className="hero-thumb-item active"
                onClick={() => {
                  const f = fixtures.find(
                    (item) =>
                      item.home.toLowerCase().includes("england") ||
                      item.away.toLowerCase().includes("france")
                  );
                  if (f) setActiveFixtureId(f.id);
                }}
              >
                <span className="hero-thumb-num">01</span>
                <span className="hero-thumb-title">
                  England prepare to stop Mbappe in thrilling encounter
                </span>
                <span className="hero-thumb-team">England</span>
              </div>
              <div
                className="hero-thumb-item"
                onClick={() => {
                  const f = fixtures.find(
                    (item) =>
                      item.home.toLowerCase().includes("brazil") ||
                      item.away.toLowerCase().includes("brazil")
                  );
                  if (f) setActiveFixtureId(f.id);
                }}
              >
                <span className="hero-thumb-num">02</span>
                <span className="hero-thumb-title">
                  Can Neymar break Pele's record for goals?
                </span>
                <span className="hero-thumb-team">Brazil</span>
              </div>
              <div
                className="hero-thumb-item"
                onClick={() => {
                  const f = fixtures.find(
                    (item) =>
                      item.home.toLowerCase().includes("spain") ||
                      item.away.toLowerCase().includes("spain")
                  );
                  if (f) setActiveFixtureId(f.id);
                }}
              >
                <span className="hero-thumb-num">03</span>
                <span className="hero-thumb-title">
                  Enrique pays the price for Spain's Shocking exit
                </span>
                <span className="hero-thumb-team">Spain</span>
              </div>
              <div
                className="hero-thumb-item"
                onClick={() => {
                  const f = fixtures.find(
                    (item) =>
                      item.home.toLowerCase().includes("morocco") ||
                      item.away.toLowerCase().includes("portugal")
                  );
                  if (f) setActiveFixtureId(f.id);
                }}
              >
                <span className="hero-thumb-num">04</span>
                <span className="hero-thumb-title">
                  Will Ronaldo be in Portugal's team to face Morocco?
                </span>
                <span className="hero-thumb-team">Portugal</span>
              </div>
              <div
                className="hero-thumb-down-arrow-box"
                onClick={handleScrollToMatches}
                title="Scroll to Match Board"
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11 4v12.17l-5.58-5.59L4 12l8 8 8-8-1.42-1.42L13 16.17V4h-2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Hero right sidebar (tabbed UPCOMING vs RESULTS matches) */}
          <div className="hero-sidebar-card">
            <div className="sidebar-tab-header">
              <button
                type="button"
                className={`sidebar-tab ${heroSidebarTab === "upcoming" ? "active" : ""}`}
                onClick={() => setHeroSidebarTab("upcoming")}
              >
                Upcoming
              </button>
              <button
                type="button"
                className={`sidebar-tab ${heroSidebarTab === "results" ? "active" : ""}`}
                onClick={() => setHeroSidebarTab("results")}
              >
                Results
              </button>
            </div>

            <div className="sidebar-match-list">
              {heroSidebarTab === "upcoming"
                ? fixtures.slice(0, 4).map((fixture) => (
                    <div
                      key={fixture.id}
                      className="sidebar-match-row"
                      onClick={() => openCopilotCockpit(fixture.id)}
                    >
                      <div className="sidebar-match-teams">
                        <div className="sidebar-team">
                          <FlagIcon
                            country={fixture.home}
                            className="sidebar-team-flag"
                            size={24}
                          />
                          <span className="sidebar-team-name">
                            {fixture.home.slice(0, 3)}
                          </span>
                        </div>
                        <span className="sidebar-match-vs">V</span>
                        <div className="sidebar-team">
                          <FlagIcon
                            country={fixture.away}
                            className="sidebar-team-flag"
                            size={24}
                          />
                          <span className="sidebar-team-name">
                            {fixture.away.slice(0, 3)}
                          </span>
                        </div>
                      </div>
                      <div className="sidebar-match-details">
                        <p className="sidebar-match-time">{fixture.time}</p>
                        <p className="sidebar-match-venue">{fixture.venue.slice(0, 16)}</p>
                      </div>
                    </div>
                  ))
                : mockupResults.map((result, idx) => (
                    <div
                      key={idx}
                      className="sidebar-match-row"
                      onClick={() => alert(`Match resolved: ${result.home} ${result.score} ${result.away}`)}
                    >
                      <div className="sidebar-match-teams">
                        <div className="sidebar-team">
                          <FlagIcon
                            country={result.home}
                            className="sidebar-team-flag"
                            size={24}
                          />
                          <span className="sidebar-team-name">
                            {result.home.slice(0, 3)}
                          </span>
                        </div>
                        <span className="sidebar-match-vs">{result.score}</span>
                        <div className="sidebar-team">
                          <FlagIcon
                            country={result.away}
                            className="sidebar-team-flag"
                            size={24}
                          />
                          <span className="sidebar-team-name">
                            {result.away.slice(0, 3)}
                          </span>
                        </div>
                      </div>
                      <div className="sidebar-match-details">
                        <p className="sidebar-match-venue">{result.desc.slice(12)}</p>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </section>

        {/* —— CHOOSE YOUR MATCH SECTION —— */}
        <section className="section-choose-match" id="choose-match-section">
          <div className="choose-match-header">
            <h3 className="choose-match-title">Choose Your Match</h3>
            <div className="match-tabs">
              <span className="match-tab active">Upcoming Matches</span>
              <span className="match-tab" onClick={() => alert("DOTBALL: Live prediction pools loading...")}>Live Matches</span>
            </div>
            <div className="view-toggles">
              <button type="button" className="view-toggle-btn">
                {/* Grid Icon representation */}
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" />
                </svg>
              </button>
              <button type="button" className="view-toggle-btn active">
                {/* List Icon representation */}
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="choose-match-grid">
            {/* Sidebar filter controls column */}
            <aside className="filter-sidebar">
              {/* Search Box */}
              <div className="search-box-container">
                <input
                  type="text"
                  placeholder="Search"
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg
                  className="search-icon-svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>

              {/* Collapsible stages filter categories */}
              <div className="filter-category">
                <div className="filter-category-header">
                  <span className="filter-category-title">Favourites</span>
                  <span>▼</span>
                </div>
              </div>

              <div className="filter-category">
                <div className="filter-category-header">
                  <span className="filter-category-title">Popular Teams</span>
                  <span>▼</span>
                </div>
              </div>

              <div className="filter-category">
                <div className="filter-category-header">
                  <span className="filter-category-title">Top Scorers</span>
                  <span>▼</span>
                </div>
              </div>

              <div className="filter-category">
                <div className="filter-category-header">
                  <span className="filter-category-title">Stages</span>
                  <span>▲</span>
                </div>
                <div className="filter-items-list">
                  <div
                    className={`filter-item-row ${selectedStage === "Group stage" ? "active" : ""}`}
                    onClick={() => setSelectedStage("Group stage")}
                  >
                    <span>Group stage</span>
                    <span className="filter-item-dot" />
                  </div>
                  <div
                    className={`filter-item-row ${selectedStage === "Round of 16" ? "active" : ""}`}
                    onClick={() => setSelectedStage("Round of 16")}
                  >
                    <span>Round of 16</span>
                    <span className="filter-item-dot" />
                  </div>
                  <div
                    className={`filter-item-row ${selectedStage === "Quarter finals" ? "active" : ""}`}
                    onClick={() => setSelectedStage("Quarter finals")}
                  >
                    <span>Quarter finals</span>
                    <span className="filter-item-dot" />
                  </div>
                  <div
                    className={`filter-item-row ${selectedStage === "Past Winners" ? "active" : ""}`}
                    onClick={() => setSelectedStage("Past Winners")}
                  >
                    <span>Past Winners</span>
                    <span className="filter-item-dot" />
                  </div>
                </div>
              </div>
            </aside>

            {/* List match rows board column */}
            <div className="match-rows-board">
              {filteredFixtures.length > 0 ? (
                filteredFixtures.map((fixture) => (
                  <FixtureCard
                    key={fixture.id}
                    fixture={fixture}
                    active={activeFixture?.id === fixture.id && isDrawerOpen}
                    onSelect={() => openCopilotCockpit(fixture.id)}
                    poolLabel={activeFixture?.id === fixture.id ? "48.2K" : "48.2K"}
                  />
                ))
              ) : (
                <div style={{ color: "var(--muted)", padding: "40px", textAlign: "center" }}>
                  No matches matched your search.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* —— WORLD CUP HIGHLIGHTS —— */}
        <section className="highlights-section">
          <p className="highlights-title">World Cup 2022</p>
          <h3 className="highlights-sub">Highlights</h3>

          <div className="highlights-layout">
            {/* Morocco vs Spain video card player */}
            <div className="video-main-card">
              <div
                className="video-player-container"
                style={{ backgroundImage: `url('/morocco_spain.png')` }}
              >
                <div className="video-player-overlay" />
                <button
                  type="button"
                  className="video-play-btn"
                  onClick={() => alert("DOTBALL Highlight Player: Loading Morocco vs Spain penalties review...")}
                  aria-label="Play highlight video"
                >
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
                <div className="video-top-tag">
                  <FlagIcon country="Morocco" size={14} />
                  <span>MAR</span>
                  <span style={{ margin: "0 4px" }}>0 - 0</span>
                  <span>ESP</span>
                  <FlagIcon country="Spain" size={14} />
                </div>
              </div>
              <div className="video-bottom-bar">
                <p className="video-caption">
                  Morocco stun Spain on penalties to reach World Cup quarter finals.
                </p>
                <div className="video-bar-actions">
                  <button
                    type="button"
                    className="video-btn-share"
                    onClick={() => alert("Share link copied to clipboard!")}
                  >
                    Share
                  </button>
                  <button type="button" className="video-btn-more">
                    •••
                  </button>
                </div>
              </div>
            </div>

            {/* UP NEXT sidebar videos list */}
            <div className="up-next-section">
              <div className="up-next-header">
                <span className="up-next-title">Up Next</span>
                <span className="up-next-arrow-orange">&gt;&gt;&gt;</span>
              </div>

              <div className="up-next-list">
                <div
                  className="up-next-card"
                  onClick={() => alert("Playing Brazil vs South Korea highlights...")}
                >
                  <div
                    className="up-next-thumb"
                    style={{
                      backgroundImage: `url('/morocco_spain.png')`,
                      filter: "hue-rotate(60deg) saturate(1.2)"
                    }}
                  >
                    <div className="up-next-play-icon">
                      <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="up-next-info">
                    <p className="up-next-caption">
                      Brazil artfully demolish South Korea in their quest to win a sixth World Cup.
                    </p>
                  </div>
                </div>

                <div
                  className="up-next-card"
                  onClick={() => alert("Playing Croatia vs Japan highlights...")}
                >
                  <div
                    className="up-next-thumb"
                    style={{
                      backgroundImage: `url('/morocco_spain.png')`,
                      filter: "hue-rotate(180deg) brightness(0.9)"
                    }}
                  >
                    <div className="up-next-play-icon">
                      <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="up-next-info">
                    <p className="up-next-caption">
                      Croatia beat Japan on penalties to claim World Cup quarter final spot.
                    </p>
                  </div>
                </div>

                <div
                  className="up-next-card"
                  onClick={() => alert("Playing France vs Poland highlights...")}
                >
                  <div
                    className="up-next-thumb"
                    style={{
                      backgroundImage: `url('/mbappe_hero.png')`,
                      backgroundSize: "cover"
                    }}
                  >
                    <div className="up-next-play-icon">
                      <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="up-next-info">
                    <p className="up-next-caption">
                      Ruthless Giroud and Mbappe fire France into the World Cup quarter-finals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* —— SPONSORS LOGO BAR —— */}
        <section className="sponsors-bar" id="news">
          {/* Premium mockup visual branding logos */}
          <span style={{ fontSize: "14px", fontWeight: "bold", letterSpacing: "0.2em" }}>SUPER SPORT</span>
          <span style={{ fontSize: "14px", fontWeight: "bold", letterSpacing: "0.25em" }}>DStv</span>
          <span style={{ fontSize: "14px", fontWeight: "bold", letterSpacing: "0.15em" }}>COINBASE</span>
          <span style={{ fontSize: "14px", fontWeight: "bold", letterSpacing: "0.3em" }}>ESPN</span>
          <span style={{ fontSize: "14px", fontWeight: "bold", letterSpacing: "0.2em" }}>EXODUS</span>
        </section>
      </div>

      {/* —— DAPP COPILOT SLIDE-OUT DRAWER —— */}
      <div
        className={`copilot-drawer-overlay ${isDrawerOpen ? "open" : ""}`}
        onClick={() => setIsDrawerOpen(false)}
      >
        <div
          className={`copilot-drawer-panel ${isDrawerOpen ? "open" : ""}`}
          onClick={(e) => e.stopPropagation()} // Prevent closing drawer on inner clicks
        >
          {/* Close button */}
          <button
            type="button"
            className="drawer-close-btn"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close prediction cockpit"
          >
            ✕
          </button>

          {/* Drawer Header info */}
          <div className="drawer-header">
            <span className="drawer-badge">X Layer Cockpit</span>
            <h2 className="drawer-title">FIFABuddy Copilot</h2>
            <p className="drawer-desc">
              Interact with prediction markets, place positions, and track top on-chain smart wallets in real-time.
            </p>
          </div>

          {/* USDT Bet Slip DApp Component */}
          <BetSlip
            fixture={activeFixture}
            onBetPlaced={handleBetSlipSuccess}
            copyTradeRequest={copyTradeRequest}
          />

          {/* AI Agent insights DApp Component */}
          <AgentInsights
            fixture={activeFixture}
            poolOdds={odds}
            communityPosts={activeMockPosts}
            topAnalysts={analysts}
            isAutoMode={isAutoMode}
            refreshToken={marketRefreshToken}
            onExecuteSignal={handleAgentExecuteSignal}
          />

          {/* Top smart analysts followed inside Drawer */}
          <div className="section">
            <div className="section-header">
              <div>
                <h3>On-Chain Analysts</h3>
                <p>Smart wallets monitored by your copy-trading engine.</p>
              </div>
              <span className="slip-chip">Tracking</span>
            </div>

            <div className="analyst-list">
              {analysts.map((analyst) => (
                <AnalystRow key={analyst.wallet} analyst={analyst} />
              ))}
            </div>

            <div className="auto-mode-row" style={{ marginTop: "16px", borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
              <span className={isAutoMode ? "auto-mode-label active" : "auto-mode-label"}>
                {isAutoMode ? "Auto Agent Enabled" : "Manual Execution"}
              </span>
              <button
                type="button"
                className="ghost-sm"
                onClick={() => setIsAutoMode(!isAutoMode)}
              >
                Toggle Mode
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
