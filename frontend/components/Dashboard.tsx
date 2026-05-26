"use client";

import { useMemo, useState, useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import { formatUnits } from "viem";
import Link from "next/link";
import { FixtureCard } from "@/components/FixtureCard";
import { BetSlip } from "@/components/BetSlip";
import { AnalystRow } from "@/components/AnalystRow";
import { AgentInsights } from "@/components/AgentInsights";
import { Header } from "@/components/Header";
import { analysts, communityPosts as mockPosts } from "@/lib/mockData";
import type { FootballFixture } from "@/lib/football";
import { activeXLayerChain, getSupportedConnector } from "@/lib/wagmi";
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

function formatPoolLabel(totalUsdt: number) {
  if (totalUsdt <= 0) return "48.2K USDT";
  if (totalUsdt >= 1000) {
    return `${(totalUsdt / 1000).toFixed(1)}K USDT`;
  }
  return `${totalUsdt.toLocaleString()} USDT`;
}

export function Dashboard({ fixtures: initialFixtures }: Props) {
  const [fixtures, setFixtures] = useState(initialFixtures);
  const [activeFixtureId, setActiveFixtureId] = useState(initialFixtures[0]?.id ?? 0);
  const [isMarketRefreshing, setIsMarketRefreshing] = useState(false);
  const [isFixturesRefreshing, setIsFixturesRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [marketRefreshToken, setMarketRefreshToken] = useState(0);
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [copyTradeRequest, setCopyTradeRequest] = useState<CopyTradeRequest | null>(null);

  const { isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();

  const activeFixture = useMemo(
    () => fixtures.find((fixture) => fixture.id === activeFixtureId) ?? fixtures[0],
    [fixtures, activeFixtureId]
  );

  const { odds, refetch: refetchOdds } = useOdds(BigInt(activeFixture?.id ?? 0));

  const totalPoolWei = odds.home + odds.draw + odds.away;
  const totalPoolUsdt = parseFloat(formatUnits(totalPoolWei, 6));
  const poolLabel = formatPoolLabel(totalPoolUsdt);

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
          <div className="section">
            <h3>No fixtures available</h3>
            <p>OpenFootball returned an empty schedule. Try refreshing the page in a moment.</p>
          </div>
        </div>
      </main>
    );
  }

  async function refreshFixtures() {
    setIsFixturesRefreshing(true);
    setRefreshError(null);

    try {
      const res = await fetch("/api/football", { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Refresh failed (${res.status})`);
      }

      const data = (await res.json()) as { fixtures?: FootballFixture[] };
      const nextFixtures = Array.isArray(data.fixtures) ? data.fixtures : [];
      if (nextFixtures.length > 0) {
        setFixtures(nextFixtures);
        setActiveFixtureId((current) => {
          const nextFixture = nextFixtures.some((item) => item.id === current)
            ? current
            : nextFixtures[0]?.id ?? current;
          return nextFixture;
        });
      } else {
        throw new Error("No fixtures returned");
      }
    } catch (error) {
      setRefreshError(error instanceof Error ? error.message : "Unknown refresh error");
    } finally {
      setIsFixturesRefreshing(false);
    }
  }

  async function refreshMarketData() {
    setIsMarketRefreshing(true);

    try {
      await refetchOdds();
      setMarketRefreshToken((current) => current + 1);
    } catch (error) {
      console.error("Unable to refresh market data", error);
    } finally {
      setIsMarketRefreshing(false);
    }
  }

  const handleWalletHeroBtn = async () => {
    if (isConnected) return;

    const connector = getSupportedConnector(connectors);
    if (!connector) return;

    try {
      await connectAsync({ connector, chainId: activeXLayerChain.id });
    } catch (error) {
      console.error("Wallet connection failed", error);
    }
  };

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
  const hasMoreFixtures = fixtures.length > visibleFixtures.length;

  return (
    <main className="app-shell">
      <div className="page">
        <Header />

        <section className="hero">
          <div className="hero-main">
            <div className="hero-backdrop" aria-hidden="true">
              <span className="hero-orb hero-orb-a" />
              <span className="hero-orb hero-orb-b" />
              <span className="hero-grid" />
            </div>
            <div className="hero-copy">
              <div className="market-strip">
                <span className="status-chip status-chip-strong">
                  <span className="status-dot status-dot-pulse" />
                  Mainnet live
                </span>
                <span className="status-chip">MetaMask + OKX only</span>
                <span className="status-chip">Copy-trade engine online</span>
              </div>

              <div className="status-row">
                <span className="status-chip">
                  <span className="status-dot" />
                  Live market signal
                </span>
                <span className="status-chip">
                  <span className="status-dot" />
                  On-chain analyst flow
                </span>
                <span className="status-chip">
                  <span className="status-dot" />
                  Community sentiment
                </span>
              </div>

              <h2>Trade the World Cup like an analyst, not a spectator.</h2>
              <p>
                Track fixtures, monitor wallet conviction, auto-copy the smartest bets, and let the
                agent summarize the market in one glance.
              </p>

              <div className="hero-actions">
                {!isConnected ? (
                  <button className="btn btn-primary" type="button" onClick={handleWalletHeroBtn}>
                    Connect Wallet
                  </button>
                ) : (
                  <button className="btn btn-primary btn-connected" type="button" disabled>
                    Wallet Connected
                  </button>
                )}
                <button className="btn btn-secondary" type="button" onClick={refreshMarketData}>
                  {isMarketRefreshing ? "Refreshing..." : "Refresh Market"}
                </button>
                <a
                  className="btn btn-secondary"
                  href={activeXLayerChain.blockExplorers.default.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  View X Layer Explorer
                </a>
              </div>

              <div className="auto-mode-row">
                <span className={isAutoMode ? "auto-mode-label active" : "auto-mode-label"}>
                  {isAutoMode ? "Auto Agent Active" : "Manual Copilot"}
                </span>
                <button type="button" className="ghost ghost-sm" onClick={() => setIsAutoMode(!isAutoMode)}>
                  Toggle
                </button>
              </div>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <p className="stat-label">Selected fixture</p>
              <p className="stat-value stat-value-match">
                {activeFixture.home} vs {activeFixture.away}
              </p>
              <p className="stat-note">
                {activeFixture.date} · {activeFixture.time} · {activeFixture.venue}
              </p>
            </div>

            <div className="stat-grid">
              <div className="kpi-card">
                <strong>{communityUpvotes}</strong>
                <span>community upvotes</span>
              </div>
              <div className="kpi-card">
                <strong>{analysts.length}</strong>
                <span>analysts tracked</span>
              </div>
              <div className="kpi-card">
                <strong>87%</strong>
                <span>agent confidence</span>
              </div>
              <div className="kpi-card">
                <strong>{totalPoolUsdt > 0 ? formatPoolLabel(totalPoolUsdt).replace(" USDT", "") : "48.2K"}</strong>
                <span>USDT pool depth</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid">
          <div className="stack">
            <section className="section fixtures-section">
              <div className="section-header">
                <div>
                  <h3>Fixtures</h3>
                  <p>Click a match to update the slip and signal panels.</p>
                </div>
                <div className="section-actions">
                  <span className="slip-chip slip-chip-muted">OpenFootball + API-Football</span>
                  <button className="ghost" type="button" onClick={refreshFixtures}>
                    {isFixturesRefreshing ? "Refreshing..." : "Refresh Fixtures"}
                  </button>
                  {hasMoreFixtures ? (
                    <Link className="ghost" href="/fixtures">
                      Show more fixtures
                    </Link>
                  ) : null}
                </div>
              </div>

              {refreshError ? <div className="refresh-error">{refreshError}</div> : null}

              <div className="fixture-grid">
                {visibleFixtures.map((fixture) => (
                  <FixtureCard
                    key={fixture.id}
                    fixture={fixture}
                    active={activeFixture?.id === fixture.id}
                    onSelect={() => setActiveFixtureId(fixture.id)}
                    poolLabel={activeFixture?.id === fixture.id ? poolLabel : "48.2K USDT"}
                  />
                ))}
              </div>

              {hasMoreFixtures ? (
                <div className="fixtures-more-row">
                  <span className="fixtures-more-copy">
                    Showing {visibleFixtures.length} of {fixtures.length} fixtures
                  </span>
                  <Link className="btn btn-secondary btn-sm" href="/fixtures">
                    View complete list
                  </Link>
                </div>
              ) : null}
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

            <div className="section">
              <div className="section-header">
                <div>
                  <h3>Top Analysts</h3>
                  <p>Wallets the copy-trading engine is watching.</p>
                </div>
                <span className="slip-chip">Follow flow</span>
              </div>

              <div className="analyst-list">
                {analysts.map((analyst) => (
                  <AnalystRow key={analyst.wallet} analyst={analyst} />
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
