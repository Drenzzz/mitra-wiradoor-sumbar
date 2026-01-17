import { getDashboardCounts, getRevenue } from "@/app/(admin)/admin/data";
import { DashboardStats } from "@/app/(admin)/admin/dashboard-view";

export async function StatsOverview() {
  const [counts, revenue] = await Promise.all([getDashboardCounts(), getRevenue()]);
  return <DashboardStats counts={counts} revenue={revenue} />;
}
