import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { products, categories, articles, inquiries, orders } from "@/db/schema";
import { count, eq, isNull, sum, gte } from "drizzle-orm";


export const getDashboardCounts = async () => {
  const [productsResult, categoriesResult, articlesResult, inquiriesResult] = await Promise.all([
    db.select({ count: count() }).from(products).where(isNull(products.deletedAt)),
    db.select({ count: count() }).from(categories).where(isNull(categories.deletedAt)),
    db.select({ count: count() }).from(articles).where(eq(articles.status, "PUBLISHED")),
    db.select({ count: count() }).from(inquiries).where(eq(inquiries.status, "NEW")),
  ]);

  return {
    products: productsResult[0].count,
    categories: categoriesResult[0].count,
    articles: articlesResult[0].count,
    inquiries: inquiriesResult[0].count,
  };
};

export const getRevenue = async () => {
  const revenueResult = await db
    .select({ total: sum(orders.dealPrice) })
    .from(orders)
    .where(eq(orders.status, "COMPLETED"));
  return {
    total: Number(revenueResult[0]?.total) || 0,
  };
};

export const getOrderStatusDistribution = unstable_cache(
  async () => {
    const ordersByStatus = await db.query.orders.findMany({
      columns: { status: true },
    });

    const statusCounts = new Map<string, number>();
    ordersByStatus.forEach((order) => {
      const current = statusCounts.get(order.status) || 0;
      statusCounts.set(order.status, current + 1);
    });

    return Array.from(statusCounts.entries()).map(([status, count]) => ({
      status,
      count,
    }));
  },
  ["dashboard-order-status"],
  { revalidate: 60, tags: ["dashboard-stats"] }
);

export const getSalesTrend = unstable_cache(
  async () => {
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

    return Array.from(monthlyRevenueMap.entries()).map(([name, total]) => ({
      name,
      total,
    }));
  },
  ["dashboard-sales-trend"],
  { revalidate: 60, tags: ["dashboard-stats"] }
);

