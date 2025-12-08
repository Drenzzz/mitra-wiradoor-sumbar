import prisma from "@/lib/prisma";
import { Prisma, Role } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { UserCreateFormValues, UserUpdateFormValues } from "@/lib/validations/user.schema";

export const getUsers = async (options: { page?: number; limit?: number; search?: string }) => {
  const { page = 1, limit = 10, search } = options;
  const skip = (page - 1) * limit;

  const whereClause: Prisma.UserWhereInput = {
    role: Role.STAF,
    ...(search && {
      OR: [{ name: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }],
    }),
  };

  const [users, totalCount] = await prisma.$transaction([
    prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
      },
      skip,
      take: limit,
      orderBy: { name: "asc" },
    }),
    prisma.user.count({ where: whereClause }),
  ]);

  return { data: users, totalCount };
};

export const getUserById = (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};

export const createUser = async (data: UserCreateFormValues) => {
  const hashedPassword = await bcrypt.hash(data.password, 12);

  return prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};

export const updateUser = async (id: string, data: UserUpdateFormValues) => {
  let updateData: Prisma.UserUpdateInput = {
    name: data.name,
    email: data.email,
    role: data.role,
  };

  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 12);
  }

  return prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};

export const deleteUser = (id: string) => {
  return prisma.user.delete({
    where: { id },
  });
};
