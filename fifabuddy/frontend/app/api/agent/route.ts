import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { fixture, poolOdds, communityPosts } = await req.json();

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 300,
    system: `You are MatchMind, a World Cup 2026 AI prediction agent on X Layer.
You receive match data, on-chain pool totals, and community sentiment.
Respond ONLY with a valid JSON object. No markdown. No explanation outside JSON.
Format exactly: 
{ "signal": "BUY" | "HOLD" | "AVOID", "pick": "string", "confidence": number, "reasoning": "max 2 sentences" }`,
    messages: [
      {
        role: "user",
        content: `Match: ${fixture.team1} vs ${fixture.team2}
Date: ${fixture.date}
On-chain pool (USDT): Home=${poolOdds.home}, Draw=${poolOdds.draw}, Away=${poolOdds.away}
Top community picks: ${JSON.stringify(communityPosts?.slice(0, 5) ?? [])}
What is your signal?`,
      },
    ],
  });

  const text = (response.content[0] as { type: string; text: string }).text;

  try {
    return NextResponse.json(JSON.parse(text));
  } catch {
    return NextResponse.json({
      signal: "HOLD",
      pick: "Insufficient data",
      confidence: 50,
      reasoning: text,
    });
  }
}
