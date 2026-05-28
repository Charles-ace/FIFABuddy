"use client";

import { useState, useEffect, useCallback } from "react";

type Props = {
  fixture: { team1: string; team2: string; date: string };
  poolOdds: { home: bigint; draw: bigint; away: bigint };
  communityPosts?: { author: string; text: string; pick: string; upvotes: string }[];
  onBet?: (fixture: { team1: string; team2: string; date: string }, outcome: 1 | 2 | 3) => void;
};

type Signal = {
  signal: "BUY" | "HOLD" | "AVOID";
  pick: string;
  confidence: number;
  reasoning: string;
};

const signalColors = {
  BUY: { bg: "rgba(0,232,122,0.08)", text: "var(--green)" },
  HOLD: { bg: "rgba(245,200,66,0.08)", text: "var(--gold)" },
  AVOID: { bg: "rgba(255,77,109,0.08)", text: "var(--red)" },
};

export function AgentInsights({ fixture, poolOdds, communityPosts, onBet }: Props) {
  const [signal, setSignal] = useState<Signal | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Signal[]>([]);
  const [error, setError] = useState(false);

  const fetchSignal = useCallback(async () => {
    setLoading(true); setError(false);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fixture: { team1: fixture.team1, team2: fixture.team2, date: fixture.date },
          poolOdds: { home: poolOdds.home.toString(), draw: poolOdds.draw.toString(), away: poolOdds.away.toString() },
          communityPosts: communityPosts ?? [],
        }),
      });
      if (!res.ok) { setError(true); return; }
      const data = await res.json();
      setSignal(data);
      setHistory((prev) => [data, ...prev].slice(0, 10));
    } catch { setError(true); } finally { setLoading(false); }
  }, [fixture, poolOdds, communityPosts]);

  useEffect(() => { fetchSignal(); }, [fetchSignal]);

  const colors = signal ? signalColors[signal.signal] : signalColors.HOLD;
  const pickToOutcome = (pick: string): 1 | 2 | 3 => {
    const lower = pick.toLowerCase();
    if (lower.includes(fixture.team1.toLowerCase()) || lower === "home" || lower === "1") return 1;
    if (lower.includes(fixture.team2.toLowerCase()) || lower === "away" || lower === "3") return 3;
    return 2;
  };

  const hasValidPick = signal && fixture.team1 && fixture.team2 && signal.pick;

  return (
    <div className="border-glow" style={{
      padding: 16, borderRadius: 12,
      background: "var(--bg-card)",
      border: "1px solid transparent",
      marginBottom: 12,
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "var(--green)", boxShadow: "0 0 10px var(--green-glow)",
            animation: "liveDot 1.5s ease-in-out infinite",
          }} />
          <h3 className="gradient-green" style={{
            margin: 0, fontSize: 14, fontWeight: 800, fontFamily: "var(--font-display)",
          }}>
            AI Prediction Engine
          </h3>
        </div>
        <button type="button" onClick={fetchSignal} disabled={loading}
          className="btn-outline" style={{ padding: "4px 12px", fontSize: 10 }}>
          {loading ? "Thinking..." : "Refresh"}
        </button>
      </div>

      {/* Loading */}
      {loading && !signal && (
        <div style={{ padding: "20px 0", textAlign: "center" }}>
          <div className="anim-spin" style={{
            width: 22, height: 22, border: "2px solid var(--border-glass)",
            borderTopColor: "var(--green)", borderRadius: "50%",
            margin: "0 auto 8px",
          }} />
          <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>
            Analysing match data...
          </span>
        </div>
      )}

      {/* Error */}
      {error && !signal && !loading && (
        <div style={{ padding: "16px 0", textAlign: "center" }}>
          <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0, fontFamily: "var(--font-display)" }}>
            Unable to load signal. Pull to refresh.
          </p>
        </div>
      )}

      {/* Empty */}
      {!signal && !loading && !error && (
        <div style={{ padding: "16px 0", textAlign: "center" }}>
          <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0, fontFamily: "var(--font-display)" }}>
            Select a match to see AI predictions.
          </p>
        </div>
      )}

      {/* Signal */}
      {signal && (
        <div style={{
          padding: 12, borderRadius: 10,
          background: colors.bg, border: `1px solid ${colors.text}20`,
          marginBottom: 12,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{
              fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800,
              color: colors.text,
            }}>
              {signal.signal}
            </span>
            <span style={{
              fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800,
              color: colors.text, letterSpacing: "-1px",
            }}>
              {signal.confidence}%
            </span>
          </div>

          <div style={{
            height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)",
            marginBottom: 8, overflow: "hidden",
          }}>
            <div style={{
              width: `${signal.confidence}%`, height: "100%",
              background: colors.text, borderRadius: 2,
              animation: "confBar 0.6s ease forwards",
            }} />
          </div>

          <p style={{
            fontSize: 11, color: "var(--text-primary)", margin: "0 0 4px",
            fontFamily: "var(--font-display)",
          }}>
            Pick: <strong>{signal.pick}</strong>
          </p>
          <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>
            {signal.reasoning}
          </p>

          {hasValidPick && onBet && (
            <button
              type="button"
              className="btn-primary"
              style={{
                width: "100%", padding: "8px 0", fontSize: 11,
                fontFamily: "var(--font-display)", marginTop: 10,
              }}
              onClick={() => onBet(fixture, pickToOutcome(signal.pick))}
            >
              Place Bet on {signal.pick}
            </button>
          )}
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div>
          <p style={{
            fontSize: 10, color: "var(--text-muted)", margin: "0 0 8px", fontWeight: 600,
            fontFamily: "var(--font-display)", letterSpacing: "0.5px",
          }}>
            Signal History
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {history.map((h, i) => {
              const c = signalColors[h.signal];
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "6px 10px", borderRadius: 6,
                  background: c.bg, fontSize: 11,
                }}>
                  <span style={{ fontWeight: 700, color: c.text, minWidth: 36, fontFamily: "var(--font-display)" }}>
                    {h.signal}
                  </span>
                  <span style={{ color: c.text, fontWeight: 700, fontFamily: "var(--font-display)" }}>
                    {h.confidence}%
                  </span>
                  <span style={{ color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {h.pick}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
