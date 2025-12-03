import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type ArticleDto = {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  featuredImageUrl: string;
  status: "PUBLISHED" | "DRAFT";
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
  const skip = (page - 1) * limit;

  const whereClause: Prisma.ArticleWhereInput = {};
  whereClause.deletedAt = status === "trashed" ? { not: null } : null;

  if (search) {
    whereClause.OR = [{ title: { contains: search, mode: "insensitive" } }, { content: { contains: search, mode: "insensitive" } }];
  }
  if (categoryId) {
    whereClause.categoryId = categoryId;
  }
  if (statusFilter && status === "active") {
    whereClause.status = statusFilter as "DRAFT" | "PUBLISHED";
  }

  const [sortField, sortOrder] = sort?.split("-") || ["createdAt", "desc"];
  const orderByClause = { [sortField]: sortOrder };

  const [articles, totalCount] = await prisma.$transaction([
    prisma.article.findMany({
      where: whereClause,
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } },
      },
      orderBy: orderByClause,
      skip,
      take: limit,
    }),
    prisma.article.count({ where: whereClause }),
  ]);

  return { data: articles, totalCount };
};

export const createArticle = (data: ArticleDto) => {
  const slug = data.slug || data.title.toLowerCase().replace(/\s+/g, "-").slice(0, 50);
  return prisma.article.create({
    data: { ...data, slug, deletedAt: null },
  });
};

export const getArticleById = (id: string) => {
  return prisma.article.findUnique({
    where: { id },
    include: {
      author: { select: { name: true } },
      category: { select: { name: true } },
    },
  });
};

export const updateArticleById = (id: string, data: Partial<ArticleDto>) => {
  return prisma.article.update({
    where: { id },
    data,
  });
};

export const softDeleteArticleById = (id: string) => {
  return prisma.article.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

export const restoreArticleById = (id: string) => {
  return prisma.article.update({
    where: { id },
    data: { deletedAt: null },
  });
};

export const permanentDeleteArticleById = (id: string) => {
  return prisma.article.delete({
    where: { id },
  });
};
