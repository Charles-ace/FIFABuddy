import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { COMMUNITY_ADDRESS, COMMUNITY_ABI } from "@/lib/contracts";

export function useMatchPosts(matchId: bigint) {
  const { data, refetch, isLoading } = useReadContract({
    address: COMMUNITY_ADDRESS,
    abi: COMMUNITY_ABI,
    functionName: "getMatchPosts",
    args: [matchId],
  });

  return { postIds: (data as bigint[]) ?? [], isLoading, refetch };
}

export function usePost(postId: bigint) {
  const { data, refetch, isLoading } = useReadContract({
    address: COMMUNITY_ADDRESS,
    abi: COMMUNITY_ABI,
    functionName: "getPost",
    args: [postId],
    query: { enabled: postId > 0n },
  });

  return {
    post: data
      ? {
          id: data[0],
          author: data[1],
          matchId: data[2],
          text: data[3],
          pick: data[4],
          upvotes: data[5],
          timestamp: data[6],
        }
      : null,
    isLoading,
    refetch,
  };
}

export function usePostPrediction() {
  const { writeContractAsync, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const postPrediction = async (matchId: bigint, text: string, pick: string) => {
    return writeContractAsync({
      address: COMMUNITY_ADDRESS,
      abi: COMMUNITY_ABI,
      functionName: "postPrediction",
      args: [matchId, text, pick],
    });
  };

  return { postPrediction, hash, isPending, isConfirming, isSuccess, error };
}

export function useUpvote() {
  const { writeContractAsync, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const upvote = async (postId: bigint) => {
    return writeContractAsync({
      address: COMMUNITY_ADDRESS,
      abi: COMMUNITY_ABI,
      functionName: "upvote",
      args: [postId],
    });
  };

  return { upvote, hash, isPending, isConfirming, isSuccess, error };
}
