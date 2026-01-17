"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inquirySchema, type InquiryFormValues } from "@/lib/validations/inquiry.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { getCsrfToken } from "@/lib/csrf";

export function InquiryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  async function onSubmit(data: InquiryFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": getCsrfToken() || "",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal mengirim pesan");
      }

      toast.success("Pesan Terkirim!", {
        description: "Tim kami akan segera menghubungi Anda.",
      });
      form.reset();
    } catch (error) {
      toast.error("Gagal Mengirim", {
        description: error instanceof Error ? error.message : "Terjadi kesalahan sistem",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputStyles = "bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:bg-white/10 focus:border-primary/50 transition-all hover:bg-white/10";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField
            control={form.control}
            name="senderName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/80">Nama Lengkap</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} className={inputStyles} />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="senderPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/80">WhatsApp / Telepon</FormLabel>
                <FormControl>
                  <Input placeholder="0812..." {...field} className={inputStyles} />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="senderEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white/80">Email</FormLabel>
              <FormControl>
                <Input placeholder="nama@email.com" {...field} className={inputStyles} />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white/80">Subjek</FormLabel>
              <FormControl>
                <Input placeholder="Tanya produk..." {...field} className={inputStyles} />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white/80">Pesan</FormLabel>
              <FormControl>
                <Textarea placeholder="Tulis detail kebutuhan Anda di sini..." className={`min-h-[120px] resize-none ${inputStyles}`} {...field} />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25 h-12 text-base font-medium">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mengirim...
            </>
          ) : (
            <>
              Kirim Pesan <Send className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
