import { pgTable, text, timestamp, uuid, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const portfolioCategories = pgTable("portfolio_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").unique().notNull(),
  description: text("description"),
  deletedAt: timestamp("deleted_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const portfolioItems = pgTable(
  "portfolio_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    imageUrl: text("image_url").notNull(),
    projectDate: timestamp("project_date", { mode: "date" }).notNull(),
    portfolioCategoryId: uuid("portfolio_category_id").references(() => portfolioCategories.id),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [index("portfolio_items_category_idx").on(table.portfolioCategoryId)]
);

export const portfolioCategoriesRelations = relations(portfolioCategories, ({ many }) => ({
  portfolioItems: many(portfolioItems),
}));

export const portfolioItemsRelations = relations(portfolioItems, ({ one }) => ({
  category: one(portfolioCategories, {
    fields: [portfolioItems.portfolioCategoryId],
    references: [portfolioCategories.id],
  }),
}));

export type PortfolioCategory = typeof portfolioCategories.$inferSelect;
export type NewPortfolioCategory = typeof portfolioCategories.$inferInsert;
export type PortfolioItem = typeof portfolioItems.$inferSelect;
export type NewPortfolioItem = typeof portfolioItems.$inferInsert;
