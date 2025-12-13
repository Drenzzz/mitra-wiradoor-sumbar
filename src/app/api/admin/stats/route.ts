import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { products, categories, articles, inquiries, orders } from "@/db/schema";
import { count, eq, isNull, sum, gte } from "drizzle-orm";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const [productsResult, categoriesResult, articlesResult, inquiriesResult] = await Promise.all([
      db.select({ count: count() }).from(products).where(isNull(products.deletedAt)),
      db.select({ count: count() }).from(categories).where(isNull(categories.deletedAt)),
      db.select({ count: count() }).from(articles).where(eq(articles.status, "PUBLISHED")),
      db.select({ count: count() }).from(inquiries).where(eq(inquiries.status, "NEW")),
    ]);

    const productsCount = productsResult[0].count;
    const categoriesCount = categoriesResult[0].count;
    const articlesCount = articlesResult[0].count;
    const inquiriesCount = inquiriesResult[0].count;

    const revenueResult = await db
      .select({ total: sum(orders.dealPrice) })
      .from(orders)
      .where(eq(orders.status, "COMPLETED"));

    const totalRevenue = Number(revenueResult[0]?.total) || 0;

    const ordersByStatus = await db.query.orders.findMany({
      columns: { status: true },
    });

    const statusCounts = new Map<string, number>();
    ordersByStatus.forEach((order) => {
      const current = statusCounts.get(order.status) || 0;
      statusCounts.set(order.status, current + 1);
    });

    const orderStatusDistribution = Array.from(statusCounts.entries()).map(([status, count]) => ({
      status,
      count,
    }));

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const recentOrders = await db.query.orders.findMany({
      where: eq(orders.status, "COMPLETED"),
      columns: {
        dealPrice: true,
        createdAt: true,
      },
      orderBy: (orders, { asc }) => [asc(orders.createdAt)],
    });

    const monthlyRevenueMap = new Map<string, number>();
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
      monthlyRevenueMap.set(key, 0);
    }

    recentOrders
      .filter((order) => order.createdAt >= sixMonthsAgo)
      .forEach((order) => {
        const key = new Date(order.createdAt).toLocaleDateString("id-ID", { month: "short", year: "numeric" });
        if (monthlyRevenueMap.has(key)) {
          const current = monthlyRevenueMap.get(key) || 0;
          monthlyRevenueMap.set(key, current + (order.dealPrice || 0));
        }
      });

    const salesTrend = Array.from(monthlyRevenueMap.entries()).map(([name, total]) => ({
      name,
      total,
    }));

    return NextResponse.json({
      counts: {
        products: productsCount,
        categories: categoriesCount,
        articles: articlesCount,
        inquiries: inquiriesCount,
      },
      revenue: {
        total: totalRevenue,
      },
      charts: {
        orderStatus: orderStatusDistribution,
        salesTrend: salesTrend,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics stats:", error);
    return NextResponse.json({ error: "Gagal mengambil data statistik" }, { status: 500 });
  }
}
