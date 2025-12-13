import { db } from "@/db";
import { portfolioCategories } from "@/db/schema";
import { eq, ilike, isNull, isNotNull, desc, asc, and, count, SQL } from "drizzle-orm";

export type PortfolioCategoryDto = {
  name: string;
  description?: string;
};

export type GetPortfolioCategoriesOptions = {
  status?: "active" | "trashed";
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
};

export const getPortfolioCategories = async (options: GetPortfolioCategoriesOptions = {}) => {
  const { status = "active", search, sort, page = 1, limit = 10 } = options;
  const offset = (page - 1) * limit;

  const conditions: SQL[] = [];

  if (status === "trashed") {
    conditions.push(isNotNull(portfolioCategories.deletedAt));
  } else {
    conditions.push(isNull(portfolioCategories.deletedAt));
  }

  if (search) {
    conditions.push(ilike(portfolioCategories.name, `%${search}%`));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  let orderByClause: SQL | undefined;
  if (sort) {
    const [field, order] = sort.split("-");
    if (field === "name") {
      orderByClause = order === "asc" ? asc(portfolioCategories.name) : desc(portfolioCategories.name);
    } else if (field === "createdAt") {
      orderByClause = order === "asc" ? asc(portfolioCategories.createdAt) : desc(portfolioCategories.createdAt);
    }
  }
  if (!orderByClause) {
    orderByClause = asc(portfolioCategories.name);
  }

  const [data, countResult] = await Promise.all([
    db.query.portfolioCategories.findMany({
      where: whereClause,
      orderBy: orderByClause,
      offset,
      limit,
    }),
    db.select({ count: count() }).from(portfolioCategories).where(whereClause),
  ]);

  return { data, totalCount: countResult[0].count };
};

export const createPortfolioCategory = async (data: PortfolioCategoryDto) => {
  const existing = await db.query.portfolioCategories.findFirst({
    where: eq(portfolioCategories.name, data.name),
  });

  if (existing) {
    if (existing.deletedAt) {
      const result = await db
        .update(portfolioCategories)
        .set({
          ...data,
          deletedAt: null,
          updatedAt: new Date(),
        })
        .where(eq(portfolioCategories.id, existing.id))
        .returning();
      return result[0];
    }
    throw new Error("CATEGORY_EXISTS");
  }

  const result = await db
    .insert(portfolioCategories)
    .values({
      name: data.name,
      description: data.description,
      deletedAt: null,
    })
    .returning();

  return result[0];
};

export const updatePortfolioCategoryById = async (id: string, data: Partial<PortfolioCategoryDto>) => {
  const result = await db
    .update(portfolioCategories)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(portfolioCategories.id, id))
    .returning();

  return result[0];
};

export const softDeletePortfolioCategoryById = async (id: string) => {
  const result = await db.update(portfolioCategories).set({ deletedAt: new Date(), updatedAt: new Date() }).where(eq(portfolioCategories.id, id)).returning();

  return result[0];
};

export const restorePortfolioCategoryById = async (id: string) => {
  const result = await db.update(portfolioCategories).set({ deletedAt: null, updatedAt: new Date() }).where(eq(portfolioCategories.id, id)).returning();

  return result[0];
};

export const permanentDeletePortfolioCategoryById = async (id: string) => {
  const result = await db.delete(portfolioCategories).where(eq(portfolioCategories.id, id)).returning();

  return result[0];
};
