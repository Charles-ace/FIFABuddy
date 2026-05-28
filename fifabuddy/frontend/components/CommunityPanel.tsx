"use client";

import { useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { usePostPrediction, useUpvote } from "@/hooks/useCommunityBoard";
import { formatUnits } from "viem";
import { xlayerTestnet } from "@/lib/wagmi";

type Post = {
  id: bigint;
  author: `0x${string}`;
  text: string;
  pick: string;
  upvotes: bigint;
};

type Props = {
  matchId: bigint;
  posts: Post[];
  onNewPost?: () => void;
  onUpvote?: () => void;
};

const EXPLORER = xlayerTestnet.blockExplorers.default.url;

export function CommunityPanel({ matchId, posts, onNewPost, onUpvote }: Props) {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const [text, setText] = useState("");
  const [pick, setPick] = useState("Home");
  const { postPrediction, hash: postHash, isPending: postPending, isSuccess: postSuccess } = usePostPrediction();
  const { upvote, hash: upvoteHash, isPending: upvotePending, isSuccess: upvoteSuccess } = useUpvote();

  const handleConnect = async () => {
    const connector = connectors[0];
    if (!connector) return;
    try {
      await connectAsync({ connector, chainId: xlayerTestnet.id });
    } catch (error) {
      console.error("Wallet connection failed", error);
    }
  };

  const handlePost = async () => {
    if (!isConnected) { await handleConnect(); return; }
    if (!text.trim()) return;
    await postPrediction(matchId, text, pick);
    setText("");
    onNewPost?.();
  };

  return (
    <div className="animate-slideDown" style={{
      padding: 16, borderRadius: 12,
      background: "var(--card)", border: "1px solid var(--border)",
      marginTop: 8,
    }}>
      <h4 style={{ margin: "0 0 12px", fontSize: 14, color: "var(--text)" }}>
        Community Predictions
      </h4>

      <div style={{ marginBottom: 12 }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your prediction..."
          maxLength={280}
          rows={2}
          style={{
            width: "100%", padding: "10px 12px", borderRadius: 8,
            border: "1px solid var(--border)", background: "transparent",
            color: "var(--text)", fontSize: 13, outline: "none",
            resize: "vertical", boxSizing: "border-box",
          }}
        />
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          {["Home", "Draw", "Away"].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPick(p)}
              style={{
                padding: "4px 12px", borderRadius: 6, border: "1px solid var(--border)",
                background: pick === p ? "var(--green-dim)" : "transparent",
                color: pick === p ? "var(--green)" : "var(--muted)",
                fontSize: 11, cursor: "pointer",
              }}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            onClick={handlePost}
            disabled={postPending || !text.trim()}
            style={{
              marginLeft: "auto", padding: "4px 16px", borderRadius: 6, border: "none",
              background: "var(--green)", color: "#080810", fontWeight: 600,
              fontSize: 12, cursor: "pointer", opacity: postPending ? 0.6 : 1,
              transition: "filter 0.2s, transform 0.2s",
            }}
          >
            {postPending ? "Posting..." : "Post"}
          </button>
        </div>
      </div>

      {postHash && (
        <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>
          Post tx:{" "}
          <a href={`${EXPLORER}/tx/${postHash}`} target="_blank" rel="noreferrer" style={{ color: "var(--blue)" }}>
            {postHash.slice(0, 10)}...
          </a>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {posts.length === 0 && (
          <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>
            No predictions yet. Be the first!
          </p>
        )}
        {posts.map((post) => (
          <div
            key={post.id.toString()}
            style={{
              padding: 10, borderRadius: 8,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--border)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: "var(--muted)" }}>
                {post.author.slice(0, 6)}...{post.author.slice(-4)}
              </span>
              <span style={{
                fontSize: 10, padding: "1px 6px", borderRadius: 4,
                background: "var(--green-dim)", color: "var(--green)",
                fontWeight: 600,
              }}>
                {post.pick}
              </span>
            </div>
            <p style={{ margin: "4px 0", fontSize: 13, color: "var(--text)" }}>
              {post.text}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button
                type="button"
                onClick={async () => { await upvote(post.id); onUpvote?.(); }}
                disabled={upvotePending}
                style={{
                  background: "none", border: "none", color: "var(--gold)",
                  cursor: "pointer", fontSize: 12, padding: 0,
                }}
              >
                ▲ {post.upvotes.toString()}
              </button>
              {upvoteHash && (
                <a href={`${EXPLORER}/tx/${upvoteHash}`} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: "var(--blue)" }}>
                  tx
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
