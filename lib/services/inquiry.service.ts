import prisma from "@/lib/prisma";
import type { InquiryFormValues } from "@/lib/validations/inquiry.schema";
import { Prisma, InquiryStatus } from "@prisma/client";

export type GetInquiriesOptions = {
  status?: InquiryStatus;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
};

export const createInquiry = (data: InquiryFormValues) => {
  return prisma.inquiry.create({
    data: {
      ...data,
    },
  });
};

export const getInquiries = async (options: GetInquiriesOptions = {}) => {
  const { status, search, sort, page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;

  const whereClause: Prisma.InquiryWhereInput = {};
  if (status) {
    whereClause.status = status;
  }
  if (search) {
    whereClause.OR = [{ senderName: { contains: search, mode: "insensitive" } }, { senderEmail: { contains: search, mode: "insensitive" } }, { subject: { contains: search, mode: "insensitive" } }];
  }

  const [sortField, sortOrder] = sort?.split("-") || ["createdAt", "desc"];
  const orderByClause = { [sortField]: sortOrder };

  const [inquiries, totalCount] = await prisma.$transaction([
    prisma.inquiry.findMany({
      where: whereClause,
      orderBy: orderByClause,
      skip,
      take: limit,
    }),
    prisma.inquiry.count({ where: whereClause }),
  ]);

  return { data: inquiries, totalCount };
};

export const updateInquiryStatus = (id: string, status: InquiryStatus) => {
  return prisma.inquiry.update({
    where: { id: id },
    data: { status: status },
  });
};
