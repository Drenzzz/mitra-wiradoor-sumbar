import { pgTable, text, timestamp, uuid, real, integer, boolean, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { orderStatusEnum } from "./enums";
import { products } from "./products";

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  invoiceNumber: text("invoice_number").unique().notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerAddress: text("customer_address"),
  status: orderStatusEnum("status").default("PENDING").notNull(),
  dealPrice: real("deal_price"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id),
    productName: text("product_name").notNull(),
    isReadyStock: boolean("is_ready_stock").notNull(),
    quantity: integer("quantity").default(1).notNull(),
  },
  (table) => [index("order_items_order_id_idx").on(table.orderId), index("order_items_product_id_idx").on(table.productId)]
);

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
