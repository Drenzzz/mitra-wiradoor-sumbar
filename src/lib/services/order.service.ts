import prisma from "@/lib/prisma";
import { Prisma, OrderStatus } from "@prisma/client";

export const getOrderById = (id: string) => {
  const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);

  if (!isValidObjectId) {
    return null;
  }

  return prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        select: {
          productName: true,
          isReadyStock: true,
          quantity: true,
        },
      },
    },
  });
};

export type GetOrdersOptions = {
  status?: OrderStatus;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
};

export const getOrders = async (options: GetOrdersOptions = {}) => {
  const { status, search, sort, page = 1, limit = 10, startDate, endDate } = options;
  const skip = (page - 1) * limit;

  const whereClause: Prisma.OrderWhereInput = {};

  if (status) {
    whereClause.status = status;
  }

  if (startDate && endDate) {
    whereClause.createdAt = {
      gte: startDate,
      lte: endDate,
    };
  } else if (startDate) {
    whereClause.createdAt = {
      gte: startDate,
    };
  } else if (endDate) {
    whereClause.createdAt = {
      lte: endDate,
    };
  }

  if (search) {
    whereClause.OR = [{ customerName: { contains: search, mode: "insensitive" } }, { customerEmail: { contains: search, mode: "insensitive" } }, { invoiceNumber: { contains: search, mode: "insensitive" } }];
  }

  const [sortField, sortOrder] = sort?.split("-") || ["createdAt", "desc"];
  const orderByClause = { [sortField]: sortOrder };

  const [orders, totalCount] = await prisma.$transaction([
    prisma.order.findMany({
      where: whereClause,
      include: {
        items: {
          take: 1,
          select: { productName: true },
        },
      },
      orderBy: orderByClause,
      skip,
      take: limit,
    }),
    prisma.order.count({ where: whereClause }),
  ]);

  return { data: orders, totalCount };
};

export const updateOrder = (id: string, data: Prisma.OrderUpdateInput) => {
  const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
  if (!isValidObjectId) {
    throw new Error("Format Order ID tidak valid.");
  }

  return prisma.order.update({
    where: { id: id },
    data: data,
  });
};
