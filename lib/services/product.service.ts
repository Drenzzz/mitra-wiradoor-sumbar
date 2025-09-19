import prisma from "@/lib/prisma";
import { Prisma } from '@prisma/client';

export type ProductDto = {
  name: string;
  description: string;
  specifications: string;
  imageUrl: string;
  categoryId: string;
};

export type GetProductsOptions = {
  status?: 'active' | 'trashed';
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
};


export const getProducts = async (options: GetProductsOptions = {}) => {
  const { status = 'active', search, sort, page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;

  const whereClause: Prisma.ProductWhereInput = {};
  whereClause.deletedAt = status === 'trashed' ? { not: null } : null;

  if (search) {
    whereClause.name = { contains: search, mode: 'insensitive' };
  }

  const [sortField, sortOrder] = sort?.split('-') || ['name', 'asc'];
  const orderByClause = { [sortField]: sortOrder };

  const [products, totalCount] = await prisma.$transaction([
    prisma.product.findMany({
      where: whereClause,
      include: { // Sertakan data kategori
        category: {
          select: { name: true },
        },
      },
      orderBy: orderByClause,
      skip,
      take: limit,
    }),
    prisma.product.count({ where: whereClause }),
  ]);

  return { data: products, totalCount };
};

export const getProductById = (id: string) => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: {
        select: { id: true, name: true },
      },
    },
  });
};

export const createProduct = (data: ProductDto) => {
  return prisma.product.create({
    data: { ...data, deletedAt: null },
  });
};

export const updateProductById = (id: string, data: Partial<ProductDto>) => {
  return prisma.product.update({
    where: { id },
    data,
  });
};

export const softDeleteProductById = (id: string) => {
  return prisma.product.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

export const restoreProductById = (id: string) => {
  return prisma.product.update({
    where: { id },
    data: { deletedAt: null },
  });
};

export const permanentDeleteProductById = (id: string) => {
  return prisma.product.delete({
    where: { id },
  });
};
