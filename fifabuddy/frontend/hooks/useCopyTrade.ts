"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";

const STORAGE_KEY_SUBSCRIBED = "matchmind_copy_subscribed";
const STORAGE_KEY_AUTO = "matchmind_copy_auto";

export function useCopyTrade() {
  const { address } = useAccount();
  const [subscribed, setSubscribed] = useState<string[]>([]);
  const [autoExecuteEnabled, setAutoExecuteEnabledState] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SUBSCRIBED);
      if (stored) setSubscribed(JSON.parse(stored));
      const auto = localStorage.getItem(STORAGE_KEY_AUTO);
      if (auto) setAutoExecuteEnabledState(JSON.parse(auto));
    } catch { /* ignore */ }
  }, []);

  const setAutoExecuteEnabled = useCallback((val: boolean) => {
    setAutoExecuteEnabledState(val);
    try { localStorage.setItem(STORAGE_KEY_AUTO, JSON.stringify(val)); } catch { /* ignore */ }
  }, []);

  const toggleSubscription = useCallback((label: string) => {
    setSubscribed((prev) => {
      const next = prev.includes(label)
        ? prev.filter((s) => s !== label)
        : [...prev, label];
      try { localStorage.setItem(STORAGE_KEY_SUBSCRIBED, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const executeTrade = useCallback(async (
    matchId: bigint,
    outcome: number,
    amount: string,
  ) => {
    try {
      const res = await fetch("/api/agent/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          matchId: matchId.toString(),
          outcome,
          amount,
        }),
      });
      return await res.json();
    } catch (e) {
      console.error("Auto-execute failed", e);
      return null;
    }
  }, [address]);

  return {
    subscribed,
    toggleSubscription,
    autoExecuteEnabled,
    setAutoExecuteEnabled,
    executeTrade,
  };
}
