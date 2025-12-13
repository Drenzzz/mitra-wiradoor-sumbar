import { db } from "@/db";
import { articleCategories } from "@/db/schema";
import { eq, ilike, isNull, isNotNull, desc, asc, and, count, SQL } from "drizzle-orm";

export type ArticleCategoryDto = {
  name: string;
  description?: string;
};

export type GetArticleCategoriesOptions = {
  status?: "active" | "trashed";
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
};

export const getArticleCategories = async (options: GetArticleCategoriesOptions = {}) => {
  const { status = "active", search, sort, page = 1, limit = 10 } = options;
  const offset = (page - 1) * limit;

  const conditions: SQL[] = [];

  if (status === "trashed") {
    conditions.push(isNotNull(articleCategories.deletedAt));
  } else {
    conditions.push(isNull(articleCategories.deletedAt));
  }

  if (search) {
    conditions.push(ilike(articleCategories.name, `%${search}%`));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  let orderByClause: SQL | undefined;
  if (sort) {
    const [field, order] = sort.split("-");
    if (field === "name") {
      orderByClause = order === "asc" ? asc(articleCategories.name) : desc(articleCategories.name);
    } else if (field === "createdAt") {
      orderByClause = order === "asc" ? asc(articleCategories.createdAt) : desc(articleCategories.createdAt);
    }
  }
  if (!orderByClause) {
    orderByClause = asc(articleCategories.name);
  }

  const [data, countResult] = await Promise.all([
    db.query.articleCategories.findMany({
      where: whereClause,
      orderBy: orderByClause,
      offset,
      limit,
    }),
    db.select({ count: count() }).from(articleCategories).where(whereClause),
  ]);

  return { data, totalCount: countResult[0].count };
};

export const createArticleCategory = async (data: ArticleCategoryDto) => {
  const result = await db
    .insert(articleCategories)
    .values({
      name: data.name,
      description: data.description,
      deletedAt: null,
    })
    .returning();

  return result[0];
};

export const updateArticleCategoryById = async (id: string, data: ArticleCategoryDto) => {
  const result = await db
    .update(articleCategories)
    .set({
      name: data.name,
      description: data.description,
      updatedAt: new Date(),
    })
    .where(eq(articleCategories.id, id))
    .returning();

  return result[0];
};

export const softDeleteArticleCategoryById = async (id: string) => {
  const result = await db.update(articleCategories).set({ deletedAt: new Date(), updatedAt: new Date() }).where(eq(articleCategories.id, id)).returning();

  return result[0];
};

export const restoreArticleCategoryById = async (id: string) => {
  const result = await db.update(articleCategories).set({ deletedAt: null, updatedAt: new Date() }).where(eq(articleCategories.id, id)).returning();

  return result[0];
};

export const permanentDeleteArticleCategoryById = async (id: string) => {
  const result = await db.delete(articleCategories).where(eq(articleCategories.id, id)).returning();

  return result[0];
};
