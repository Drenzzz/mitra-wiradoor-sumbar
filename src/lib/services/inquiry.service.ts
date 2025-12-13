import { db } from "@/db";
import { inquiries } from "@/db/schema";
import type { InquiryStatus } from "@/db/schema";
import type { InquiryFormValues } from "@/lib/validations/inquiry.schema";
import { eq, ilike, or, desc, asc, and, count, SQL } from "drizzle-orm";

export type GetInquiriesOptions = {
  status?: InquiryStatus;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
};

export const createInquiry = async (data: InquiryFormValues) => {
  const result = await db
    .insert(inquiries)
    .values({
      senderName: data.senderName,
      senderEmail: data.senderEmail,
      senderPhone: data.senderPhone,
      subject: data.subject,
      message: data.message,
    })
    .returning();

  return result[0];
};

export const getInquiries = async (options: GetInquiriesOptions = {}) => {
  const { status, search, sort, page = 1, limit = 10 } = options;
  const offset = (page - 1) * limit;

  const conditions: SQL[] = [];

  if (status) {
    conditions.push(eq(inquiries.status, status));
  }

  if (search) {
    conditions.push(or(ilike(inquiries.senderName, `%${search}%`), ilike(inquiries.senderEmail, `%${search}%`), ilike(inquiries.subject, `%${search}%`))!);
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  let orderByClause: SQL | undefined;
  if (sort) {
    const [field, order] = sort.split("-");
    if (field === "createdAt") {
      orderByClause = order === "asc" ? asc(inquiries.createdAt) : desc(inquiries.createdAt);
    } else if (field === "senderName") {
      orderByClause = order === "asc" ? asc(inquiries.senderName) : desc(inquiries.senderName);
    }
  }
  if (!orderByClause) {
    orderByClause = desc(inquiries.createdAt);
  }

  const [data, countResult] = await Promise.all([
    db.query.inquiries.findMany({
      where: whereClause,
      orderBy: orderByClause,
      offset,
      limit,
    }),
    db.select({ count: count() }).from(inquiries).where(whereClause),
  ]);

  return { data, totalCount: countResult[0].count };
};

export const updateInquiryStatus = async (id: string, status: InquiryStatus) => {
  const result = await db.update(inquiries).set({ status }).where(eq(inquiries.id, id)).returning();

  return result[0];
};
