"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { inquirySchema, type InquiryFormValues } from "@/lib/validations/inquiry.schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function InquiryForm() {
  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      senderName: "",
      senderEmail: "",
      senderPhone: "",
      subject: "",
      message: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: InquiryFormValues) {
    toast.promise(
      fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }).then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          if (res.status === 400 && errorData.details) {
            throw new Error(errorData.details[0].message);
          }
          throw new Error(errorData.error || "Gagal mengirim pesan.");
        }
        return res.json();
      }),
      {
        loading: "Mengirim pesan Anda...",
        success: () => {
          form.reset();
          return "Pesan Anda berhasil terkirim! Kami akan segera merespon.";
        },
        error: (err: Error) => err.message,
      }
    );
  }

  return (
    <Card className="bg-muted/50 border-none shadow-none">
      <CardHeader>
        <CardTitle>Kirim Pesan</CardTitle>
        <CardDescription>Ada pertanyaan? Isi formulir di bawah ini dan tim kami akan segera menghubungi Anda.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="senderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Anda</FormLabel>
                    <FormControl>
                      <Input placeholder="cth: Budi Setiawan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="senderEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Anda</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="cth: budi@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="senderPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor WhatsApp</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="cth: 081234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subjek Pesan</FormLabel>
                  <FormControl>
                    <Input placeholder="cth: Pertanyaan Produk Custom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pesan Anda</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tuliskan detail pertanyaan Anda di sini..." className="min-h-[120px] resize-y" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                "Mengirim..."
              ) : (
                <>
                  Kirim Pesan <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
