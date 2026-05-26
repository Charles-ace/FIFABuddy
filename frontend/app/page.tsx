import { Dashboard } from "@/components/Dashboard";
import { getFootballDashboardData } from "@/lib/football";
import { fixtures as fallbackFixtures } from "@/lib/mockData";

export default async function Page() {
  const data = await getFootballDashboardData().catch(() => ({
    fixtures: fallbackFixtures,
    standings: [],
  }));

  return <Dashboard fixtures={data.fixtures.length > 0 ? data.fixtures : fallbackFixtures} />;
}
