import { FixturesOverview } from "@/components/FixturesOverview";
import { getFootballDashboardData } from "@/lib/football";
import { fixtures as fallbackFixtures } from "@/lib/mockData";

export default async function FixturesPage() {
  const data = await getFootballDashboardData().catch(() => ({
    fixtures: fallbackFixtures,
    standings: [],
  }));

  return <FixturesOverview fixtures={data.fixtures.length > 0 ? data.fixtures : fallbackFixtures} />;
}
