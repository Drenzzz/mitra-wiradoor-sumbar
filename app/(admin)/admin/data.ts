import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

export const getDashboardStats = unstable_cache(
  async () => {
    const [productsCount, categoriesCount, articlesCount, inquiriesCount] = await prisma.$transaction([
      prisma.product.count({ where: { deletedAt: null } }),
      prisma.category.count({ where: { deletedAt: null } }),
      prisma.article.count({ where: { status: "PUBLISHED", deletedAt: null } }),
      prisma.inquiry.count({ where: { status: "NEW" } }),
    ]);

    const revenueAgg = await prisma.order.aggregate({
      _sum: {
        dealPrice: true,
      },
      where: {
        status: "COMPLETED",
      },
    });
    const totalRevenue = revenueAgg._sum.dealPrice || 0;

    const ordersByStatus = await prisma.order.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    });

    const orderStatusDistribution = ordersByStatus.map((item) => ({
      status: item.status,
      count: item._count.id,
    }));

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const recentOrders = await prisma.order.findMany({
      where: {
        status: "COMPLETED",
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        dealPrice: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const monthlyRevenueMap = new Map<string, number>();
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
      monthlyRevenueMap.set(key, 0);
    }

    recentOrders.forEach((order) => {
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

    return {
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
    };
  },
  ["dashboard-stats"],
  { revalidate: 60, tags: ["dashboard-stats"] }
);
