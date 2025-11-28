import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { PortfolioItemFormValues } from "@/lib/validations/portfolio.schema";

export type GetPortfolioItemsOptions = {
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  categoryId?: string;
};

export const getPortfolioItems = async (options: GetPortfolioItemsOptions = {}) => {
  const { search, sort, page = 1, limit = 10, categoryId } = options;
  const skip = (page - 1) * limit;

  const whereClause: Prisma.PortfolioItemWhereInput = {};

  if (search) {
    whereClause.OR = [{ title: { contains: search, mode: "insensitive" } }, { description: { contains: search, mode: "insensitive" } }];
  }

  if (categoryId) {
    whereClause.portfolioCategoryId = categoryId;
  }

  const [sortField, sortOrder] = sort?.split("-") || ["projectDate", "desc"];
  const orderByClause = { [sortField]: sortOrder };

  const [items, totalCount] = await prisma.$transaction([
    prisma.portfolioItem.findMany({
      where: whereClause,
      include: { category: { select: { name: true } } },
      orderBy: orderByClause,
      skip,
      take: limit,
    }),
    prisma.portfolioItem.count({ where: whereClause }),
  ]);

  return { data: items, totalCount };
};

export const getPortfolioItemById = (id: string) => {
  const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
  if (!isValidObjectId) return null;

  return prisma.portfolioItem.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true } },
    },
  });
};

export const createPortfolioItem = (data: PortfolioItemFormValues) => {
  return prisma.portfolioItem.create({
    data: {
      ...data,
      portfolioCategoryId: data.portfolioCategoryId || null,
    },
  });
};

export const updatePortfolioItemById = (id: string, data: Partial<PortfolioItemFormValues>) => {
  return prisma.portfolioItem.update({
    where: { id },
    data: {
      ...data,
      portfolioCategoryId: data.portfolioCategoryId || null,
    },
  });
};

export const deletePortfolioItemById = (id: string) => {
  return prisma.portfolioItem.delete({
    where: { id },
  });
};
