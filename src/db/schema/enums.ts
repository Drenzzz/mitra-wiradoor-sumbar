import { pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["ADMIN", "STAF"]);
export const inquiryStatusEnum = pgEnum("inquiry_status", ["NEW", "READ", "REPLIED"]);
export const articleStatusEnum = pgEnum("article_status", ["PUBLISHED", "DRAFT"]);
export const orderStatusEnum = pgEnum("order_status", ["PENDING", "PROCESSED", "SHIPPED", "COMPLETED", "CANCELLED"]);

export type Role = (typeof roleEnum.enumValues)[number];
export type InquiryStatus = (typeof inquiryStatusEnum.enumValues)[number];
export type ArticleStatus = (typeof articleStatusEnum.enumValues)[number];
export type OrderStatus = (typeof orderStatusEnum.enumValues)[number];
