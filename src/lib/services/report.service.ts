import prisma from "@/lib/prisma";
import { ReportData, SalesTrend, TopProduct, OrderTypeStat } from "@/types";
import { OrderStatus } from "@prisma/client";

export async function getReportData(startDate: Date, endDate: Date): Promise<ReportData> {
  const orders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const completedOrders = orders.filter((o) => o.status === "COMPLETED");

  const totalRevenue = completedOrders.reduce((acc, curr) => acc + (curr.dealPrice || 0), 0);
  const totalOrders = orders.length;
  const cancelledOrders = orders.filter((o) => o.status === "CANCELLED").length;
  const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

  const salesTrendMap = new Map<string, { revenue: number; count: number }>();

  completedOrders.forEach((order) => {
    const dateKey = order.createdAt.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });

    const current = salesTrendMap.get(dateKey) || { revenue: 0, count: 0 };
    salesTrendMap.set(dateKey, {
      revenue: current.revenue + (order.dealPrice || 0),
      count: current.count + 1,
    });
  });

  const salesTrend: SalesTrend[] = Array.from(salesTrendMap.entries())
    .map(([date, data]) => ({
      date,
      revenue: data.revenue,
      orderCount: data.count,
    }))
    .reverse();

  let readyStockCount = 0;
  let customOrderCount = 0;
  const productCountMap = new Map<string, number>();

  completedOrders.forEach((order) => {
    order.items.forEach((item) => {
      if (item.isReadyStock) {
        readyStockCount += item.quantity;
      } else {
        customOrderCount += item.quantity;
      }

      const currentQty = productCountMap.get(item.productName) || 0;
      productCountMap.set(item.productName, currentQty + item.quantity);
    });
  });

  const orderTypeStats: OrderTypeStat[] = [
    { isReadyStock: true, count: readyStockCount, label: "Ready Stock" },
    { isReadyStock: false, count: customOrderCount, label: "Custom Order" },
  ];

  const topProducts: TopProduct[] = Array.from(productCountMap.entries())
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const orderStatusStats = Object.values(OrderStatus).map((status) => {
    return {
      status,
      count: orders.filter((o) => o.status === status).length,
      label: status,
    };
  });

  const recentTransactions = orders.slice(0, 10).map((order) => ({
    id: order.id,
    invoiceNumber: order.invoiceNumber,
    customerName: order.customerName,
    date: order.createdAt,
    amount: order.dealPrice || 0,
    status: order.status,
  }));

  return {
    summary: {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      cancelledOrders,
    },
    salesTrend,
    orderTypeStats,
    topProducts,
    orderStatusStats,
    recentTransactions,
  };
}
