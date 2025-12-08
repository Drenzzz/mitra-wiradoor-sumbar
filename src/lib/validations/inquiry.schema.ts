import * as z from "zod";

export const inquirySchema = z.object({
  senderName: z.string().min(3, {
    message: "Nama pengirim minimal 3 karakter.",
  }),
  senderEmail: z.string().email({
    message: "Format email tidak valid.",
  }),
  senderPhone: z.string().min(10, {
    message: "Nomor WhatsApp minimal 10 karakter.",
  }),
  subject: z.string().min(5, {
    message: "Subjek minimal 5 karakter.",
  }),
  message: z.string().min(10, {
    message: "Pesan minimal 10 karakter.",
  }),
});

export type InquiryFormValues = z.infer<typeof inquirySchema>;
