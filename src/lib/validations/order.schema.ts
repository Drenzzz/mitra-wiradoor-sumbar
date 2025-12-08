import * as z from "zod";

export const customerInfoSchema = z.object({
  customerName: z.string().min(3, {
    message: "Nama lengkap wajib diisi (minimal 3 karakter).",
  }),
  customerEmail: z.string().email({
    message: "Format email tidak valid.",
  }),
  customerPhone: z
    .string()
    .transform((val) => val.replace(/\D/g, ""))
    .refine((val) => val.length >= 10, {
      message: "Nomor WhatsApp/telepon wajib diisi (minimal 10 digit).",
    })
    .transform((val) => {
      if (val.startsWith("0")) {
        return "62" + val.slice(1);
      }
      return val;
    })
    .refine((val) => val.startsWith("62"), {
      message: "Format nomor tidak valid. Gunakan awalan 08... atau 628...",
    }),
  customerAddress: z.string().min(10, {
    message: "Alamat pengiriman wajib diisi (minimal 10 karakter).",
  }),
});

export type CustomerInfoFormValues = z.infer<typeof customerInfoSchema>;
