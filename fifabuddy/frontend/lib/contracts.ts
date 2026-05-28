export const PREDICTION_ADDRESS =
  (process.env.NEXT_PUBLIC_PREDICTION_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const COMMUNITY_ADDRESS =
  (process.env.NEXT_PUBLIC_COMMUNITY_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const USDT_ADDRESS =
  (process.env.NEXT_PUBLIC_USDT_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const PREDICTION_ABI = [
  {
    type: "constructor",
    inputs: [
      { name: "_usdt", internalType: "address", type: "address" },
      { name: "_feeRecipient", internalType: "address", type: "address" },
    ],
    stateMutability: "nonpayable",
  },
  { type: "error", inputs: [{ name: "owner", internalType: "address", type: "address" }], name: "OwnableInvalidOwner" },
  { type: "error", inputs: [{ name: "account", internalType: "address", type: "address" }], name: "OwnableUnauthorizedAccount" },
  { type: "error", inputs: [], name: "ReentrancyGuardReentrantCall" },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "matchId", internalType: "uint256", type: "uint256", indexed: true },
      { name: "user", internalType: "address", type: "address", indexed: true },
      { name: "outcome", internalType: "uint8", type: "uint8", indexed: false },
      { name: "amount", internalType: "uint256", type: "uint256", indexed: false },
    ],
    name: "BetPlaced",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "matchId", internalType: "uint256", type: "uint256", indexed: true },
      { name: "home", internalType: "string", type: "string", indexed: false },
      { name: "away", internalType: "string", type: "string", indexed: false },
      { name: "deadline", internalType: "uint256", type: "uint256", indexed: false },
    ],
    name: "MarketCreated",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "matchId", internalType: "uint256", type: "uint256", indexed: true },
      { name: "result", internalType: "uint8", type: "uint8", indexed: false },
    ],
    name: "MatchResolved",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "previousOwner", internalType: "address", type: "address", indexed: true },
      { name: "newOwner", internalType: "address", type: "address", indexed: true },
    ],
    name: "OwnershipTransferred",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "matchId", internalType: "uint256", type: "uint256", indexed: true },
      { name: "user", internalType: "address", type: "address", indexed: true },
      { name: "amount", internalType: "uint256", type: "uint256", indexed: false },
    ],
    name: "WinningsClaimed",
  },
  {
    type: "function",
    inputs: [],
    name: "FEE_BPS",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "matchId", internalType: "uint256", type: "uint256" }, { name: "outcome", internalType: "uint8", type: "uint8" }, { name: "amount", internalType: "uint256", type: "uint256" }],
    name: "placeBet",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "matchId", internalType: "uint256", type: "uint256" }, { name: "result", internalType: "uint8", type: "uint8" }],
    name: "resolveMatch",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "matchId", internalType: "uint256", type: "uint256" }],
    name: "claimWinnings",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "matchId", internalType: "uint256", type: "uint256" },
      { name: "homeTeam", internalType: "string", type: "string" },
      { name: "awayTeam", internalType: "string", type: "string" },
      { name: "deadline", internalType: "uint256", type: "uint256" },
    ],
    name: "createMarket",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "matchId", internalType: "uint256", type: "uint256" }],
    name: "getOdds",
    outputs: [
      { name: "home", internalType: "uint256", type: "uint256" },
      { name: "draw", internalType: "uint256", type: "uint256" },
      { name: "away", internalType: "uint256", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "matchId", internalType: "uint256", type: "uint256" }, { name: "user", internalType: "address", type: "address" }],
    name: "getUserBet",
    outputs: [
      { name: "home", internalType: "uint256", type: "uint256" },
      { name: "draw", internalType: "uint256", type: "uint256" },
      { name: "away", internalType: "uint256", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "matchId", internalType: "uint256", type: "uint256" }],
    name: "markets",
    outputs: [
      { name: "homeTeam", internalType: "string", type: "string" },
      { name: "awayTeam", internalType: "string", type: "string" },
      { name: "deadline", internalType: "uint256", type: "uint256" },
      { name: "result", internalType: "uint8", type: "uint8" },
      { name: "status", internalType: "uint8", type: "uint8" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "owner",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "newOwner", internalType: "address", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "feeRecipient",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "usdt",
    outputs: [{ name: "", internalType: "contract IERC20", type: "address" }],
    stateMutability: "view",
  },
] as const;

export const COMMUNITY_ABI = [
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "postId", internalType: "uint256", type: "uint256", indexed: true },
      { name: "author", internalType: "address", type: "address", indexed: true },
      { name: "matchId", internalType: "uint256", type: "uint256", indexed: true },
      { name: "pick", internalType: "string", type: "string", indexed: false },
    ],
    name: "PredictionPosted",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "postId", internalType: "uint256", type: "uint256", indexed: true },
      { name: "voter", internalType: "address", type: "address", indexed: true },
    ],
    name: "Upvoted",
  },
  {
    type: "function",
    inputs: [{ name: "matchId", internalType: "uint256", type: "uint256" }, { name: "text", internalType: "string", type: "string" }, { name: "pick", internalType: "string", type: "string" }],
    name: "postPrediction",
    outputs: [{ name: "postId", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "postId", internalType: "uint256", type: "uint256" }],
    name: "upvote",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "matchId", internalType: "uint256", type: "uint256" }],
    name: "getMatchPosts",
    outputs: [{ name: "", internalType: "uint256[]", type: "uint256[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "postId", internalType: "uint256", type: "uint256" }],
    name: "getPost",
    outputs: [
      { name: "id", internalType: "uint256", type: "uint256" },
      { name: "author", internalType: "address", type: "address" },
      { name: "matchId", internalType: "uint256", type: "uint256" },
      { name: "text", internalType: "string", type: "string" },
      { name: "pick", internalType: "string", type: "string" },
      { name: "upvotes", internalType: "uint256", type: "uint256" },
      { name: "timestamp", internalType: "uint256", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "postCount",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
] as const;

export const USDT_ABI = [
  {
    type: "function",
    inputs: [{ name: "to", internalType: "address", type: "address" }, { name: "amount", internalType: "uint256", type: "uint256" }],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "owner", internalType: "address", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "owner", internalType: "address", type: "address" },
      { name: "spender", internalType: "address", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "spender", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", internalType: "uint8", type: "uint8" }],
    stateMutability: "view",
  },
] as const;
