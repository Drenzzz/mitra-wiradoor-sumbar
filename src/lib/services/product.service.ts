import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, ilike, isNull, isNotNull, or, desc, asc, and, count, SQL } from "drizzle-orm";

export type ProductDto = {
  name: string;
  description: string;
  specifications: string;
  imageUrl: string;
  images?: string[];
  categoryId: string;
};

export type GetProductsOptions = {
  status?: "active" | "trashed";
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  categoryId?: string;
};

export const getProducts = async (options: GetProductsOptions = {}) => {
  const { status = "active", search, sort, page = 1, limit = 10, categoryId } = options;
  const offset = (page - 1) * limit;

  const conditions: SQL[] = [];

  if (status === "trashed") {
    conditions.push(isNotNull(products.deletedAt));
  } else {
    conditions.push(isNull(products.deletedAt));
  }

  if (search) {
    conditions.push(or(ilike(products.name, `%${search}%`), ilike(products.description, `%${search}%`), ilike(products.specifications, `%${search}%`))!);
  }

  if (categoryId) {
    conditions.push(eq(products.categoryId, categoryId));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  let orderByClause: SQL | undefined;
  if (sort) {
    const [field, order] = sort.split("-");
    if (field === "name") {
      orderByClause = order === "asc" ? asc(products.name) : desc(products.name);
    } else if (field === "createdAt") {
      orderByClause = order === "asc" ? asc(products.createdAt) : desc(products.createdAt);
    }
  }
  if (!orderByClause) {
    orderByClause = desc(products.createdAt);
  }

  const [data, countResult] = await Promise.all([
    db.query.products.findMany({
      where: whereClause,
      with: {
        category: {
          columns: { name: true },
        },
      },
      orderBy: orderByClause,
      offset,
      limit,
    }),
    db.select({ count: count() }).from(products).where(whereClause),
  ]);

  return { data, totalCount: countResult[0].count };
};

export const getProductById = async (id: string) => {
  const isValidUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);

  if (!isValidUUID) {
    return null;
  }

  return db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      category: {
        columns: { id: true, name: true },
      },
    },
  });
};

export const createProduct = async (data: ProductDto) => {
  const result = await db
    .insert(products)
    .values({
      name: data.name,
      description: data.description,
      specifications: data.specifications,
      imageUrl: data.imageUrl,
      images: data.images || [],
      categoryId: data.categoryId,
      deletedAt: null,
    })
    .returning();

  return result[0];
};

export const updateProductById = async (id: string, data: Partial<ProductDto>) => {
  const result = await db
    .update(products)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id))
    .returning();

  return result[0];
};

export const softDeleteProductById = async (id: string) => {
  const result = await db.update(products).set({ deletedAt: new Date(), updatedAt: new Date() }).where(eq(products.id, id)).returning();

  return result[0];
};

export const restoreProductById = async (id: string) => {
  const result = await db.update(products).set({ deletedAt: null, updatedAt: new Date() }).where(eq(products.id, id)).returning();

  return result[0];
};

export const permanentDeleteProductById = async (id: string) => {
  const result = await db.delete(products).where(eq(products.id, id)).returning();

  return result[0];
};
