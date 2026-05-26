import { NextResponse } from "next/server";
import { getFootballDashboardData } from "@/lib/football";

export async function GET() {
  try {
    const data = await getFootballDashboardData();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown football data error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
