import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { COMMUNITY_BOARD_ADDRESS, COMMUNITY_BOARD_ABI } from "@/lib/contracts";

export function useMatchPosts(matchId: bigint) {
  const { data, refetch, isLoading, error } = useReadContract({
    address: COMMUNITY_BOARD_ADDRESS,
    abi: COMMUNITY_BOARD_ABI,
    functionName: "getMatchPosts",
    args: [matchId],
  });

  return {
    postIds: data ?? [],
    isLoading,
    error,
    refetch,
  };
}

export function usePost(postId: bigint) {
  const { data, refetch, isLoading, error } = useReadContract({
    address: COMMUNITY_BOARD_ADDRESS,
    abi: COMMUNITY_BOARD_ABI,
    functionName: "getPost",
    args: [postId],
  });

  return {
    post: data
      ? {
          id: data.id,
          author: data.author,
          matchId: data.matchId,
          text: data.text,
          pick: data.pick,
          upvotes: data.upvotes,
          timestamp: data.timestamp,
        }
      : null,
    isLoading,
    error,
    refetch,
  };
}

export function usePostPrediction() {
  const { writeContractAsync, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const post = async (matchId: bigint, text: string, pick: string) => {
    return writeContractAsync({
      address: COMMUNITY_BOARD_ADDRESS,
      abi: COMMUNITY_BOARD_ABI,
      functionName: "postPrediction",
      args: [matchId, text, pick],
    });
  };

  return {
    post,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

export function useUpvote() {
  const { writeContractAsync, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const upvote = async (postId: bigint) => {
    return writeContractAsync({
      address: COMMUNITY_BOARD_ADDRESS,
      abi: COMMUNITY_BOARD_ABI,
      functionName: "upvote",
      args: [postId],
    });
  };

  return {
    upvote,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
