import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

// ANTHROPIC_API_KEY stays server-side only
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "" });

export async function POST(req: NextRequest) {
  try {
    const { fixture, poolOdds, communityPosts, topAnalysts } = await req.json();

    const homeTeam = fixture.team1 || fixture.home;
    const awayTeam = fixture.team2 || fixture.away;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      system: `You are FIFABuddy, a World Cup 2026 AI prediction agent on X Layer.
You receive match data, on-chain pool totals, community sentiment, and top analyst consensus.
When analyst consensus is strong and aligned with the market, prefer a BUY signal for that side if the data supports it.
Respond ONLY with a valid JSON object. No markdown. No explanation outside JSON.
Format exactly: 
{ "signal": "BUY" | "HOLD" | "AVOID", "pick": "string", "confidence": number, "reasoning": "max 2 sentences" }`,
      messages: [
        {
          role: "user",
          content: `Match: ${homeTeam} vs ${awayTeam}
Date: ${fixture.date}
On-chain pool (USDT): Home=${poolOdds.home}, Draw=${poolOdds.draw}, Away=${poolOdds.away}
Top community picks: ${JSON.stringify(communityPosts?.slice(0, 5) ?? [])}
Top analyst bets: ${JSON.stringify(topAnalysts?.slice(0, 5) ?? [])}
What is your signal?`,
        },
      ],
    });

    const text = (response.content[0] as { type: string; text: string }).text;

    try {
      return NextResponse.json(JSON.parse(text));
    } catch {
      // If the response is wrapped in markdown or not formatted properly, attempt manual extraction or fallback
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          return NextResponse.json(JSON.parse(match[0]));
        } catch {
          // ignore
        }
      }
      return NextResponse.json({
        signal: "HOLD",
        pick: "Insufficient data",
        confidence: 50,
        reasoning: text,
      });
    }
  } catch (err: any) {
    return NextResponse.json(
      {
        signal: "HOLD",
        pick: "Error fetching signal",
        confidence: 0,
        reasoning: err.message || "Failed to generate AI insights.",
      },
      { status: 500 }
    );
  }
}
