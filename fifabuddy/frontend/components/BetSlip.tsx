"use client";

import { useState, useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import type { MergedFixture } from "@/lib/football";
import {
  useUsdtBalance,
  useUsdtAllowance,
  usePlaceBet,
  useApproveUsdt,
} from "@/hooks/usePredictionMarket";
import { xlayerTestnet } from "@/lib/wagmi";

type Props = {
  fixture: MergedFixture;
  outcome: 1 | 2 | 3 | null;
  onBetPlaced?: () => void;
  onClose?: () => void;
};

const EXPLORER = xlayerTestnet.blockExplorers.default.url;

export function BetSlip({ fixture, outcome, onBetPlaced, onClose }: Props) {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const [pick, setPick] = useState<1 | 2 | 3>(outcome || 1);
  const [amount, setAmount] = useState("25");

  const { balance, refetch: refetchBalance } = useUsdtBalance(address);
  const { allowance, refetch: refetchAllowance } = useUsdtAllowance(address);
  const { approve, hash: approveHash, isPending: approvePending, isSuccess: approveSuccess } = useApproveUsdt();
  const { placeBet, hash: betHash, isPending: betPending, isSuccess: betSuccess, error: betError } = usePlaceBet();

  const parsedAmount = parseUnits(amount || "0", 6);
  const needsApproval = isConnected && allowance < parsedAmount;

  const selectedTeam = pick === 1 ? fixture.team1 : pick === 3 ? fixture.team2 : "Draw";

  useEffect(() => { if (outcome) setPick(outcome); }, [outcome]);
  useEffect(() => { if (betSuccess) { refetchBalance(); refetchAllowance(); onBetPlaced?.(); } }, [betSuccess]);
  useEffect(() => { if (approveSuccess) { refetchAllowance(); } }, [approveSuccess]);

  const handleConnect = async () => {
    const connector = connectors[0];
    if (!connector) return;
    try {
      await connectAsync({ connector, chainId: xlayerTestnet.id });
    } catch (error) {
      console.error("Wallet connection failed", error);
    }
  };

  const handleAction = async () => {
    if (!isConnected) { await handleConnect(); return; }
    if (needsApproval) { await approve(amount); return; }
    await placeBet(BigInt(fixture.date.replace(/-/g, "")), pick, amount);
  };

  return (
    <div className="animate-scaleIn gradient-border" style={{
      padding: 16, borderRadius: 12,
      background: "var(--card)", border: "1px solid transparent",
      marginBottom: 12,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 className="gradient-text-green" style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Bet Slip</h3>
        {onClose && (
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 16 }}>
            ✕
          </button>
        )}
      </div>

      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>
        {fixture.team1} vs {fixture.team2}
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {        [{ v: 1, l: fixture.team1 }, { v: 2, l: "Draw" }, { v: 3, l: fixture.team2 }].map(({ v, l }) => (
          <button
            key={v}
            type="button"
            onClick={() => setPick(v as 1 | 2 | 3)}
            style={{
              flex: 1, padding: "8px 0", borderRadius: 8,
              background: pick === v ? "var(--green-dim)" : "transparent",
              border: pick === v ? "1px solid var(--green)" : "1px solid var(--border)",
              color: pick === v ? "var(--green)" : "var(--muted)",
              fontWeight: 600, fontSize: 11, cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 4 }}>
          Stake (USDT)
        </label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="decimal"
          style={{
            width: "100%", padding: "10px 12px", borderRadius: 8,
            border: "1px solid var(--border)", background: "transparent",
            color: "var(--text)", fontSize: 14, outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {["10", "25", "50", "100"].map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setAmount(preset)}
            style={{
              padding: "6px 12px", borderRadius: 6, border: "1px solid var(--border)",
              background: amount === preset ? "var(--green-dim)" : "transparent",
              color: amount === preset ? "var(--green)" : "var(--muted)",
              fontSize: 12, cursor: "pointer",
            }}
          >
            {preset}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: "var(--muted)" }}>Payout</span>
        <strong className="gradient-text-green" style={{ fontSize: 16 }}>
          {amount} USDT
        </strong>
      </div>

      {isConnected && (
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>
          Balance: {formatUnits(balance, 6)} USDT
        </div>
      )}

      {approveHash && (
        <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>
          Approve: <a href={`${EXPLORER}/tx/${approveHash}`} target="_blank" rel="noreferrer" style={{ color: "var(--blue)" }}>{approveHash.slice(0, 10)}...</a>
        </div>
      )}

      {betHash && (
        <div style={{ fontSize: 11, color: "var(--green)", marginBottom: 8 }}>
          Bet: <a href={`${EXPLORER}/tx/${betHash}`} target="_blank" rel="noreferrer" style={{ color: "var(--blue)" }}>{betHash.slice(0, 10)}...</a>
        </div>
      )}

      {betError && (
        <div style={{ fontSize: 12, color: "var(--red)", marginBottom: 8 }}>
          {betError.message.slice(0, 80)}
        </div>
      )}

      <button
        type="button"
        onClick={handleAction}
        disabled={betPending || approvePending}
        className={needsApproval ? "btn-gold" : "btn-primary"}
        style={{
          width: "100%", padding: "12px 0", fontSize: 14,
        }}
      >
        {!isConnected ? "Connect Wallet" : needsApproval ? "Approve USDT" : betPending ? "Placing Bet..." : `Place ${amount} USDT`}
      </button>
    </div>
  );
}
