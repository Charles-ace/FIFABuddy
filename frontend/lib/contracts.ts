export const PREDICTION_ADDRESS = (process.env.NEXT_PUBLIC_PREDICTION_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;
export const COMMUNITY_BOARD_ADDRESS = (process.env.NEXT_PUBLIC_COMMUNITY_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;
export const USDT_ADDRESS = (process.env.NEXT_PUBLIC_USDT_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;
export const ANALYST_REGISTRY_ADDRESS = (process.env.NEXT_PUBLIC_REGISTRY_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const USDT_ABI = [
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" }
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "pure",
    type: "function"
  }
] as const;

export const PREDICTION_ABI = [
  {
    inputs: [
      { name: "_usdt", type: "address" },
      { name: "_feeRecipient", type: "address" }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [
      { name: "matchId", type: "uint256" },
      { name: "homeTeam", type: "string" },
      { name: "awayTeam", type: "string" },
      { name: "deadline", type: "uint256" }
    ],
    name: "createMarket",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { name: "matchId", type: "uint256" },
      { name: "outcome", type: "uint8" },
      { name: "amount", type: "uint256" }
    ],
    name: "placeBet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { name: "matchId", type: "uint256" },
      { name: "result", type: "uint8" }
    ],
    name: "resolveMatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "matchId", type: "uint256" }],
    name: "claimWinnings",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "matchId", type: "uint256" }],
    name: "cancelMarket",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "matchId", type: "uint256" }],
    name: "getOdds",
    outputs: [
      { name: "homeTotal", type: "uint256" },
      { name: "drawTotal", type: "uint256" },
      { name: "awayTotal", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { name: "matchId", type: "uint256" },
      { name: "user", type: "address" }
    ],
    name: "getUserBet",
    outputs: [
      { name: "home", type: "uint256" },
      { name: "draw", type: "uint256" },
      { name: "away", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "matchId", type: "uint256" }],
    name: "markets",
    outputs: [
      { name: "homeTeam", type: "string" },
      { name: "awayTeam", type: "string" },
      { name: "deadline", type: "uint256" },
      { name: "result", type: "uint8" },
      { name: "status", type: "uint8" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { name: "", type: "uint256" },
      { name: "", type: "address" }
    ],
    name: "claimed",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "usdt",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "feeRecipient",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "marketCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  }
] as const;

export const COMMUNITY_BOARD_ABI = [
  {
    inputs: [
      { name: "matchId", type: "uint256" },
      { name: "text", type: "string" },
      { name: "pick", type: "string" }
    ],
    name: "postPrediction",
    outputs: [{ name: "postId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "postId", type: "uint256" }],
    name: "upvote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "matchId", type: "uint256" }],
    name: "getMatchPosts",
    outputs: [{ name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "postId", type: "uint256" }],
    name: "getPost",
    outputs: [
      {
        components: [
          { name: "id", type: "uint256" },
          { name: "author", type: "address" },
          { name: "matchId", type: "uint256" },
          { name: "text", type: "string" },
          { name: "pick", type: "string" },
          { name: "upvotes", type: "uint256" },
          { name: "timestamp", type: "uint256" }
        ],
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "", type: "uint256" }],
    name: "posts",
    outputs: [
      { name: "id", type: "uint256" },
      { name: "author", type: "address" },
      { name: "matchId", type: "uint256" },
      { name: "text", type: "string" },
      { name: "pick", type: "string" },
      { name: "upvotes", type: "uint256" },
      { name: "timestamp", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "postCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  }
] as const;

export const ANALYST_REGISTRY_ABI = [
  {
    inputs: [{ name: "_contract", type: "address" }],
    name: "setPredictionContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "handle", type: "string" }],
    name: "register",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { name: "analyst", type: "address" },
      { name: "won", type: "bool" }
    ],
    name: "recordResult",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "analyst", type: "address" }],
    name: "getWinRate",
    outputs: [
      { name: "wins", type: "uint256" },
      { name: "total", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "limit", type: "uint256" }],
    name: "getLeaderboard",
    outputs: [{ name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "", type: "address" }],
    name: "analysts",
    outputs: [
      { name: "handle", type: "string" },
      { name: "wins", type: "uint256" },
      { name: "total", type: "uint256" },
      { name: "registered", type: "bool" },
      { name: "joinedAt", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  }
] as const;
