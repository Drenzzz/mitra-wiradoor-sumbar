import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import type { OrderStatus } from "@/db/schema";
import { eq, ilike, or, desc, asc, and, count, gte, lte, SQL } from "drizzle-orm";

export const getOrderById = async (id: string) => {
  const isValidUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);

  if (!isValidUUID) {
    return null;
  }

  return db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: {
      items: {
        columns: {
          productName: true,
          isReadyStock: true,
          quantity: true,
        },
      },
    },
  });
};

export type GetOrdersOptions = {
  status?: OrderStatus;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
};

export const getOrders = async (options: GetOrdersOptions = {}) => {
  const { status, search, sort, page = 1, limit = 10, startDate, endDate } = options;
  const offset = (page - 1) * limit;

  const conditions: SQL[] = [];

  if (status) {
    conditions.push(eq(orders.status, status));
  }

  if (startDate && endDate) {
    conditions.push(gte(orders.createdAt, startDate));
    conditions.push(lte(orders.createdAt, endDate));
  } else if (startDate) {
    conditions.push(gte(orders.createdAt, startDate));
  } else if (endDate) {
    conditions.push(lte(orders.createdAt, endDate));
  }

  if (search) {
    conditions.push(or(ilike(orders.customerName, `%${search}%`), ilike(orders.customerEmail, `%${search}%`), ilike(orders.invoiceNumber, `%${search}%`))!);
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  let orderByClause: SQL | undefined;
  if (sort) {
    const [field, order] = sort.split("-");
    if (field === "createdAt") {
      orderByClause = order === "asc" ? asc(orders.createdAt) : desc(orders.createdAt);
    } else if (field === "customerName") {
      orderByClause = order === "asc" ? asc(orders.customerName) : desc(orders.customerName);
    }
  }
  if (!orderByClause) {
    orderByClause = desc(orders.createdAt);
  }

  const [data, countResult] = await Promise.all([
    db.query.orders.findMany({
      where: whereClause,
      with: {
        items: {
          columns: { productName: true },
          limit: 1,
        },
      },
      orderBy: orderByClause,
      offset,
      limit,
    }),
    db.select({ count: count() }).from(orders).where(whereClause),
  ]);

  return { data, totalCount: countResult[0].count };
};

export const updateOrder = async (id: string, data: Partial<typeof orders.$inferInsert>) => {
  const isValidUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
  if (!isValidUUID) {
    throw new Error("Format Order ID tidak valid.");
  }

  const result = await db
    .update(orders)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, id))
    .returning();

  return result[0];
};
