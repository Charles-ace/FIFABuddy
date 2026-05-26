export type Fixture = {
  id: number;
  round: string;
  date: string;
  time: string;
  home: string;
  away: string;
  venue: string;
  status: "LIVE" | "UPCOMING" | "FT";
  minute?: number;
  score?: [number, number];
  odds: {
    home: string;
    draw: string;
    away: string;
  };
};

export type Analyst = {
  handle: string;
  wallet: string;
  winRate: string;
  pnl: string;
  confidence: number;
};

export type CommunityPost = {
  author: string;
  match: string;
  text: string;
  pick: string;
  votes: number;
  age: string;
};

export const fixtures: Fixture[] = [
  {
    id: 2026001,
    round: "GROUP A",
    date: "Jun 11, 2026",
    time: "20:00 UTC",
    home: "Mexico",
    away: "South Africa",
    venue: "Estadio Azteca",
    status: "UPCOMING",
    odds: { home: "2.17", draw: "3.14", away: "3.02" },
  },
  {
    id: 2026002,
    round: "GROUP A",
    date: "Jun 11, 2026",
    time: "20:00 UTC",
    home: "Korea Republic",
    away: "UEFA Path D",
    venue: "Estadio Akron",
    status: "UPCOMING",
    odds: { home: "1.95", draw: "3.28", away: "3.45" },
  },
  {
    id: 2026003,
    round: "GROUP B",
    date: "Jun 12, 2026",
    time: "18:00 UTC",
    home: "Canada",
    away: "Qatar",
    venue: "BMO Field",
    status: "UPCOMING",
    odds: { home: "2.08", draw: "3.20", away: "3.55" },
  },
];

export const analysts: Analyst[] = [
  {
    handle: "AlphaWhale.eth",
    wallet: "0x7a4...91bc",
    winRate: "71%",
    pnl: "+12.4K USDT",
    confidence: 94,
  },
  {
    handle: "TacticianX",
    wallet: "0x2f8...44da",
    winRate: "64%",
    pnl: "+8.1K USDT",
    confidence: 88,
  },
  {
    handle: "PitchOracle",
    wallet: "0x1ab...c9ef",
    winRate: "59%",
    pnl: "+5.7K USDT",
    confidence: 81,
  },
];

export const communityPosts: CommunityPost[] = [
  {
    author: "neonstriker",
    match: "Mexico vs South Africa",
    text: "Mexico are controlling the central spaces and the market is underpricing their late-game edge.",
    pick: "Mexico ML",
    votes: 128,
    age: "2m ago",
  },
  {
    author: "statline_11",
    match: "Korea Republic vs UEFA Path D",
    text: "This looks like a tight tempo game. I'm leaning under and a split bankroll on the draw.",
    pick: "Draw",
    votes: 84,
    age: "7m ago",
  },
  {
    author: "worldcup_dna",
    match: "Canada vs Qatar",
    text: "Canada's compact press should suppress the first-half shot volume. Waiting for a better live entry.",
    pick: "Under 2.5",
    votes: 73,
    age: "11m ago",
  },
];

export const signal = {
  signal: "BUY" as const,
  pick: "Mexico ML",
  confidence: 87,
  reasoning:
    "Analyst wallets are clustered on the home side, the community is aligned, and the current pool still leaves upside in the favorite. The model likes the live state but would reduce size if the minute jumps above 75.",
};
