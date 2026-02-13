import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import type { OrderStatus } from "@/db/schema";
import { and, desc, eq, gte, lte, sql } from "drizzle-orm";

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

function toNumber(value: unknown): number {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    return Number(value);
  }
  return 0;
}

export async function getReportData(startDate: Date, endDate: Date): Promise<ReportData> {
  const dateRangeFilter = and(gte(orders.createdAt, startDate), lte(orders.createdAt, endDate));

  const [
    summaryRows,
    salesTrendRows,
    orderTypeRows,
    topProductRows,
    orderStatusRows,
    recentOrdersRows,
  ] = await Promise.all([
    db
      .select({
        totalOrders: sql<number>`cast(count(*) as int)`,
        cancelledOrders: sql<number>`cast(sum(case when ${orders.status} = 'CANCELLED' then 1 else 0 end) as int)`,
        completedOrders: sql<number>`cast(sum(case when ${orders.status} = 'COMPLETED' then 1 else 0 end) as int)`,
        totalRevenue: sql<number>`coalesce(sum(case when ${orders.status} = 'COMPLETED' then ${orders.dealPrice} else 0 end), 0)`,
      })
      .from(orders)
      .where(dateRangeFilter),
    db
      .select({
        day: sql<Date>`date_trunc('day', ${orders.createdAt})`,
        revenue: sql<number>`coalesce(sum(${orders.dealPrice}), 0)`,
        orderCount: sql<number>`cast(count(*) as int)`,
      })
      .from(orders)
      .where(and(dateRangeFilter, eq(orders.status, "COMPLETED")))
      .groupBy(sql`date_trunc('day', ${orders.createdAt})`)
      .orderBy(sql`date_trunc('day', ${orders.createdAt}) asc`),
    db
      .select({
        isReadyStock: orderItems.isReadyStock,
        quantity: sql<number>`cast(sum(${orderItems.quantity}) as int)`,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(and(dateRangeFilter, eq(orders.status, "COMPLETED")))
      .groupBy(orderItems.isReadyStock),
    db
      .select({
        name: orderItems.productName,
        quantity: sql<number>`cast(sum(${orderItems.quantity}) as int)`,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(and(dateRangeFilter, eq(orders.status, "COMPLETED")))
      .groupBy(orderItems.productName)
      .orderBy(sql`sum(${orderItems.quantity}) desc`)
      .limit(5),
    db
      .select({
        status: orders.status,
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(orders)
      .where(dateRangeFilter)
      .groupBy(orders.status),
    db.query.orders.findMany({
      where: dateRangeFilter,
      columns: {
        id: true,
        invoiceNumber: true,
        customerName: true,
        createdAt: true,
        dealPrice: true,
        status: true,
      },
      orderBy: [desc(orders.createdAt)],
      limit: 10,
    }),
  ]);

  const summary = summaryRows[0] || {
    totalOrders: 0,
    cancelledOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  };

  const totalRevenue = toNumber(summary.totalRevenue);
  const totalOrders = toNumber(summary.totalOrders);
  const cancelledOrders = toNumber(summary.cancelledOrders);
  const completedOrders = toNumber(summary.completedOrders);
  const averageOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;

  const salesTrend: SalesTrend[] = salesTrendRows.map((row) => ({
    date: new Date(row.day).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    }),
    revenue: toNumber(row.revenue),
    orderCount: toNumber(row.orderCount),
  }));

  const orderTypeMap = new Map<boolean, number>();
  for (const row of orderTypeRows) {
    orderTypeMap.set(row.isReadyStock, toNumber(row.quantity));
  }

  const orderTypeStats: OrderTypeStat[] = [
    { isReadyStock: true, count: orderTypeMap.get(true) || 0, label: "Ready Stock" },
    { isReadyStock: false, count: orderTypeMap.get(false) || 0, label: "Custom Order" },
  ];

  const topProducts: TopProduct[] = topProductRows.map((row) => ({
    name: row.name,
    quantity: toNumber(row.quantity),
  }));

  const orderStatusMap = new Map<OrderStatus, number>();
  for (const row of orderStatusRows) {
    orderStatusMap.set(row.status, toNumber(row.count));
  }

  const orderStatusStats = ORDER_STATUSES.map((status) => ({
    status,
    count: orderStatusMap.get(status) || 0,
    label: status,
  }));

  const recentTransactions = recentOrdersRows.map((order) => ({
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
