import { z } from "zod";

export const portfolioSchema = z.object({
  title: z.string().min(1, "Judul harus diisi"),
  description: z.string().min(1, "Deskripsi harus diisi"),
  imageUrl: z.string().min(1, "Gambar harus diupload"),
  projectDate: z.date(),
  portfolioCategoryId: z.string().min(1, "Kategori harus dipilih").optional().or(z.literal("")),
});

export type PortfolioFormValues = z.infer<typeof portfolioSchema>;

export const portfolioApiSchema = portfolioSchema.extend({
  projectDate: z.coerce.date(),
});

export const portfolioCategorySchema = z.object({
  name: z.string().min(3, { message: "Nama kategori minimal 3 karakter." }),
  description: z.string().optional(),
});

export type PortfolioCategoryFormValues = z.infer<typeof portfolioCategorySchema>;
