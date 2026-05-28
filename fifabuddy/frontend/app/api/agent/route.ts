import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { fixture, poolOdds, communityPosts } = await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (apiKey) {
    try {
      const { default: Anthropic } = await import("@anthropic-ai/sdk");
      const anthropic = new Anthropic({ apiKey });
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
    } catch {
      return NextResponse.json(localAnalysis(fixture, poolOdds, communityPosts));
    }
  }

  return NextResponse.json(localAnalysis(fixture, poolOdds, communityPosts));
}

function localAnalysis(
  fixture: { team1: string; team2: string },
  poolOdds: { home: string; draw: string; away: string },
  communityPosts?: { pick: string }[],
) {
  const home = Number(poolOdds.home) / 1_000_000;
  const draw = Number(poolOdds.draw) / 1_000_000;
  const away = Number(poolOdds.away) / 1_000_000;
  const total = home + draw + away || 1;

  const homeProb = home / total;
  const drawProb = draw / total;
  const awayProb = away / total;

  const communityCounts: Record<string, number> = {};
  if (communityPosts) {
    for (const p of communityPosts) {
      communityCounts[p.pick] = (communityCounts[p.pick] || 0) + 1;
    }
  }
  const comTotal = Object.values(communityCounts).reduce((a, b) => a + b, 0) || 1;

  const comHome = ((communityCounts["Home"] || 0) + (communityCounts["1"] || 0)) / comTotal;
  const comAway = ((communityCounts["Away"] || 0) + (communityCounts["3"] || 0)) / comTotal;

  const homeScore = homeProb * 0.5 + comHome * 0.3 + (homeProb > 0.45 ? 0.2 : 0);
  const awayScore = awayProb * 0.5 + comAway * 0.3 + (awayProb > 0.45 ? 0.2 : 0);
  const drawScore = drawProb * 0.5 + 0.15;

  const best = Math.max(homeScore, drawScore, awayScore);
  const margin = best - (homeScore + drawScore + awayScore - best) / 2;

  let signal: "BUY" | "HOLD" | "AVOID";
  let confidence: number;
  let pick: string;

  if (margin > 0.12 && best > 0.35) {
    signal = "BUY";
    confidence = Math.min(Math.round(margin * 100 + 55), 94);
  } else if (margin > 0.05) {
    signal = "HOLD";
    confidence = Math.min(Math.round(margin * 100 + 45), 75);
  } else {
    signal = "AVOID";
    confidence = Math.min(Math.round((1 - margin) * 40 + 45), 75);
  }

  if (homeScore >= drawScore && homeScore >= awayScore) {
    pick = fixture.team1;
  } else if (awayScore >= homeScore && awayScore >= drawScore) {
    pick = fixture.team2;
  } else {
    pick = "Draw";
  }

  const reasonMap = {
    BUY: `${pick} shows strong pool support with ${Math.round(best * 100)}% probability edge. Favorable odds and community alignment.`,
    HOLD: `Mixed signals for ${pick}. Pool distribution is balanced. Waiting for clearer momentum.`,
    AVOID: `Low confidence in this match. Pool is evenly split with no clear edge. Better opportunities elsewhere.`,
  };

  return { signal, pick, confidence, reasoning: reasonMap[signal] };
}
