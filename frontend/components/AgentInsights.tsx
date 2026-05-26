"use client";

import { useCallback, useEffect, useState } from "react";
import type { FootballFixture } from "@/lib/football";
import { signal as fallbackSignal } from "@/lib/mockData";

type Props = {
  fixture: FootballFixture;
  poolOdds: {
    home: bigint;
    draw: bigint;
    away: bigint;
  };
  communityPosts: Array<{
    author: string;
    text: string;
    pick: string;
    upvotes: string;
  }>;
  isAutoMode?: boolean;
  refreshToken?: number;
  onExecuteSignal?: (signal: AgentSignal) => void;
};

type AgentSignal = {
  signal: "BUY" | "HOLD" | "AVOID";
  pick: string;
  confidence: number;
  reasoning: string;
};

export function AgentInsights({
  fixture,
  poolOdds,
  communityPosts,
  isAutoMode = true,
  refreshToken = 0,
  onExecuteSignal,
}: Props) {
  const [signal, setSignal] = useState<AgentSignal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);
  const [lastRunLabel, setLastRunLabel] = useState("Never");

  const runAgentTask = useCallback(
    async (isActive: () => boolean = () => true) => {
      setIsLoading(true);
      setUsedFallback(false);

      try {
        const response = await fetch("/api/agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fixture,
            poolOdds: {
              home: poolOdds.home.toString(),
              draw: poolOdds.draw.toString(),
              away: poolOdds.away.toString(),
            },
            communityPosts: communityPosts.map((p) => ({
              author: p.author,
              pick: p.pick,
              text: p.text,
              upvotes: p.upvotes.toString(),
            })),
          }),
        });

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const data = (await response.json()) as AgentSignal;
        if (isActive()) {
          setSignal(data);
          setLastRunLabel(
            new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          );
        }
      } catch {
        if (isActive()) {
          setSignal({
            ...fallbackSignal,
            pick: fixture.home ? `${fixture.home} ML` : fallbackSignal.pick,
          });
          setUsedFallback(true);
          setLastRunLabel(
            new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          );
        }
      } finally {
        if (isActive()) {
          setIsLoading(false);
        }
      }
    },
    [communityPosts, fixture, poolOdds.away, poolOdds.draw, poolOdds.home]
  );

  useEffect(() => {
    if (!isAutoMode) return;

    let active = true;
    void runAgentTask(() => active);

    return () => {
      active = false;
    };
  }, [isAutoMode, refreshToken, runAgentTask]);

  const display = signal;

  return (
    <div className="section signal">
      <div className="section-header">
        <div>
          <h3>Agent Signal</h3>
          <p>Claude-style analyst output for the selected fixture.</p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          <span className="slip-chip">{isAutoMode ? "Auto mode ready" : "Manual review"}</span>
          <button type="button" className="ghost ghost-sm" onClick={() => void runAgentTask()}>
            {isLoading ? "Running..." : "Run Agent Task"}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="signal-loading">
          <span className="status-dot status-dot-pulse" />
          Claude is analyzing on-chain pools and sentiment...
        </div>
      ) : display ? (
        <div className="signal-card">
          <div className={`signal-badge signal-${display.signal.toLowerCase()}`}>
            {display.signal} · {display.confidence}%
          </div>
          <div className="signal-body">
            <p>{display.reasoning}</p>
            <p className="signal-pick">
              Suggested pick: <strong>{display.pick}</strong>
              {usedFallback ? <span className="signal-fallback-tag"> · demo signal</span> : null}
            </p>
          </div>
          <div className="signal-actions">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => void runAgentTask()}
            >
              {isLoading ? "Running..." : "Re-run agent"}
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={display.signal !== "BUY" || !onExecuteSignal}
              onClick={() => onExecuteSignal?.(display)}
            >
              {display.signal === "BUY" ? "Execute suggested bet" : "Signal not ready"}
            </button>
          </div>
        </div>
      ) : (
        <div className="signal-loading">No signal available.</div>
      )}

      <div style={{ marginTop: "10px", color: "var(--muted)", fontSize: "11px" }}>
        Last task run: {lastRunLabel}
      </div>
    </div>
  );
}
