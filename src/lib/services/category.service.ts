import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq, ilike, isNull, isNotNull, or, desc, asc, and, count, SQL } from "drizzle-orm";

export type CategoryDto = {
  name: string;
  description?: string;
};

export type GetCategoriesOptions = {
  status?: "active" | "trashed";
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
};

export const getCategories = async (options: GetCategoriesOptions = {}) => {
  const { status = "active", search, sort, page = 1, limit = 10 } = options;
  const offset = (page - 1) * limit;

  const conditions: SQL[] = [];

  if (status === "trashed") {
    conditions.push(isNotNull(categories.deletedAt));
  } else {
    conditions.push(isNull(categories.deletedAt));
  }

  if (search) {
    conditions.push(or(ilike(categories.name, `%${search}%`), ilike(categories.description, `%${search}%`))!);
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  let orderByClause: SQL | undefined;
  if (sort) {
    const [field, order] = sort.split("-");
    if (field === "name") {
      orderByClause = order === "asc" ? asc(categories.name) : desc(categories.name);
    } else if (field === "createdAt") {
      orderByClause = order === "asc" ? asc(categories.createdAt) : desc(categories.createdAt);
    }
  }
  if (!orderByClause) {
    orderByClause = asc(categories.name);
  }

  const [data, countResult] = await Promise.all([
    db.query.categories.findMany({
      where: whereClause,
      orderBy: orderByClause,
      offset,
      limit,
    }),
    db.select({ count: count() }).from(categories).where(whereClause),
  ]);

  return { data, totalCount: countResult[0].count };
};

export const createCategory = async (data: CategoryDto) => {
  const result = await db
    .insert(categories)
    .values({
      name: data.name,
      description: data.description,
      deletedAt: null,
    })
    .returning();

  return result[0];
};

export const updateCategoryById = async (id: string, data: CategoryDto) => {
  const result = await db
    .update(categories)
    .set({
      name: data.name,
      description: data.description,
      updatedAt: new Date(),
    })
    .where(eq(categories.id, id))
    .returning();

  return result[0];
};

export const softDeleteCategoryById = async (id: string) => {
  const result = await db.update(categories).set({ deletedAt: new Date(), updatedAt: new Date() }).where(eq(categories.id, id)).returning();

  return result[0];
};

export const restoreCategoryById = async (id: string) => {
  const result = await db.update(categories).set({ deletedAt: null, updatedAt: new Date() }).where(eq(categories.id, id)).returning();

  return result[0];
};

export const permanentDeleteCategoryById = async (id: string) => {
  const result = await db.delete(categories).where(eq(categories.id, id)).returning();

  return result[0];
};
