const OPEN_FOOTBALL =
  "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

const RAPIDAPI_HOST = "api-football-v1.p.rapidapi.com";
const RAPIDAPI_KEY  = process.env.NEXT_PUBLIC_RAPIDAPI_KEY!;
const WC_LEAGUE_ID  = 1;
const WC_SEASON     = 2026;

const cache = new Map<string, { data: unknown; ts: number }>();

const TTL = {
  fixtures:  60 * 60 * 1000,
  live:      60 * 1000,
  standings: 5 * 60 * 1000,
};

async function withCache<T>(key: string, ttl: number, fn: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < ttl) return hit.data as T;
  const data = await fn();
  cache.set(key, { data, ts: Date.now() });
  return data;
}

function rapidHeaders() {
  return {
    "X-RapidAPI-Key": RAPIDAPI_KEY,
    "X-RapidAPI-Host": RAPIDAPI_HOST,
  };
}

export type OpenFootballMatch = {
  round: string;
  date: string;
  time: string;
  team1: string;
  team2: string;
  group?: string;
  ground: string;
  score?: { ft: [number, number]; ht?: [number, number] };
};

export type LiveMatchOverlay = {
  homeGoals: number;
  awayGoals: number;
  minute: number;
  status: string;
};

export type MergedFixture = OpenFootballMatch & {
  live: LiveMatchOverlay | null;
};

export async function getWCSchedule(): Promise<OpenFootballMatch[]> {
  return withCache("wc_schedule", TTL.fixtures, async () => {
    const res = await fetch(OPEN_FOOTBALL);
    const json = await res.json();
    return json.matches as OpenFootballMatch[];
  });
}

export async function getLiveMatches(): Promise<any[]> {
  return withCache("live", TTL.live, async () => {
    const res = await fetch(
      `https://${RAPIDAPI_HOST}/v3/fixtures?live=all&league=${WC_LEAGUE_ID}&season=${WC_SEASON}`,
      { headers: rapidHeaders() }
    );
    const json = await res.json();
    return json.response ?? [];
  });
}

export async function getUpcoming(next = 6): Promise<any[]> {
  return withCache(`upcoming_${next}`, TTL.fixtures, async () => {
    const res = await fetch(
      `https://${RAPIDAPI_HOST}/v3/fixtures?league=${WC_LEAGUE_ID}&season=${WC_SEASON}&next=${next}`,
      { headers: rapidHeaders() }
    );
    const json = await res.json();
    return json.response ?? [];
  });
}

export async function getStandings(): Promise<any[]> {
  return withCache("standings", TTL.standings, async () => {
    const res = await fetch(
      `https://${RAPIDAPI_HOST}/v3/standings?league=${WC_LEAGUE_ID}&season=${WC_SEASON}`,
      { headers: rapidHeaders() }
    );
    const json = await res.json();
    return json.response ?? [];
  });
}

export async function getMergedFixtures(): Promise<MergedFixture[]> {
  const [schedule, live] = await Promise.all([
    getWCSchedule(),
    getLiveMatches().catch(() => [] as any[]),
  ]);

  return schedule.map((f) => {
    const liveMatch = (live as any[]).find(
      (m) =>
        m.teams?.home?.name === f.team1 ||
        m.teams?.away?.name === f.team2
    );
    return {
      ...f,
      live: liveMatch
        ? {
            homeGoals: liveMatch.goals?.home ?? 0,
            awayGoals: liveMatch.goals?.away ?? 0,
            minute: liveMatch.fixture?.status?.elapsed ?? 0,
            status: liveMatch.fixture?.status?.short ?? "",
          }
        : null,
    };
  });
}
