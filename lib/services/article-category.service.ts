import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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
  const skip = (page - 1) * limit;

  const whereClause: Prisma.ArticleCategoryWhereInput = {};
  whereClause.deletedAt = status === "trashed" ? { not: null } : null;

  if (search) {
    whereClause.name = { contains: search, mode: "insensitive" };
  }

  const [sortField, sortOrder] = sort?.split("-") || ["name", "asc"];
  const orderByClause = { [sortField]: sortOrder };

  const [categories, totalCount] = await prisma.$transaction([
    prisma.articleCategory.findMany({
      where: whereClause,
      orderBy: orderByClause,
      skip,
      take: limit,
    }),
    prisma.articleCategory.count({ where: whereClause }),
  ]);

  return { data: categories, totalCount };
};

export const createArticleCategory = (data: ArticleCategoryDto) => {
  return prisma.articleCategory.create({
    data: { ...data, deletedAt: null },
  });
};

export const updateArticleCategoryById = (id: string, data: ArticleCategoryDto) => {
  return prisma.articleCategory.update({
    where: { id },
    data,
  });
};

export const softDeleteArticleCategoryById = (id: string) => {
  return prisma.articleCategory.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

// Fungsi untuk memulihkan dari sampah
export const restoreArticleCategoryById = (id: string) => {
  return prisma.articleCategory.update({
    where: { id },
    data: { deletedAt: null },
  });
};

// Fungsi untuk menghapus permanen
export const permanentDeleteArticleCategoryById = (id: string) => {
  return prisma.articleCategory.delete({
    where: { id },
  });
};
