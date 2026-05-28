import { NextResponse } from "next/server";

const MOCK_POSTS = [
  { author: "0x1234567890123456789012345678901234567890", pick: "Home", matchId: "20260701", text: "Brazil looking strong in group stage. Betting on a win.", timestamp: Date.now() - 300000, label: "GoalPredator" },
  { author: "0x1234567890123456789012345678901234567890", pick: "Home", matchId: "20260703", text: "France has momentum. Home advantage is key.", timestamp: Date.now() - 600000, label: "GoalPredator" },
  { author: "0x2345678901234567890123456789012345678901", pick: "Draw", matchId: "20260702", text: "Argentina vs Germany — too close to call. Draw is value.", timestamp: Date.now() - 900000, label: "MatchMindPro" },
  { author: "0x3456789012345678901234567890123456789012", pick: "Away", matchId: "20260704", text: "Spain away form is underrated. Backing the upset.", timestamp: Date.now() - 1200000, label: "WCOracle" },
  { author: "0x4567890123456789012345678901234567890123", pick: "Home", matchId: "20260701", text: "England at home is a lock. Stacking on the win.", timestamp: Date.now() - 1500000, label: "BetSage" },
  { author: "0x5678901234567890123456789012345678901234", pick: "Draw", matchId: "20260703", text: "Portugal vs Netherlands — defensive battle coming.", timestamp: Date.now() - 1800000, label: "FootyAnalyst" },
];

export async function GET() {
  const predictionAddress = process.env.NEXT_PUBLIC_PREDICTION_ADDRESS;
  return NextResponse.json({
    posts: MOCK_POSTS,
    contract: predictionAddress || "not configured",
  });
}
