"use client";

import { useState, useEffect, useCallback } from "react";

type Props = {
  fixture: { team1: string; team2: string; date: string };
  poolOdds: { home: bigint; draw: bigint; away: bigint };
  communityPosts?: { author: string; text: string; pick: string; upvotes: string }[];
};

type Signal = {
  signal: "BUY" | "HOLD" | "AVOID";
  pick: string;
  confidence: number;
  reasoning: string;
};

const signalColors = {
  BUY: { bg: "var(--green-dim)", text: "var(--green)" },
  HOLD: { bg: "var(--gold-dim)", text: "var(--gold)" },
  AVOID: { bg: "rgba(255,77,109,0.12)", text: "var(--red)" },
};

export function AgentInsights({ fixture, poolOdds, communityPosts }: Props) {
  const [signal, setSignal] = useState<Signal | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Signal[]>([]);

  const fetchSignal = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fixture: { team1: fixture.team1, team2: fixture.team2, date: fixture.date },
          poolOdds: {
            home: poolOdds.home.toString(),
            draw: poolOdds.draw.toString(),
            away: poolOdds.away.toString(),
          },
          communityPosts: communityPosts ?? [],
        }),
      });
      const data = await res.json();
      setSignal(data);
      setHistory((prev) => [data, ...prev].slice(0, 10));
    } catch (e) {
      console.error("Agent signal fetch failed", e);
    } finally {
      setLoading(false);
    }
  }, [fixture, poolOdds, communityPosts]);

  useEffect(() => { fetchSignal(); }, [fetchSignal]);

  const colors = signal ? signalColors[signal.signal] : signalColors.HOLD;

  return (
    <div style={{
      padding: 16, borderRadius: 12,
      background: "var(--card)", border: "1px solid var(--border)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 15, color: "var(--text)" }}>
          FIFABuddy AI
        </h3>
        <button
          type="button"
          onClick={fetchSignal}
          disabled={loading}
          style={{
            padding: "4px 12px", borderRadius: 6, border: "1px solid var(--border)",
            background: "transparent", color: "var(--muted)", fontSize: 11,
            cursor: "pointer",
          }}
        >
          {loading ? "Thinking..." : "Refresh"}
        </button>
      </div>

      {loading && !signal && (
        <div style={{ padding: "20px 0", textAlign: "center" }}>
          <div style={{
            width: 24, height: 24, border: "2px solid var(--border)",
            borderTopColor: "var(--green)", borderRadius: "50%",
            margin: "0 auto 8px", animation: "spin 0.8s linear infinite",
          }} />
          <span style={{ fontSize: 12, color: "var(--muted)" }}>Claude is analysing...</span>
        </div>
      )}

      {signal && (
        <div style={{
          padding: 12, borderRadius: 8,
          background: colors.bg, border: `1px solid ${colors.text}`,
          marginBottom: 12,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{
              fontSize: 16, fontWeight: 700, color: colors.text,
            }}>
              {signal.signal}
            </span>
            <span style={{ fontSize: 20, fontWeight: 700, color: colors.text }}>
              {signal.confidence}%
            </span>
          </div>

          <div style={{
            height: 6, borderRadius: 3, background: "rgba(255,255,255,0.1)",
            marginBottom: 8, overflow: "hidden",
          }}>
            <div style={{
              width: `${signal.confidence}%`, height: "100%",
              background: colors.text, borderRadius: 3,
            }} />
          </div>

          <p style={{ fontSize: 12, color: "var(--text)", margin: "0 0 4px" }}>
            Pick: <strong>{signal.pick}</strong>
          </p>
          <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>
            {signal.reasoning}
          </p>
        </div>
      )}

      {history.length > 0 && (
        <div>
          <p style={{ fontSize: 11, color: "var(--muted)", margin: "0 0 8px", fontWeight: 600 }}>
            Signal History
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {history.map((h, i) => {
              const c = signalColors[h.signal];
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "6px 10px", borderRadius: 6,
                  background: c.bg, fontSize: 12,
                }}>
                  <span style={{ fontWeight: 700, color: c.text, minWidth: 40 }}>
                    {h.signal}
                  </span>
                  <span style={{ color: c.text, fontWeight: 600 }}>
                    {h.confidence}%
                  </span>
                  <span style={{ color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
