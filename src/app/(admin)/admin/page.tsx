import { getDashboardStats } from "./data";
import { DashboardView } from "./dashboard-view";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const data = await getDashboardStats();

  return <DashboardView data={data} userName={session.user?.name} />;
}
