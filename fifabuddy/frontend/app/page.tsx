"use client";

import { useState, useEffect, useMemo } from "react";
import { useAccount } from "wagmi";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { RightPanel } from "@/components/RightPanel";
import { HeroMatch } from "@/components/HeroMatch";
import { MatchTable } from "@/components/MatchTable";
import { LeagueCards } from "@/components/LeagueCards";
import { PredictorCards } from "@/components/PredictorCards";
import { StatCards } from "@/components/StatCards";
import { FixtureCard } from "@/components/FixtureCard";
import { BetSlip } from "@/components/BetSlip";
import { CommunityPanel } from "@/components/CommunityPanel";
import { AgentInsights } from "@/components/AgentInsights";
import { CopyTrader } from "@/components/CopyTrader";
import { FeaturedLeagues } from "@/components/FeaturedLeagues";
import { LeaderboardPreview } from "@/components/LeaderboardPreview";
import { SectionHeader } from "@/components/SectionHeader";
import { Footer } from "@/components/Footer";
import { getMergedFixtures, type MergedFixture } from "@/lib/football";
import { useOdds } from "@/hooks/usePredictionMarket";

const INITIAL_SHOW = 5;

const testimonials = [
  { name: "Alex M.", role: "Football Analyst", text: "The AI predictions have completely changed how I approach match analysis. The confidence scoring is incredibly accurate.", rating: 5 },
  { name: "Sarah K.", role: "Crypto Trader", text: "Being able to combine football insights with on-chain betting is revolutionary. FIFABuddy is the future of sports prediction markets.", rating: 5 },
  { name: "Marcus J.", role: "World Cup Fan", text: "The tactical analytics dashboard gives me insights I never knew existed. It's like having a professional scouting team in my pocket.", rating: 5 },
];

const plans = [
  { name: "Starter", price: "Free", features: ["5 predictions/day", "Basic analytics", "Community access", "Standard odds"], popular: false },
  { name: "Pro", price: "$29/mo", features: ["Unlimited predictions", "Advanced analytics", "AI signals", "Priority support", "API access"], popular: true },
  { name: "Elite", price: "$99/mo", features: ["Everything in Pro", "Copy trading", "Real-time data feed", "Custom alerts", "Dedicated analyst"], popular: false },
];

const faqs = [
  { q: "How does FIFABuddy's AI work?", a: "Our AI analyzes historical match data, real-time odds movements, community sentiment, and on-chain pool dynamics to generate prediction signals with confidence scoring." },
  { q: "What blockchain does FIFABuddy use?", a: "FIFABuddy runs on X Layer (OKX's L2), providing fast, low-cost transactions for betting and staking." },
  { q: "Can I copy trade top analysts?", a: "Yes! Subscribe to top performers and enable auto-execute to automatically mirror their bets." },
  { q: "Is there a minimum stake?", a: "The minimum stake is 10 USDT per prediction. There's no maximum beyond your available balance." },
  { q: "How are winnings calculated?", a: "Payouts are determined by the pool odds at the time of your bet. Higher risk outcomes yield higher returns." },
];

export default function Page() {
  const { isConnected } = useAccount();
  const [fixtures, setFixtures] = useState<MergedFixture[]>([]);
  const [selectedFixture, setSelectedFixture] = useState<MergedFixture | null>(null);
  const [betOutcome, setBetOutcome] = useState<1 | 2 | 3 | null>(null);
  const [showCommunity, setShowCommunity] = useState<Record<string, boolean>>({});
  const [showAllFixtures, setShowAllFixtures] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

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
    <div className="sportsbook-layout" style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <div className="scan-overlay" />

      {/* ═══ LEFT SIDEBAR ═══ */}
      <Sidebar />

      {/* ═══ MAIN CONTENT ═══ */}
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <Navbar />

        <main style={{
          flex: 1, overflowY: "auto", padding: "12px 16px 40px",
          display: "flex", gap: 16,
        }}>
          {/* ─── Center Column ─── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Hero Match */}
            <HeroMatch fixture={activeFixture} odds={odds ?? undefined} />

            {/* Ticker */}
            <div className="ticker-wrap" style={{ marginBottom: 14 }}>
              <div className="ticker-track">
                {[...Array(2)].map((_, i) => (
                  <div key={i} style={{ display: "inline-flex", gap: 56 }}>
                    <span className="ticker-item"><span className="ticker-dot" style={{ background: "var(--green)" }} /> Brazil <span className="ticker-up">+3.2%</span></span>
                    <span className="ticker-item"><span className="ticker-dot" style={{ background: "var(--blue)" }} /> France <span className="ticker-up">+1.8%</span></span>
                    <span className="ticker-item"><span className="ticker-dot" style={{ background: "var(--green)" }} /> Argentina <span className="ticker-up">+4.1%</span></span>
                    <span className="ticker-item"><span className="ticker-dot" style={{ background: "var(--gold)" }} /> Portugal <span className="ticker-up">+0.5%</span></span>
                    <span className="ticker-item"><span className="ticker-dot" style={{ background: "var(--red)" }} /> Germany <span className="ticker-down">-1.2%</span></span>
                    <span className="ticker-item"><span className="ticker-dot" style={{ background: "var(--blue)" }} /> Spain <span className="ticker-up">+2.4%</span></span>
                    <span className="ticker-item"><span className="ticker-dot" style={{ background: "var(--green)" }} /> England <span className="ticker-up">+3.7%</span></span>
                  </div>
                ))}
              </div>
            </div>

            {/* League Cards Row */}
            <LeagueCards />

            {/* Stats */}
            <StatCards />

            {/* Matches Table */}
            <div className="section-label">Live & Upcoming Matches</div>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 48, width: "100%" }} />
                ))}
              </div>
            ) : (
              <>
                {/* Table view */}
                <div style={{ marginBottom: 12 }}>
                  <MatchTable fixtures={visibleFixtures} odds={odds ?? undefined} onBet={handleBet} />
                </div>

                {/* Card view (legacy, for community toggle per match) */}
                {visibleFixtures.map((fixture, i) => {
                  const matchKey = fixture.date.replace(/-/g, "");
                  return (
                    <div key={fixture.date + fixture.team1} style={{ display: showCommunity[matchKey] ? "block" : "none" }}>
                      <FixtureCard
                        fixture={fixture}
                        active={activeFixture?.date === fixture.date && activeFixture?.team1 === fixture.team1}
                        onSelect={() => setSelectedFixture(fixture)}
                        onBet={(outcome) => handleBet(fixture, outcome)}
                        odds={odds}
                        onToggleCommunity={() => setShowCommunity((prev) => ({ ...prev, [matchKey]: !prev[matchKey] }))}
                        communityOpen={showCommunity[matchKey]}
                      />
                      {showCommunity[matchKey] && (
                        <CommunityPanel
                          matchId={BigInt(matchKey)}
                          posts={communityPosts}
                        />
                      )}
                    </div>
                  );
                })}

                {hiddenCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowAllFixtures((prev) => !prev)}
                    className={showAllFixtures ? "btn-outline" : "btn-primary"}
                    style={{
                      width: "100%", padding: "10px 0", fontSize: 12,
                      fontFamily: "var(--font-display)", marginTop: 4, marginBottom: 16,
                    }}
                  >
                    {showAllFixtures ? "Show Less" : `See ${hiddenCount} More Matches`}
                  </button>
                )}
              </>
            )}

            {/* Bet Slip */}
            {betOutcome && activeFixture && (
              <div style={{ marginBottom: 16 }}>
                <BetSlip
                  fixture={activeFixture}
                  outcome={betOutcome}
                  onBetPlaced={() => setBetOutcome(null)}
                  onClose={() => setBetOutcome(null)}
                />
              </div>
            )}

            {/* Predictors */}
            <PredictorCards />

            {/* Leaderboard */}
            <div style={{ marginTop: 24 }}>
              <SectionHeader
                label="Community"
                title="Top Predictors"
                desc="See who's winning. Climb the ranks."
              />
              <LeaderboardPreview />
            </div>

            {/* Testimonials */}
            <div style={{ marginTop: 48 }}>
              <SectionHeader
                label="Testimonials"
                title="Trusted by Analysts"
                desc="Hear from the FIFABuddy community."
                align="center"
              />
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 16,
              }}>
                {testimonials.map((t, i) => (
                  <div
                    key={t.name}
                    className="glass-card"
                    style={{
                      padding: 20,
                      animation: `fadeUp 0.4s ease ${i * 0.08}s forwards`,
                      opacity: 0,
                    }}
                  >
                    <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
                      {[...Array(t.rating)].map((_, j) => (
                        <span key={j} style={{ color: "var(--gold)", fontSize: 13 }}>★</span>
                      ))}
                    </div>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 12 }}>
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                        {t.name}
                      </span>
                      <span style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: 6 }}>
                        {t.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div style={{ marginTop: 48 }}>
              <SectionHeader
                label="Pricing"
                title="Choose Your Plan"
                desc="Scale from casual fan to elite analyst."
                align="center"
              />
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 16,
                maxWidth: 900, margin: "0 auto",
              }}>
                {plans.map((plan, i) => (
                  <div
                    key={plan.name}
                    className={plan.popular ? "border-glow-green" : "glass-card"}
                    style={{
                      padding: 24, borderRadius: 12,
                      background: "var(--bg-card)",
                      border: plan.popular ? "1px solid transparent" : "1px solid var(--border-subtle)",
                      position: "relative",
                      animation: `fadeUp 0.4s ease ${0.1 + i * 0.06}s forwards`,
                      opacity: 0,
                    }}
                  >
                    {plan.popular && (
                      <div style={{
                        position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
                        padding: "3px 14px", borderRadius: 20,
                        background: "linear-gradient(135deg, var(--green), var(--emerald))",
                        fontSize: 10, fontWeight: 700, color: "#06060e",
                        fontFamily: "var(--font-display)",
                        whiteSpace: "nowrap",
                      }}>
                        Most Popular
                      </div>
                    )}
                    <h3 style={{
                      fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700,
                      color: "var(--text-primary)", marginBottom: 4,
                    }}>
                      {plan.name}
                    </h3>
                    <p style={{
                      fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800,
                      background: plan.popular
                        ? "linear-gradient(135deg, var(--green), var(--green-bright))"
                        : "linear-gradient(135deg, var(--text-primary), var(--text-secondary))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      marginBottom: 16,
                    }}>
                      {plan.price}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                      {plan.features.map((f) => (
                        <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ color: "var(--green)", fontSize: 12 }}>✓</span>
                          <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{f}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      className={plan.popular ? "btn-primary" : "btn-outline"}
                      style={{ width: "100%", padding: "10px 0", fontSize: 12, fontFamily: "var(--font-display)" }}
                    >
                      {plan.name === "Starter" ? "Get Started" : "Subscribe"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div style={{ marginTop: 48 }}>
              <SectionHeader
                label="FAQ"
                title="Frequently Asked Questions"
                desc="Everything you need to know."
                align="center"
              />
              <div style={{ maxWidth: 640, margin: "0 auto" }}>
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="glass-card"
                    style={{
                      marginBottom: 8, overflow: "hidden",
                      cursor: "pointer",
                      animation: `fadeUp 0.3s ease ${0.1 + i * 0.04}s forwards`,
                      opacity: 0,
                    }}
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  >
                    <div style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "14px 16px",
                    }}>
                      <span style={{
                        fontSize: 13, fontWeight: 600, color: "var(--text-primary)",
                        fontFamily: "var(--font-display)",
                      }}>
                        {faq.q}
                      </span>
                      <span style={{
                        fontSize: 14, color: "var(--green)", transition: "transform 0.3s",
                        transform: expandedFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                        display: "inline-block",
                      }}>
                        +
                      </span>
                    </div>
                    {expandedFaq === i && (
                      <div style={{
                        padding: "0 16px 14px",
                        animation: "slideUp 0.3s ease forwards",
                      }}>
                        <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <Footer />
          </div>

          {/* ─── Right Column ─── */}
          <RightPanel />
        </main>
      </div>
    </div>
  );
}
