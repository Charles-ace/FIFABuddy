"use client";

import { useState, useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import type { FootballFixture } from "@/lib/football";
import {
  useUsdtBalance,
  useUsdtAllowance,
  usePlaceBet,
  useApproveUsdt,
} from "@/hooks/usePredictionMarket";
import { useNetwork } from "@/lib/NetworkContext";
import { getSupportedConnector, getXLayerExplorerTxUrl } from "@/lib/wagmi";

type Props = {
  fixture: FootballFixture;
  onBetPlaced?: () => void;
  copyTradeRequest?: {
    id: number;
    amount: string;
    outcome: number;
    pickLabel: string;
    source: "agent";
  } | null;
};

type TradeIntent = {
  matchId: bigint;
  outcome: number;
  amount: string;
  label: string;
  source: "manual" | "agent";
};

export function BetSlip({ fixture, onBetPlaced, copyTradeRequest }: Props) {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { activeChain } = useNetwork();
  const [pick, setPick] = useState<"home" | "draw" | "away">("home");
  const [amount, setAmount] = useState("25");
  const [note, setNote] = useState("Backing the live favorite based on analyst flow.");
  const [queuedTrade, setQueuedTrade] = useState<TradeIntent | null>(null);
  const [waitingForConnection, setWaitingForConnection] = useState(false);
  const [queuedTradeSubmitted, setQueuedTradeSubmitted] = useState(false);

  const { balance, refetch: refetchBalance } = useUsdtBalance(address);
  const { allowance, refetch: refetchAllowance } = useUsdtAllowance(address);

  const { approve, hash: approveHash, isPending: approvePending, isConfirming: approveConfirming, isSuccess: approveSuccess, error: approveError, reset: resetApprove } = useApproveUsdt();
  const { placeBet, hash: betHash, isPending: betPending, isConfirming: betConfirming, isSuccess: betSuccess, error: betError, reset: resetBet } = usePlaceBet();

  const selectedTeam = pick === "home" ? fixture.home : pick === "away" ? fixture.away : "Draw";
  const outcomeValue = pick === "home" ? 1 : pick === "draw" ? 2 : 3;
  const parsedAmount = parseUnits(amount || "0", 6);
  const needsApproval = isConnected && allowance < parsedAmount;
  const isBalanceLow = isConnected && balance < parsedAmount;
  const currentBalanceFormatted = formatUnits(balance, 6);

  useEffect(() => {
    if (approveSuccess || betSuccess) {
      refetchBalance();
      refetchAllowance();
      if (betSuccess) {
        setQueuedTrade(null);
        setWaitingForConnection(false);
        setQueuedTradeSubmitted(false);
      }
      if (betSuccess && onBetPlaced) {
        onBetPlaced();
      }
    }
  }, [approveSuccess, betSuccess, refetchBalance, refetchAllowance, onBetPlaced]);

  useEffect(() => {
    if (!copyTradeRequest) return;

    const nextPick = copyTradeRequest.outcome === 2 ? "draw" : copyTradeRequest.outcome === 3 ? "away" : "home";
    const nextAmount = copyTradeRequest.amount;
    const nextTrade: TradeIntent = {
      matchId: BigInt(copyTradeRequest.id),
      outcome: copyTradeRequest.outcome,
      amount: nextAmount,
      label: copyTradeRequest.pickLabel,
      source: copyTradeRequest.source,
    };

    setPick(nextPick);
    setAmount(nextAmount);
    setNote(`Copy trade from ${copyTradeRequest.source.toUpperCase()}: ${copyTradeRequest.pickLabel}`);
    setQueuedTrade(nextTrade);
    setQueuedTradeSubmitted(false);
    void executeTrade(nextTrade);
  }, [copyTradeRequest]);

  useEffect(() => {
    if (!queuedTrade || !waitingForConnection || !isConnected) return;

    setWaitingForConnection(false);
    void executeTrade(queuedTrade);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, queuedTrade, waitingForConnection]);

  const handleConnect = async () => {
    const connector = getSupportedConnector(connectors);
    if (!connector) return;

    try {
      await connectAsync({ connector, chainId: activeChain.id });
    } catch (error) {
      console.error("Wallet connection failed", error);
    }
  };

  const executeTrade = async (trade: TradeIntent) => {
    if (!isConnected) {
      setQueuedTrade(trade);
      setWaitingForConnection(true);
      setQueuedTradeSubmitted(false);
      await handleConnect();
      return;
    }

    const tradeAmount = trade.amount || amount;
    const tradeParsedAmount = parseUnits(tradeAmount || "0", 6);
    setQueuedTrade(trade);
    setWaitingForConnection(false);
    setQueuedTradeSubmitted(false);

    try {
      if (allowance < tradeParsedAmount) {
        await approve(tradeAmount);
        return;
      }

      setQueuedTradeSubmitted(true);
      await placeBet(trade.matchId, trade.outcome, tradeAmount);
    } catch (e) {
      console.error(e);
      setQueuedTradeSubmitted(false);
    }
  };

  const handleAction = async () => {
    const manualTrade = {
      matchId: BigInt(fixture.id),
      outcome: outcomeValue,
      amount,
      label: selectedTeam,
      source: "manual" as const,
    };

    try {
      await executeTrade(manualTrade);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!approveSuccess || !queuedTrade || !isConnected || queuedTradeSubmitted) return;

    const trade = queuedTrade;
    const tradeAmount = trade.amount;
    const tradeParsedAmount = parseUnits(tradeAmount || "0", 6);

    if (allowance < tradeParsedAmount) {
      return;
    }

    setQueuedTradeSubmitted(true);
    void placeBet(trade.matchId, trade.outcome, tradeAmount).catch((error) => {
      console.error(error);
      setQueuedTradeSubmitted(false);
    });
  }, [approveSuccess, allowance, isConnected, placeBet, queuedTrade, queuedTradeSubmitted]);

  const isBusy =
    approvePending ||
    approveConfirming ||
    betPending ||
    betConfirming ||
    waitingForConnection;

  const ctaLabel = !isConnected
    ? "Connect Wallet"
    : approvePending || approveConfirming
      ? "Approving USDT..."
      : betPending || betConfirming
        ? "Placing Bet..."
        : waitingForConnection
          ? "Waiting for Wallet..."
        : isBalanceLow && !needsApproval
          ? "Insufficient USDT Balance"
          : queuedTrade
            ? `Execute ${queuedTrade.source === "agent" ? "Copy Trade" : "Bet"}`
            : needsApproval
            ? "Approve USDT"
            : `Place ${amount} USDT on ${selectedTeam}`;

  return (
    <div className="section bet-slip">
      <div className="section-header">
        <div>
          <h3>Bet Slip</h3>
          <p>Preview your FIFABuddy position on X Layer mainnet.</p>
        </div>
        <span className="slip-chip">USDT · 6 decimals</span>
      </div>

        <div className="slip-grid">
        {queuedTrade ? (
          <div className="slip-chip slip-chip-muted">
            Ready to execute {queuedTrade.source === "agent" ? "copy trade" : "manual bet"} for{" "}
            {queuedTrade.label}
          </div>
        ) : null}

        <div className="slip-field">
          <label>Fixture</label>
          <input value={`${fixture.home} vs ${fixture.away}`} readOnly />
        </div>

        <div className="slip-field">
          <label>Pick</label>
          <select value={pick} onChange={(event) => setPick(event.target.value as typeof pick)}>
            <option value="home">{fixture.home} ML</option>
            <option value="draw">Draw</option>
            <option value="away">{fixture.away} ML</option>
          </select>
        </div>

        <div className="slip-field">
          <label>Stake</label>
          <input
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value);
              resetApprove();
              resetBet();
            }}
            inputMode="decimal"
          />
        </div>

        <div className="amount-row">
          {["10", "25", "50", "100"].map((preset) => (
            <button
              key={preset}
              className={`ghost amount-preset ${amount === preset ? "amount-preset-active" : ""}`}
              onClick={() => {
                setAmount(preset);
                resetApprove();
                resetBet();
              }}
              type="button"
            >
              {preset} USDT
            </button>
          ))}
        </div>

        <div className="slip-field">
          <label>Why this bet</label>
          <textarea value={note} onChange={(event) => setNote(event.target.value)} />
        </div>

        {isConnected ? (
          <div className="slip-balance-row">
            <span>
              Balance: {parseFloat(currentBalanceFormatted).toLocaleString()} USDT
            </span>
          </div>
        ) : null}

        <div className="meta-line">
          <span>Deadline check</span>
          <strong>{fixture.status === "LIVE" ? "Betting still open" : "Closed soon"}</strong>
        </div>

        <div className="meta-line">
          <span>Selected side</span>
          <strong>{selectedTeam}</strong>
        </div>

        {approveHash ? (
          <div className="tx-line">
            Approval Tx:{" "}
            <a href={getXLayerExplorerTxUrl(approveHash)} target="_blank" rel="noreferrer">
              {approveHash.slice(0, 10)}...{approveHash.slice(-8)}
            </a>
            {approveConfirming ? " (Confirming...)" : approveSuccess ? " (Success!)" : null}
          </div>
        ) : null}

        {betHash ? (
          <div className="tx-line tx-line-success">
            Bet Tx:{" "}
            <a href={getXLayerExplorerTxUrl(betHash)} target="_blank" rel="noreferrer">
              {betHash.slice(0, 10)}...{betHash.slice(-8)}
            </a>
            {betConfirming ? " (Confirming...)" : betSuccess ? " (Success!)" : null}
          </div>
        ) : null}

        {approveError ? <p className="form-error">Approve: {approveError.message.slice(0, 80)}</p> : null}
        {betError ? <p className="form-error">Bet: {betError.message.slice(0, 80)}</p> : null}

        <button
          className="btn btn-primary btn-block"
          type="button"
          onClick={handleAction}
          disabled={isConnected && isBusy}
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}
