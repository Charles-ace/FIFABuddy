"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAccount } from "wagmi";
import { usePlaceBet, useUsdtAllowance, useApproveUsdt } from "@/hooks/usePredictionMarket";

const STORAGE_KEY_SUBSCRIBED = "matchmind_copy_subscribed";
const STORAGE_KEY_AUTO = "matchmind_copy_auto";
const POLL_INTERVAL = 15000;

export type Analyst = {
  address: `0x${string}`;
  label: string;
  winRate: number;
  totalBets: number;
  roi: number;
  followers: number;
  topPick: string;
};

export const SAMPLE_ANALYSTS: Analyst[] = [
  { address: "0x1234567890123456789012345678901234567890", label: "GoalPredator", winRate: 82, totalBets: 47, roi: 34.5, followers: 128, topPick: "Brazil" },
  { address: "0x2345678901234567890123456789012345678901", label: "MatchMindPro", winRate: 76, totalBets: 63, roi: 28.2, followers: 94, topPick: "France" },
  { address: "0x3456789012345678901234567890123456789012", label: "WCOracle", winRate: 79, totalBets: 38, roi: 31.8, followers: 76, topPick: "Argentina" },
  { address: "0x4567890123456789012345678901234567890123", label: "BetSage", winRate: 71, totalBets: 52, roi: 22.4, followers: 53, topPick: "Germany" },
  { address: "0x5678901234567890123456789012345678901234", label: "FootyAnalyst", winRate: 68, totalBets: 44, roi: 19.7, followers: 41, topPick: "Spain" },
];

type ExecutedTrade = {
  analyst: string;
  pick: string;
  amount: string;
  timestamp: number;
  hash?: string;
  status: "pending" | "confirmed" | "failed";
};

export function useCopyTrade() {
  const { address, isConnected } = useAccount();
  const [subscribed, setSubscribed] = useState<string[]>([]);
  const [autoExecuteEnabled, setAutoExecuteEnabledState] = useState(false);
  const [executedTrades, setExecutedTrades] = useState<ExecutedTrade[]>([]);
  const [isPolling, setIsPolling] = useState(false);
  const [lastPollResult, setLastPollResult] = useState<string>("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { placeBet, hash, isPending: betPending, isSuccess: betSuccess, error: betError } = usePlaceBet();
  const { allowance, refetch: refetchAllowance } = useUsdtAllowance(address);
  const { approve, isPending: approvePending, isSuccess: approveSuccess } = useApproveUsdt();

  // Load persisted state
  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY_SUBSCRIBED);
      if (s) setSubscribed(JSON.parse(s));
      const a = localStorage.getItem(STORAGE_KEY_AUTO);
      if (a) setAutoExecuteEnabledState(JSON.parse(a));
    } catch { /* ignore */ }
  }, []);

  // Refresh allowance after approve
  useEffect(() => { if (approveSuccess) refetchAllowance(); }, [approveSuccess]);

  const setAutoExecuteEnabled = useCallback((val: boolean) => {
    setAutoExecuteEnabledState(val);
    try { localStorage.setItem(STORAGE_KEY_AUTO, JSON.stringify(val)); } catch { /* ignore */ }
  }, []);

  const toggleSubscription = useCallback((label: string) => {
    setSubscribed((prev) => {
      const next = prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label];
      try { localStorage.setItem(STORAGE_KEY_SUBSCRIBED, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  // Poll community board for new analyst bets
  const pollAnalystBets = useCallback(async () => {
    if (!isConnected || !autoExecuteEnabled || subscribed.length === 0) return;
    setIsPolling(true);

    try {
      const res = await fetch("/api/community/posts", { method: "GET" });
      if (!res.ok) return;
      const data = await res.json();
      setLastPollResult(`Polled ${data.posts?.length || 0} posts`);

      for (const post of data.posts || []) {
        const analyst = SAMPLE_ANALYSTS.find(
          (a) => a.address.toLowerCase() === post.author?.toLowerCase()
        );
        if (!analyst || !subscribed.includes(analyst.label)) continue;

        const alreadyExecuted = executedTrades.some(
          (t) => t.analyst === analyst.label && t.timestamp === post.timestamp
        );
        if (alreadyExecuted) continue;

        const outcome = post.pick?.toLowerCase().includes("home") ? 1
          : post.pick?.toLowerCase().includes("away") ? 3 : 2;

        const amount = "25";
        setExecutedTrades((prev) => [...prev, {
          analyst: analyst.label,
          pick: post.pick || analyst.topPick,
          amount,
          timestamp: post.timestamp || Date.now(),
          status: "pending",
        }]);

        try {
          await placeBet(BigInt(post.matchId || "0"), outcome, amount);
          setExecutedTrades((prev) => prev.map((t, i) =>
            i === prev.length - 1 ? { ...t, status: "confirmed" as const, hash } : t
          ));
        } catch {
          setExecutedTrades((prev) => prev.map((t, i) =>
            i === prev.length - 1 ? { ...t, status: "failed" as const } : t
          ));
        }
      }
    } catch { /* ignore */ } finally {
      setIsPolling(false);
    }
  }, [isConnected, autoExecuteEnabled, subscribed, executedTrades, placeBet, hash]);

  // Start/stop polling based on auto-execute state
  useEffect(() => {
    if (autoExecuteEnabled && subscribed.length > 0) {
      pollRef.current = setInterval(pollAnalystBets, POLL_INTERVAL);
      pollAnalystBets(); // immediate first poll
    } else {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = null;
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [autoExecuteEnabled, subscribed.length, pollAnalystBets]);

  return {
    subscribed,
    toggleSubscription,
    autoExecuteEnabled,
    setAutoExecuteEnabled,
    executedTrades,
    isPolling,
    lastPollResult,
  };
}
