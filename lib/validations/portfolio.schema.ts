import { z } from 'zod';

export const portfolioCategorySchema = z.object({
  name: z.string().min(3, { message: "Nama kategori minimal 3 karakter." }),
  description: z.string().optional(),
});

export const portfolioItemSchema = z.object({
  title: z.string().min(3, { message: "Judul proyek minimal 3 karakter." }),
  description: z.string().min(10, { message: "Deskripsi minimal 10 karakter." }),
  imageUrl: z.string().url({ message: "URL gambar tidak valid." }).min(1, { message: "Gambar wajib diunggah." }),
  
  projectDate: z.coerce
    .date({ error: "Tanggal proyek wajib diisi." })
    .refine((value) => !Number.isNaN(value.getTime()), {
      message: "Format tanggal tidak valid.",
    }),
  
  portfolioCategoryId: z.string().optional().nullable(),
});

export type PortfolioItemFormValues = z.infer<typeof portfolioItemSchema>;
