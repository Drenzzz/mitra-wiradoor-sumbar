import * as z from 'zod';

export const customerInfoSchema = z.object({
  customerName: z.string().min(3, { 
    message: "Nama lengkap wajib diisi (minimal 3 karakter)." 
  }),
  customerEmail: z.string().email({ 
    message: "Format email tidak valid." 
  }),
  customerPhone: z.string().min(10, {
    message: "Nomor WhatsApp/telepon wajib diisi (minimal 10 digit)."
  }),
  customerAddress: z.string().min(10, {
    message: "Alamat pengiriman wajib diisi (minimal 10 karakter)."
  }),
});

export type CustomerInfoFormValues = z.infer<typeof customerInfoSchema>;
