import { db } from "@/db";
import { users } from "@/db/schema";
import type { Role } from "@/db/schema";
import { eq, ilike, or, asc, and, count, SQL } from "drizzle-orm";
import * as bcrypt from "bcrypt";
import { UserCreateFormValues, UserUpdateFormValues } from "@/lib/validations/user.schema";

export const getUsers = async (options: { page?: number; limit?: number; search?: string }) => {
  const { page = 1, limit = 10, search } = options;
  const offset = (page - 1) * limit;

  const conditions: SQL[] = [eq(users.role, "STAF")];

  if (search) {
    conditions.push(or(ilike(users.name, `%${search}%`), ilike(users.email, `%${search}%`))!);
  }

  const whereClause = and(...conditions);

  const [data, countResult] = await Promise.all([
    db.query.users.findMany({
      where: whereClause,
      columns: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
      },
      orderBy: asc(users.name),
      offset,
      limit,
    }),
    db.select({ count: count() }).from(users).where(whereClause),
  ]);

  return { data, totalCount: countResult[0].count };
};

export const getUserById = async (id: string) => {
  return db.query.users.findFirst({
    where: eq(users.id, id),
    columns: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};

export const createUser = async (data: UserCreateFormValues) => {
  const hashedPassword = await bcrypt.hash(data.password, 12);

  const result = await db
    .insert(users)
    .values({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role as Role,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
    });

  return result[0];
};

export const updateUser = async (id: string, data: UserUpdateFormValues) => {
  const updateData: Partial<typeof users.$inferInsert> = {
    name: data.name,
    email: data.email,
    role: data.role as Role,
  };

  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 12);
  }

  const result = await db.update(users).set(updateData).where(eq(users.id, id)).returning({
    id: users.id,
    name: users.name,
    email: users.email,
    role: users.role,
  });

  return result[0];
};

export const deleteUser = async (id: string) => {
  const result = await db.delete(users).where(eq(users.id, id)).returning();

  return result[0];
};
