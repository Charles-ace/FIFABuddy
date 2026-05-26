"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FootballFixture } from "@/lib/football";
import { signal as fallbackSignal } from "@/lib/mockData";

type TopAnalyst = {
  handle: string;
  winRate: string;
  pnl: string;
  confidence: number;
  pick: "home" | "draw" | "away";
};

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
  topAnalysts: TopAnalyst[];
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

type AnalystConsensus = {
  pick: "home" | "draw" | "away";
  label: string;
  confidence: number;
  supporters: number;
};

function getSignalSide(signal: string, fixture: FootballFixture) {
  const normalizedPick = signal.toLowerCase();

  if (normalizedPick.includes("draw")) {
    return "draw" as const;
  }

  if (normalizedPick.includes(fixture.home.toLowerCase())) {
    return "home" as const;
  }

  if (normalizedPick.includes(fixture.away.toLowerCase())) {
    return "away" as const;
  }

  return null;
}

export function AgentInsights({
  fixture,
  poolOdds,
  communityPosts,
  topAnalysts,
  isAutoMode = true,
  refreshToken = 0,
  onExecuteSignal,
}: Props) {
  const [signal, setSignal] = useState<AgentSignal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);
  const [lastRunLabel, setLastRunLabel] = useState("Never");
  const isRunningRef = useRef(false);
  const lastAutoExecuteKeyRef = useRef<string | null>(null);
  const recurringIntervalMs = 90_000;

  const analystConsensus = useMemo<AnalystConsensus | null>(() => {
    const grouped = topAnalysts.reduce(
      (acc, analyst) => {
        acc[analyst.pick].push(analyst);
        return acc;
      },
      {
        home: [] as TopAnalyst[],
        draw: [] as TopAnalyst[],
        away: [] as TopAnalyst[],
      }
    );

    const ordered = (Object.entries(grouped) as Array<[AnalystConsensus["pick"], TopAnalyst[]]>).sort(
      (a, b) => b[1].length - a[1].length
    );
    const [pick, supporters] = ordered[0] ?? ["home", []];

    if (supporters.length < 2) {
      return null;
    }

    const averageConfidence = Math.round(
      supporters.reduce((sum, analyst) => sum + analyst.confidence, 0) / supporters.length
    );

    return {
      pick,
      label:
        pick === "home"
          ? `${fixture.home} ML`
          : pick === "away"
            ? `${fixture.away} ML`
            : "Draw",
      confidence: averageConfidence,
      supporters: supporters.length,
    };
  }, [fixture.away, fixture.home, topAnalysts]);

  const runAgentTask = useCallback(
    async (isActive: () => boolean = () => true) => {
      if (isRunningRef.current) {
        return;
      }

      isRunningRef.current = true;
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
            topAnalysts: topAnalysts.map((analyst) => ({
              handle: analyst.handle,
              pick: analyst.pick,
              winRate: analyst.winRate,
              pnl: analyst.pnl,
              confidence: analyst.confidence,
            })),
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
        isRunningRef.current = false;
      }
    },
    [communityPosts, fixture, poolOdds.away, poolOdds.draw, poolOdds.home, topAnalysts]
  );

  useEffect(() => {
    if (!isAutoMode) return;

    let active = true;
    void runAgentTask(() => active);
    const intervalId = window.setInterval(() => {
      if (!active || isRunningRef.current) return;
      void runAgentTask(() => active);
    }, recurringIntervalMs);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [isAutoMode, refreshToken, recurringIntervalMs, runAgentTask]);

  useEffect(() => {
    lastAutoExecuteKeyRef.current = null;
  }, [fixture.id]);

  useEffect(() => {
    if (!isAutoMode || !signal || signal.signal !== "BUY" || !onExecuteSignal || !analystConsensus) {
      return;
    }

    const signalSide = getSignalSide(signal.pick, fixture);
    if (!signalSide || signalSide !== analystConsensus.pick) {
      return;
    }

    const autoExecuteKey = `${fixture.id}:${signal.pick}:${analystConsensus.pick}`;
    if (lastAutoExecuteKeyRef.current === autoExecuteKey) {
      return;
    }

    lastAutoExecuteKeyRef.current = autoExecuteKey;
    onExecuteSignal(signal);
  }, [analystConsensus, fixture, isAutoMode, onExecuteSignal, signal]);

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
          {isAutoMode ? <span className="slip-chip slip-chip-muted">Refreshes every 90s</span> : null}
          {analystConsensus ? (
            <span className="slip-chip slip-chip-muted">
              Following {analystConsensus.supporters} top analysts
            </span>
          ) : null}
          <button type="button" className="ghost ghost-sm" onClick={() => void runAgentTask()}>
            {isLoading ? "Running..." : "Run Agent Task"}
          </button>
        </div>
      </div>

      {analystConsensus ? (
        <div className="meta-line" style={{ marginBottom: "10px" }}>
          <span>Analyst consensus</span>
          <strong>
            {analystConsensus.label} · {analystConsensus.confidence}%
          </strong>
        </div>
      ) : null}

      {isLoading ? (
        <div className="signal-loading">
          <span className="status-dot status-dot-pulse" />
          Claude is analyzing on-chain pools, analyst flow, and sentiment...
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
