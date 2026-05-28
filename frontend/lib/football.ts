import "server-only";

const OPEN_FOOTBALL_URL =
  "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

const RAPIDAPI_HOST = "api-football-v1.p.rapidapi.com";
const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY ?? "";
const WC_2026_LEAGUE_ID = 1;

export type FootballFixture = {
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
  liveScore?: {
    home: number | null;
    away: number | null;
    minute: number | null;
    status: string | null;
  } | null;
};

type OpenFootballMatch = {
  round: string;
  date: string;
  time: string;
  team1: string;
  team2: string;
  group?: string;
  ground: string;
  score?: {
    ft?: [number, number];
  };
};

type OpenFootballResponse = {
  name?: string;
  matches?: OpenFootballMatch[];
};

type ApiFootballFixture = {
  teams: {
    home: { name: string };
    away: { name: string };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  fixture: {
    status: {
      elapsed: number | null;
      short: string | null;
    };
  };
};

type ApiFootballResponse<T> = {
  response?: T;
};

const cache = new Map<string, { data: unknown; ts: number }>();
const TTL = {
  fixtures: 3600_000,
  live: 60_000,
  standings: 300_000,
  lineups: 300_000,
} as const;

function createTimeoutSignal(timeoutMs = 5_000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeoutId),
  };
}

async function cached<T>(key: string, ttl: number, fetcher: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < ttl) {
    return hit.data as T;
  }

  const data = await fetcher();
  cache.set(key, { data, ts: Date.now() });
  return data;
}

function fallbackOdds(index: number) {
  const seed = 0.12 + index * 0.07;
  return {
    home: (2.05 + seed).toFixed(2),
    draw: (3.08 + seed / 2).toFixed(2),
    away: (2.88 + seed * 1.15).toFixed(2),
  };
}

export async function getWC2026Fixtures(): Promise<FootballFixture[]> {
  return cached("wc_fixtures", TTL.fixtures, async () => {
    const timeout = createTimeoutSignal();
    const res = await fetch(OPEN_FOOTBALL_URL, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 },
      signal: timeout.signal,
    }).finally(timeout.clear);

    if (!res.ok) {
      throw new Error(`OpenFootball request failed: ${res.status} ${res.statusText}`);
    }

    const json = (await res.json()) as OpenFootballResponse;
    const matches = Array.isArray(json.matches) ? json.matches : [];

    return matches.map((match, index) => {
      const homeScore = match.score?.ft?.[0];
      const awayScore = match.score?.ft?.[1];
      const hasFinalScore = typeof homeScore === "number" && typeof awayScore === "number";

      return {
        id: 2026000 + index + 1,
        round: match.group ?? match.round,
        date: match.date,
        time: match.time,
        home: match.team1,
        away: match.team2,
        venue: match.ground,
        status: hasFinalScore ? "FT" : "UPCOMING",
        score: hasFinalScore ? [homeScore, awayScore] : undefined,
        odds: fallbackOdds(index),
        liveScore: null,
      };
    });
  });
}

export async function getLiveMatches(): Promise<ApiFootballFixture[]> {
  if (!RAPIDAPI_KEY) {
    return [];
  }

  return cached("live_matches", TTL.live, async () => {
    const timeout = createTimeoutSignal();
    const res = await fetch(
      `https://${RAPIDAPI_HOST}/v3/fixtures?live=all&league=${WC_2026_LEAGUE_ID}&season=2026`,
      {
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST,
        },
        next: { revalidate: 60 },
        signal: timeout.signal,
      }
    ).finally(timeout.clear);

    if (!res.ok) {
      throw new Error(`API-Football live request failed: ${res.status} ${res.statusText}`);
    }

    const json = (await res.json()) as ApiFootballResponse<ApiFootballFixture>;
    return Array.isArray(json.response) ? json.response : [];
  });
}

export async function getUpcomingFixtures(nextCount = 10): Promise<ApiFootballFixture[]> {
  if (!RAPIDAPI_KEY) {
    return [];
  }

  return cached(`upcoming_${nextCount}`, TTL.fixtures, async () => {
    const timeout = createTimeoutSignal();
    const res = await fetch(
      `https://${RAPIDAPI_HOST}/v3/fixtures?league=${WC_2026_LEAGUE_ID}&season=2026&next=${nextCount}`,
      {
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST,
        },
        next: { revalidate: 3600 },
        signal: timeout.signal,
      }
    ).finally(timeout.clear);

    if (!res.ok) {
      throw new Error(`API-Football upcoming request failed: ${res.status} ${res.statusText}`);
    }

    const json = (await res.json()) as ApiFootballResponse<ApiFootballFixture>;
    return Array.isArray(json.response) ? json.response : [];
  });
}

export async function getStandings(): Promise<unknown[]> {
  if (!RAPIDAPI_KEY) {
    return [];
  }

  return cached("standings", TTL.standings, async () => {
    const timeout = createTimeoutSignal();
    const res = await fetch(
      `https://${RAPIDAPI_HOST}/v3/standings?league=${WC_2026_LEAGUE_ID}&season=2026`,
      {
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST,
        },
        next: { revalidate: 300 },
        signal: timeout.signal,
      }
    ).finally(timeout.clear);

    if (!res.ok) {
      throw new Error(`API-Football standings request failed: ${res.status} ${res.statusText}`);
    }

    const json = (await res.json()) as ApiFootballResponse<unknown>;
    return Array.isArray(json.response) ? json.response : [];
  });
}

export async function getLineups(fixtureId: number): Promise<unknown[]> {
  if (!RAPIDAPI_KEY) {
    return [];
  }

  return cached(`lineups_${fixtureId}`, TTL.lineups, async () => {
    const timeout = createTimeoutSignal();
    const res = await fetch(
      `https://${RAPIDAPI_HOST}/v3/fixtures/lineups?fixture=${fixtureId}`,
      {
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST,
        },
        next: { revalidate: 300 },
        signal: timeout.signal,
      }
    ).finally(timeout.clear);

    if (!res.ok) {
      throw new Error(`API-Football lineups request failed: ${res.status} ${res.statusText}`);
    }

    const json = (await res.json()) as ApiFootballResponse<unknown>;
    return Array.isArray(json.response) ? json.response : [];
  });
}

export async function getMergedFixtures(): Promise<FootballFixture[]> {
  const [staticFixtures, liveMatches] = await Promise.all([
    getWC2026Fixtures(),
    getLiveMatches().catch(() => []),
  ]);

  return staticFixtures.map((fixture, index) => {
    const live = liveMatches.find(
      (match) =>
        match.teams.home.name === fixture.home || match.teams.away.name === fixture.away
    );

    return {
      ...fixture,
      liveScore: live
        ? {
            home: live.goals.home,
            away: live.goals.away,
            minute: live.fixture.status.elapsed,
            status: live.fixture.status.short,
          }
        : null,
      status: live ? "LIVE" : fixture.status,
      odds: fixture.odds ?? fallbackOdds(index),
    };
  });
}

export async function getFootballDashboardData() {
  const [fixtures, standings] = await Promise.all([
    getMergedFixtures(),
    getStandings().catch(() => []),
  ]);

  return {
    fixtures,
    standings,
  };
}
