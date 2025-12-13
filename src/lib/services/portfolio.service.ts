import { db } from "@/db";
import { portfolioItems, portfolioCategories } from "@/db/schema";
import { eq, ilike, desc, asc, and, count, SQL } from "drizzle-orm";

export type GetPortfolioOptions = {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  sort?: string;
};

export async function getPortfolioItems(options: GetPortfolioOptions = {}) {
  const { page = 1, limit = 10, search, categoryId, sort = "createdAt-desc" } = options;
  const offset = (page - 1) * limit;

  const conditions: SQL[] = [];

  if (search) {
    conditions.push(ilike(portfolioItems.title, `%${search}%`));
  }

  if (categoryId && categoryId !== "all") {
    conditions.push(eq(portfolioItems.portfolioCategoryId, categoryId));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  let orderByClause: SQL | undefined;
  if (sort) {
    const [field, direction] = sort.split("-");
    if (field === "createdAt") {
      orderByClause = direction === "asc" ? asc(portfolioItems.createdAt) : desc(portfolioItems.createdAt);
    } else if (field === "title") {
      orderByClause = direction === "asc" ? asc(portfolioItems.title) : desc(portfolioItems.title);
    }
  }
  if (!orderByClause) {
    orderByClause = desc(portfolioItems.createdAt);
  }

  const [items, countResult] = await Promise.all([
    db.query.portfolioItems.findMany({
      where: whereClause,
      with: {
        category: {
          columns: { name: true },
        },
      },
      orderBy: orderByClause,
      offset,
      limit,
    }),
    db.select({ count: count() }).from(portfolioItems).where(whereClause),
  ]);

  return {
    data: items,
    totalCount: countResult[0].count,
    totalPages: Math.ceil(countResult[0].count / limit),
    currentPage: page,
  };
}

export async function getPortfolioItemById(id: string) {
  return db.query.portfolioItems.findFirst({
    where: eq(portfolioItems.id, id),
    with: {
      category: true,
    },
  });
}

export async function createPortfolioItem(data: typeof portfolioItems.$inferInsert) {
  const result = await db.insert(portfolioItems).values(data).returning();
  return result[0];
}

export async function updatePortfolioItem(id: string, data: Partial<typeof portfolioItems.$inferInsert>) {
  const result = await db
    .update(portfolioItems)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(portfolioItems.id, id))
    .returning();
  return result[0];
}

export async function deletePortfolioItem(id: string) {
  const result = await db.delete(portfolioItems).where(eq(portfolioItems.id, id)).returning();
  return result[0];
}
