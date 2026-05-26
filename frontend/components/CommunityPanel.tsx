"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useMatchPosts, usePost, usePostPrediction, useUpvote } from "@/hooks/useCommunityBoard";
import { getXLayerExplorerTxUrl } from "@/lib/wagmi";

type Props = {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
};

export function CommunityPanel({ matchId, homeTeam, awayTeam }: Props) {
  const { address, isConnected } = useAccount();
  const { postIds, refetch: refetchPosts, isLoading: isLoadingIds } = useMatchPosts(BigInt(matchId));

  // Post form state
  const [text, setText] = useState("");
  const [pick, setPick] = useState("Spain ML"); // We will sync this in useEffect to home ML
  const { post: submitPost, hash: postHash, isPending: postPending, isConfirming: postConfirming, isSuccess: postSuccess, error: postError } = usePostPrediction();

  useEffect(() => {
    setPick(`${homeTeam} ML`);
  }, [homeTeam]);

  useEffect(() => {
    if (postSuccess) {
      setText("");
      refetchPosts();
    }
  }, [postSuccess, refetchPosts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text || text.length > 280) return;
    try {
      await submitPost(BigInt(matchId), text, pick);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="section">
      <div className="section-header">
        <div>
          <h3>Community Board</h3>
          <p>On-chain posts and upvotes by fixture.</p>
        </div>
        <span className="slip-chip">Live sentiment</span>
      </div>

      {/* Post Prediction Form */}
      {isConnected ? (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "12px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid var(--border)", marginBottom: "16px" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "150px" }}>
              <label style={{ display: "block", fontSize: "11px", color: "var(--muted-light)", marginBottom: "4px" }}>Pick Option</label>
              <select 
                value={pick} 
                onChange={(e) => setPick(e.target.value)}
                style={{ width: "100%", padding: "6px", background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: "6px", fontSize: "12px" }}
              >
                <option value={`${homeTeam} ML`}>{homeTeam} ML</option>
                <option value="Draw">Draw</option>
                <option value={`${awayTeam} ML`}>{awayTeam} ML</option>
                <option value="Over 2.5">Over 2.5</option>
                <option value="Under 2.5">Under 2.5</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", color: "var(--muted-light)", marginBottom: "4px" }}>Prediction Detail (Max 280 characters)</label>
            <textarea
              placeholder="Provide your on-chain market analysis..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={280}
              style={{ width: "100%", minHeight: "60px", padding: "8px", background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: "6px", fontSize: "12px", fontFamily: "inherit", resize: "vertical" }}
            />
          </div>

          {postHash && (
            <div style={{ fontSize: "11px", color: "var(--blue)" }}>
              Tx: <a href={getXLayerExplorerTxUrl(postHash)} target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>{postHash.slice(0, 10)}...{postHash.slice(-8)}</a>
              {postConfirming && " (Confirming...)"}
              {postSuccess && " (Posted successfully!)"}
            </div>
          )}

          {postError && (
            <div style={{ color: "var(--red)", fontSize: "11px" }}>Error: {postError.message.slice(0, 80)}</div>
          )}

          <button
            type="submit"
            className="btn btn-secondary"
            disabled={!text || postPending || postConfirming}
            style={{ fontSize: "11px", cursor: "pointer", alignSelf: "flex-end", padding: "6px 12px" }}
          >
            {postPending || postConfirming ? "Posting..." : "Share Prediction"}
          </button>
        </form>
      ) : (
        <div style={{ padding: "12px", background: "rgba(255,255,255,0.01)", border: "1px dashed var(--border)", borderRadius: "8px", textAlign: "center", marginBottom: "16px", color: "var(--muted)" }}>
          Connect your wallet to share your on-chain predictions.
        </div>
      )}

      {/* Posts List */}
      <div className="community-list">
        {isLoadingIds ? (
          <div style={{ textAlign: "center", padding: "12px", color: "var(--muted)" }}>Loading posts...</div>
        ) : postIds.length === 0 ? (
          <div style={{ textAlign: "center", padding: "12px", color: "var(--muted)" }}>No community predictions yet. Be the first!</div>
        ) : (
          [...postIds].reverse().map((id) => (
            <PostRow key={id.toString()} postId={id} onUpvoteSuccess={refetchPosts} />
          ))
        )}
      </div>
    </div>
  );
}

// Sub-component to load individual post details
function PostRow({ postId, onUpvoteSuccess }: { postId: bigint; onUpvoteSuccess: () => void }) {
  const { post, isLoading, refetch } = usePost(postId);
  const { upvote, hash: upvoteHash, isPending: upvotePending, isConfirming: upvoteConfirming, isSuccess: upvoteSuccess, error: upvoteError } = useUpvote();

  useEffect(() => {
    if (upvoteSuccess) {
      refetch();
      onUpvoteSuccess();
    }
  }, [upvoteSuccess, refetch, onUpvoteSuccess]);

  if (isLoading) {
    return <div style={{ height: "60px", opacity: 0.5, background: "var(--card)", marginBottom: "8px", borderRadius: "8px" }} />;
  }

  if (!post || !post.author || post.author === "0x0000000000000000000000000000000000000000") {
    return null;
  }

  const handleUpvote = async () => {
    try {
      await upvote(postId);
    } catch (err) {
      console.error(err);
    }
  };

  const authorTruncated = `${post.author.slice(0, 6)}...${post.author.slice(-4)}`;
  const timeFormatted = new Date(Number(post.timestamp) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <article className="post">
      <div className="post-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <strong style={{ color: "var(--text)" }}>@{authorTruncated}</strong>{" "}
          <span style={{ fontSize: "11px", color: "var(--muted)" }}>
            · {timeFormatted}
          </span>
        </div>
        <span className="slip-chip" style={{ margin: 0, background: "rgba(255,255,255,0.04)" }}>{post.pick}</span>
      </div>
      <p style={{ margin: "8px 0", color: "var(--muted-light)" }}>{post.text}</p>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "8px", marginTop: "8px" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={{ fontSize: "11px", color: "var(--muted)" }}>
            {post.upvotes.toString()} upvotes
          </span>
          <span className="slip-chip" style={{ margin: 0, fontSize: "10px", background: "var(--green-dim)", color: "var(--green)" }}>
            On-chain Verified
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <button
            type="button"
            className="ghost"
            onClick={handleUpvote}
            disabled={upvotePending || upvoteConfirming}
            style={{ padding: "4px 8px", fontSize: "11px", borderRadius: "4px", cursor: "pointer" }}
          >
            {upvotePending || upvoteConfirming ? "Upvoting..." : "▲ Upvote"}
          </button>
          
          {upvoteHash && (
            <span style={{ fontSize: "9px", color: "var(--blue)" }}>
              Tx: <a href={getXLayerExplorerTxUrl(upvoteHash)} target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>{upvoteHash.slice(0, 6)}</a>
            </span>
          )}

          {upvoteError && (
            <span style={{ color: "var(--red)", fontSize: "9px" }}>
              {upvoteError.message.includes("Already voted") ? "Already voted" : "Error"}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
