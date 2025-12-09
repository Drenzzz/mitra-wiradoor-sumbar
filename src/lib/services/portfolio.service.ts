import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type GetPortfolioOptions = {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  sort?: string;
};

export async function getPortfolioItems(options: GetPortfolioOptions = {}) {
  const { page = 1, limit = 10, search, categoryId, sort = "createdAt-desc" } = options;

  const whereClause: Prisma.PortfolioItemWhereInput = {
    AND: [
      search
        ? {
            title: { contains: search, mode: "insensitive" },
          }
        : {},
      categoryId && categoryId !== "all"
        ? {
            portfolioCategoryId: categoryId,
          }
        : {},
    ],
  };

  const orderByClause: Prisma.PortfolioItemOrderByWithRelationInput = {};
  if (sort) {
    const [field, direction] = sort.split("-");
    const sortField = field === "createdAt" ? "createdAt" : "title";
    const sortOrder = direction === "asc" ? "asc" : "desc";

    orderByClause[sortField] = sortOrder;
  }

  const [items, totalCount] = await Promise.all([
    prisma.portfolioItem.findMany({
      where: whereClause,
      include: {
        category: {
          select: { name: true },
        },
      },
      orderBy: orderByClause,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.portfolioItem.count({
      where: whereClause,
    }),
  ]);

  return {
    data: items,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
}

export async function getPortfolioItemById(id: string) {
  return await prisma.portfolioItem.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });
}

export async function createPortfolioItem(data: any) {
  return await prisma.portfolioItem.create({
    data,
  });
}

export async function updatePortfolioItem(id: string, data: any) {
  return await prisma.portfolioItem.update({
    where: { id },
    data,
  });
}

export async function deletePortfolioItem(id: string) {
  return await prisma.portfolioItem.delete({
    where: { id },
  });
}
