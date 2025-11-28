import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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
  const skip = (page - 1) * limit;

  const whereClause: Prisma.CategoryWhereInput = {};
  whereClause.deletedAt = status === "trashed" ? { not: null } : null;

  if (search) {
    whereClause.OR = [{ name: { contains: search, mode: "insensitive" } }, { description: { contains: search, mode: "insensitive" } }];
  }

  const [sortField, sortOrder] = sort?.split("-") || ["name", "asc"];
  const orderByClause = { [sortField]: sortOrder };

  const [categories, totalCount] = await prisma.$transaction([
    prisma.category.findMany({
      where: whereClause,
      orderBy: orderByClause,
      skip,
      take: limit,
    }),
    prisma.category.count({ where: whereClause }),
  ]);

  return { data: categories, totalCount };
};

export const createCategory = (data: CategoryDto) => {
  return prisma.category.create({
    data: { ...data, deletedAt: null },
  });
};

export const updateCategoryById = (id: string, data: CategoryDto) => {
  return prisma.category.update({
    where: { id },
    data,
  });
};

export const softDeleteCategoryById = (id: string) => {
  return prisma.category.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

export const restoreCategoryById = (id: string) => {
  return prisma.category.update({
    where: { id },
    data: { deletedAt: null },
  });
};

export const permanentDeleteCategoryById = (id: string) => {
  return prisma.category.delete({
    where: { id },
  });
};
