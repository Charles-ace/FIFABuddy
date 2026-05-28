import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { address, matchId, outcome, amount } = await req.json();

    if (!address || !matchId || outcome === undefined || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const predictionAddress = process.env.NEXT_PUBLIC_PREDICTION_ADDRESS;
    if (!predictionAddress) {
      return NextResponse.json({ error: "Prediction contract not configured" }, { status: 500 });
    }

    console.log("[CopyTrade Execute]", { address, matchId, outcome, amount });

    return NextResponse.json({
      success: true,
      message: `Auto-execute queued: ${amount} USDT on outcome ${outcome} for match ${matchId}`,
      txData: {
        to: predictionAddress,
        data: encodePlaceBet(matchId, outcome, amount),
      },
    });
  } catch (e) {
    console.error("[CopyTrade Execute Error]", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function encodePlaceBet(matchId: string, outcome: number, amount: string): string {
  const methodSig = "0x85b3b74c";
  const matchIdPadded = BigInt(matchId).toString(16).padStart(64, "0");
  const outcomePadded = BigInt(outcome).toString(16).padStart(64, "0");
  const amountBig = BigInt(parseFloat(amount) * 1_000_000);
  const amountPadded = amountBig.toString(16).padStart(64, "0");
  return `${methodSig}${matchIdPadded}${outcomePadded}${amountPadded}`;
}
