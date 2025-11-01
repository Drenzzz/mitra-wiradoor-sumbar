import prisma from "@/lib/prisma";
import type { InquiryFormValues } from "@/lib/validations/inquiry.schema";

export const createInquiry = (data: InquiryFormValues) => {
  return prisma.inquiry.create({
    data: {
      ...data,
    },
  });
};

