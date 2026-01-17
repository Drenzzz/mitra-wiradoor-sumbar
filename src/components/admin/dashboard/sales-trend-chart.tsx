import { getSalesTrend } from "@/app/(admin)/admin/data";
import { DashboardSalesTrend } from "@/app/(admin)/admin/dashboard-view";

export async function SalesTrendChart() {
  const data = await getSalesTrend();
  return <DashboardSalesTrend data={data} />;
}
