import { z } from 'zod';
import { Role } from '@prisma/client';

export const userCreateSchema = z.object({
  name: z.string().min(3, { message: "Nama minimal 3 karakter." }),
  email: z.string().email({ message: "Email tidak valid." }),
  password: z.string().min(8, { message: "Password minimal 8 karakter." }),
  role: z.nativeEnum(Role).default(Role.STAF),
});

export type UserCreateFormValues = z.infer<typeof userCreateSchema>;

export const userUpdateSchema = z.object({
  name: z.string().min(3, { message: "Nama minimal 3 karakter." }).optional(),
  email: z.string().email({ message: "Email tidak valid." }).optional(),
  password: z.string().refine(val => val === "" || val.length >= 8, {
    message: "Password baru minimal 8 karakter (atau biarkan kosong)."
  }).optional(),
  role: z.nativeEnum(Role).optional(),
});

export type UserUpdateFormValues = z.infer<typeof userUpdateSchema>;
