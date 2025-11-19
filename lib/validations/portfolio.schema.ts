import { z } from 'zod';

export const portfolioCategorySchema = z.object({
  name: z.string().min(3, { message: "Nama kategori minimal 3 karakter." }),
  description: z.string().optional(),
});

export type PortfolioCategoryFormValues = z.infer<typeof portfolioCategorySchema>;

export const portfolioItemSchema = z.object({
  title: z.string().min(3, { message: "Judul proyek minimal 3 karakter." }),
  description: z.string().min(10, { message: "Deskripsi minimal 10 karakter." }),
  imageUrl: z.string().min(1, { message: "Gambar wajib diunggah." }).url({ message: "URL gambar tidak valid." }),
  
  projectDate: z.coerce
    .date({ error: "Tanggal proyek wajib diisi." })
    .refine((value) => !Number.isNaN(value.getTime()), {
      message: "Format tanggal tidak valid.",
    }),
  
  portfolioCategoryId: z.string().min(1, { message: "Kategori wajib dipilih." }),
});

export type PortfolioItemFormValues = z.infer<typeof portfolioItemSchema>;
