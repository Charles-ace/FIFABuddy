import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import {
  PREDICTION_ADDRESS,
  PREDICTION_ABI,
  USDT_ADDRESS,
  USDT_ABI,
} from "@/lib/contracts";

export function useMarket(matchId: bigint) {
  const { data, refetch, isLoading, error } = useReadContract({
    address: PREDICTION_ADDRESS,
    abi: PREDICTION_ABI,
    functionName: "markets",
    args: [matchId],
  });

  return {
    market: data
      ? {
          homeTeam: data[0],
          awayTeam: data[1],
          deadline: data[2],
          result: data[3],
          status: data[4],
        }
      : null,
    isLoading,
    error,
    refetch,
  };
}

export function useOdds(matchId: bigint) {
  const { data, refetch, isLoading } = useReadContract({
    address: PREDICTION_ADDRESS,
    abi: PREDICTION_ABI,
    functionName: "getOdds",
    args: [matchId],
  });

  return {
    odds: data
      ? {
          home: data[0],
          draw: data[1],
          away: data[2],
        }
      : { home: 0n, draw: 0n, away: 0n },
    isLoading,
    refetch,
  };
}

export function useUserBet(matchId: bigint, address: `0x${string}` | undefined) {
  const { data, refetch, isLoading } = useReadContract({
    address: PREDICTION_ADDRESS,
    abi: PREDICTION_ABI,
    functionName: "getUserBet",
    args: [matchId, address || "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: !!address,
    },
  });

  return {
    bet: data
      ? {
          home: data[0],
          draw: data[1],
          away: data[2],
        }
      : { home: 0n, draw: 0n, away: 0n },
    isLoading,
    refetch,
  };
}

export function useUsdtBalance(address: `0x${string}` | undefined) {
  const { data, refetch, isLoading } = useReadContract({
    address: USDT_ADDRESS,
    abi: USDT_ABI,
    functionName: "balanceOf",
    args: [address || "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: !!address,
    },
  });

  return {
    balance: data ?? 0n,
    isLoading,
    refetch,
  };
}

export function useUsdtAllowance(address: `0x${string}` | undefined) {
  const { data, refetch, isLoading } = useReadContract({
    address: USDT_ADDRESS,
    abi: USDT_ABI,
    functionName: "allowance",
    args: [address || "0x0000000000000000000000000000000000000000", PREDICTION_ADDRESS],
    query: {
      enabled: !!address,
    },
  });

  return {
    allowance: data ?? 0n,
    isLoading,
    refetch,
  };
}

export function usePlaceBet() {
  const { writeContractAsync, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const placeBet = async (matchId: bigint, outcome: number, amountString: string) => {
    const amount = parseUnits(amountString, 6);
    return writeContractAsync({
      address: PREDICTION_ADDRESS,
      abi: PREDICTION_ABI,
      functionName: "placeBet",
      args: [matchId, outcome, amount],
    });
  };

  return {
    placeBet,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset,
  };
}

export function useApproveUsdt() {
  const { writeContractAsync, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approve = async (amountString: string) => {
    const amount = parseUnits(amountString, 6);
    return writeContractAsync({
      address: USDT_ADDRESS,
      abi: USDT_ABI,
      functionName: "approve",
      args: [PREDICTION_ADDRESS, amount],
    });
  };

  return {
    approve,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset,
  };
}

export function useClaimWinnings() {
  const { writeContractAsync, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const claim = async (matchId: bigint) => {
    return writeContractAsync({
      address: PREDICTION_ADDRESS,
      abi: PREDICTION_ABI,
      functionName: "claimWinnings",
      args: [matchId],
    });
  };

  return {
    claim,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
