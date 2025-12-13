import { db } from "@/db";
import { articles, articleCategories, users } from "@/db/schema";
import { eq, ilike, isNull, isNotNull, or, desc, asc, and, count, SQL } from "drizzle-orm";
import type { ArticleStatus } from "@/db/schema";

export type ArticleDto = {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  featuredImageUrl: string;
  status: ArticleStatus;
  authorId: string;
  categoryId: string;
};

export type GetArticlesOptions = {
  status?: "active" | "trashed";
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  categoryId?: string;
  statusFilter?: string;
};

export const getArticles = async (options: GetArticlesOptions = {}) => {
  const { status = "active", search, sort, page = 1, limit = 10, categoryId, statusFilter } = options;
  const offset = (page - 1) * limit;

  const conditions: SQL[] = [];

  if (status === "trashed") {
    conditions.push(isNotNull(articles.deletedAt));
  } else {
    conditions.push(isNull(articles.deletedAt));
  }

  if (search) {
    conditions.push(or(ilike(articles.title, `%${search}%`), ilike(articles.content, `%${search}%`))!);
  }

  if (categoryId) {
    conditions.push(eq(articles.categoryId, categoryId));
  }

  if (statusFilter && status === "active") {
    conditions.push(eq(articles.status, statusFilter as ArticleStatus));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  let orderByClause: SQL | undefined;
  if (sort) {
    const [field, order] = sort.split("-");
    if (field === "title") {
      orderByClause = order === "asc" ? asc(articles.title) : desc(articles.title);
    } else if (field === "createdAt") {
      orderByClause = order === "asc" ? asc(articles.createdAt) : desc(articles.createdAt);
    }
  }
  if (!orderByClause) {
    orderByClause = desc(articles.createdAt);
  }

  const [data, countResult] = await Promise.all([
    db.query.articles.findMany({
      where: whereClause,
      with: {
        author: { columns: { name: true } },
        category: { columns: { name: true } },
      },
      orderBy: orderByClause,
      offset,
      limit,
    }),
    db.select({ count: count() }).from(articles).where(whereClause),
  ]);

  return { data, totalCount: countResult[0].count };
};

export const createArticle = async (data: ArticleDto) => {
  const slug = data.slug || data.title.toLowerCase().replace(/\s+/g, "-").slice(0, 50);

  const result = await db
    .insert(articles)
    .values({
      title: data.title,
      slug,
      content: data.content,
      excerpt: data.excerpt,
      featuredImageUrl: data.featuredImageUrl,
      status: data.status,
      authorId: data.authorId,
      categoryId: data.categoryId,
      deletedAt: null,
    })
    .returning();

  return result[0];
};

export const getArticleById = async (id: string) => {
  return db.query.articles.findFirst({
    where: eq(articles.id, id),
    with: {
      author: { columns: { name: true } },
      category: { columns: { name: true } },
    },
  });
};

export const getArticleBySlug = async (slug: string) => {
  return db.query.articles.findFirst({
    where: eq(articles.slug, slug),
    with: {
      author: { columns: { name: true } },
      category: { columns: { name: true } },
    },
  });
};

export const updateArticleById = async (id: string, data: Partial<ArticleDto>) => {
  const result = await db
    .update(articles)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(articles.id, id))
    .returning();

  return result[0];
};

export const softDeleteArticleById = async (id: string) => {
  const result = await db.update(articles).set({ deletedAt: new Date(), updatedAt: new Date() }).where(eq(articles.id, id)).returning();

  return result[0];
};

export const restoreArticleById = async (id: string) => {
  const result = await db.update(articles).set({ deletedAt: null, updatedAt: new Date() }).where(eq(articles.id, id)).returning();

  return result[0];
};

export const permanentDeleteArticleById = async (id: string) => {
  const result = await db.delete(articles).where(eq(articles.id, id)).returning();

  return result[0];
};
