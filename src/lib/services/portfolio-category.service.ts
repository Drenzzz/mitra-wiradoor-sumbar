import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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
  const skip = (page - 1) * limit;

  const whereClause: Prisma.PortfolioCategoryWhereInput = {};
  whereClause.deletedAt = status === "trashed" ? { not: null } : null;

  if (search) {
    whereClause.name = { contains: search, mode: "insensitive" };
  }

  const [sortField, sortOrder] = sort?.split("-") || ["name", "asc"];
  const orderByClause = { [sortField]: sortOrder };

  const [categories, totalCount] = await prisma.$transaction([
    prisma.portfolioCategory.findMany({
      where: whereClause,
      orderBy: orderByClause,
      skip,
      take: limit,
    }),
    prisma.portfolioCategory.count({ where: whereClause }),
  ]);

  return { data: categories, totalCount };
};

export const createPortfolioCategory = (data: PortfolioCategoryDto) => {
  return prisma.portfolioCategory.create({
    data: { ...data, deletedAt: null },
  });
};

export const updatePortfolioCategoryById = (id: string, data: Partial<PortfolioCategoryDto>) => {
  return prisma.portfolioCategory.update({
    where: { id },
    data,
  });
};

export const softDeletePortfolioCategoryById = (id: string) => {
  return prisma.portfolioCategory.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

export const restorePortfolioCategoryById = (id: string) => {
  return prisma.portfolioCategory.update({
    where: { id },
    data: { deletedAt: null },
  });
};

export const permanentDeletePortfolioCategoryById = (id: string) => {
  return prisma.portfolioCategory.delete({
    where: { id },
  });
};
