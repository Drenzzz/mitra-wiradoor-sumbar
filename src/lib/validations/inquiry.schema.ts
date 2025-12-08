import * as z from "zod";

export const inquirySchema = z.object({
  senderName: z.string().min(3, {
    message: "Nama pengirim minimal 3 karakter.",
  }),
  senderEmail: z.string().email({
    message: "Format email tidak valid.",
  }),
  senderPhone: z
    .string()
    .transform((val) => val.replace(/\D/g, ""))
    .refine((val) => val.length >= 10, {
      message: "Nomor WhatsApp minimal 10 digit.",
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
  subject: z.string().min(5, {
    message: "Subjek minimal 5 karakter.",
  }),
  message: z.string().min(10, {
    message: "Pesan minimal 10 karakter.",
  }),
});

export type InquiryFormValues = z.infer<typeof inquirySchema>;
