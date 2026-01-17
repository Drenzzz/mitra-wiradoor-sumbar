import { getOrderStatusDistribution } from "@/app/(admin)/admin/data";
import { DashboardOrderStatus } from "@/app/(admin)/admin/dashboard-view";

export async function OrderStatusChart() {
  const data = await getOrderStatusDistribution();
  return <DashboardOrderStatus data={data} />;
}
