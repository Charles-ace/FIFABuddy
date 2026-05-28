"use client";

import { useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { usePostPrediction, useUpvote } from "@/hooks/useCommunityBoard";
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
  const { postPrediction, hash: postHash, isPending: postPending } = usePostPrediction();
  const { upvote, hash: upvoteHash, isPending: upvotePending } = useUpvote();

  const handleConnect = async () => {
    const connector = connectors[0];
    if (!connector) return;
    try { await connectAsync({ connector, chainId: xlayerTestnet.id }); } catch { /* ignore */ }
  };

  const handlePost = async () => {
    if (!isConnected) { await handleConnect(); return; }
    if (!text.trim()) return;
    await postPrediction(matchId, text, pick);
    setText("");
    onNewPost?.();
  };

  return (
    <div className="anim-slideUp" style={{
      padding: 14, borderRadius: 10,
      background: "var(--bg-card)",
      border: "1px solid var(--border-subtle)",
      marginTop: 4, marginBottom: 12,
    }}>
      <h4 className="gradient-green" style={{
        margin: "0 0 12px", fontSize: 13, fontWeight: 700,
        fontFamily: "var(--font-display)",
      }}>
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
            border: "1px solid var(--border-glass)", background: "rgba(255,255,255,0.02)",
            color: "var(--text-primary)", fontSize: 12, outline: "none",
            resize: "vertical", boxSizing: "border-box",
            fontFamily: "var(--font-body)",
          }}
        />
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          {["Home", "Draw", "Away"].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPick(p)}
              className={pick === p ? "btn-primary" : "btn-outline"}
              style={{ padding: "4px 12px", fontSize: 10, fontFamily: "var(--font-display)" }}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            onClick={handlePost}
            disabled={postPending || !text.trim()}
            className="btn-primary"
            style={{ marginLeft: "auto", padding: "4px 16px", fontSize: 11, fontFamily: "var(--font-display)" }}
          >
            {postPending ? "Posting..." : "Post"}
          </button>
        </div>
      </div>

      {postHash && (
        <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 8 }}>
          Post: <a href={`${EXPLORER}/tx/${postHash}`} target="_blank" rel="noreferrer" style={{ color: "var(--blue)" }}>{postHash.slice(0, 10)}...</a>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {posts.length === 0 && (
          <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0, fontFamily: "var(--font-display)" }}>
            No predictions yet. Be the first!
          </p>
        )}
        {posts.map((post) => (
          <div key={post.id.toString()} className="glass-card" style={{
            padding: 10, borderRadius: 8,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>
                {post.author.slice(0, 6)}...{post.author.slice(-4)}
              </span>
              <span style={{
                fontSize: 9, padding: "1px 6px", borderRadius: 3,
                background: "var(--green-dim)", color: "var(--green)",
                fontWeight: 700, fontFamily: "var(--font-display)",
              }}>
                {post.pick}
              </span>
            </div>
            <p style={{ margin: "4px 0", fontSize: 12, color: "var(--text-primary)" }}>
              {post.text}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button
                type="button"
                onClick={async () => { await upvote(post.id); onUpvote?.(); }}
                disabled={upvotePending}
                className="btn-outline"
                style={{ border: "none", fontSize: 11, padding: 0 }}
              >
                ▲ {post.upvotes.toString()}
              </button>
              {upvoteHash && (
                <a href={`${EXPLORER}/tx/${upvoteHash}`} target="_blank" rel="noreferrer" style={{ fontSize: 9, color: "var(--blue)" }}>
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
