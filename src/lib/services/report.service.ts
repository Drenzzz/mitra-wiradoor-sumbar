import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import type { OrderStatus } from "@/db/schema";
import { eq, gte, lte, and } from "drizzle-orm";

export type ReportData = {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    cancelledOrders: number;
  };
  salesTrend: SalesTrend[];
  orderTypeStats: OrderTypeStat[];
  topProducts: TopProduct[];
  orderStatusStats: { status: OrderStatus; count: number; label: string }[];
  recentTransactions: {
    id: string;
    invoiceNumber: string;
    customerName: string;
    date: Date;
    amount: number;
    status: OrderStatus;
  }[];
};

export type SalesTrend = {
  date: string;
  revenue: number;
  orderCount: number;
};

export type TopProduct = {
  name: string;
  quantity: number;
};

export type OrderTypeStat = {
  isReadyStock: boolean;
  count: number;
  label: string;
};

const ORDER_STATUSES: OrderStatus[] = ["PENDING", "PROCESSED", "SHIPPED", "COMPLETED", "CANCELLED"];

export async function getReportData(startDate: Date, endDate: Date): Promise<ReportData> {
  const ordersData = await db.query.orders.findMany({
    where: and(gte(orders.createdAt, startDate), lte(orders.createdAt, endDate)),
    with: {
      items: true,
    },
    orderBy: (orders, { desc }) => [desc(orders.createdAt)],
  });

  const completedOrders = ordersData.filter((o) => o.status === "COMPLETED");

  const totalRevenue = completedOrders.reduce((acc, curr) => acc + (curr.dealPrice || 0), 0);
  const totalOrders = ordersData.length;
  const cancelledOrders = ordersData.filter((o) => o.status === "CANCELLED").length;
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

  const orderStatusStats = ORDER_STATUSES.map((status) => {
    return {
      status,
      count: ordersData.filter((o) => o.status === status).length,
      label: status,
    };
  });

  const recentTransactions = ordersData.slice(0, 10).map((order) => ({
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
