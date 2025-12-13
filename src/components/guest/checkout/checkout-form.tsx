"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShoppingBag } from "lucide-react";

import { useCart, CartItem } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { CheckoutOrderSummary } from "@/components/guest/checkout/checkout-order-summary";

const checkoutSchema = z.object({
  customerName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  customerEmail: z.string().email("Format email tidak valid"),
  customerPhone: z.string().min(10, "Nomor WhatsApp minimal 10 digit"),
  customerAddress: z.string().min(10, "Alamat lengkap minimal 10 karakter"),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  items?: CartItem[];
}

export function CheckoutForm({ items }: CheckoutFormProps) {
  const router = useRouter();
  const cart = useCart();
  const [loading, setLoading] = useState(false);

  const checkoutItems = items || cart.items;
  const isFromCart = !items;

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      customerAddress: "",
      notes: "",
    },
  });

  async function onSubmit(data: CheckoutFormValues) {
    if (checkoutItems.length === 0) {
      toast.error("Daftar inquiry Anda kosong");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        ...data,
        items: checkoutItems.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
        })),
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal memproses permintaan");
      }

      if (isFromCart) {
        cart.clearCart();
      }

      toast.success("Permintaan berhasil dikirim!");

      setTimeout(() => {
        router.push(`/order/success/${result.data.id}`);
      }, 100);
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="h-10 w-10 text-orange-400 opacity-50" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">Daftar Inquiry Kosong</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8">Anda belum memilih produk pintu untuk proyek Anda. Silakan jelajahi koleksi kami.</p>
        <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-8">
          <Link href="/produk">Jelajahi Koleksi</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <div className="lg:col-span-7 space-y-8">
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">1</div>
            <h3 className="text-xl font-bold text-slate-900">Informasi Pemesan</h3>
          </div>

          <Form {...form}>
            <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Lengkap / Perusahaan</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Budi Santoso / PT Maju Jaya" {...field} className="bg-slate-50 border-slate-200" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor WhatsApp</FormLabel>
                      <FormControl>
                        <Input placeholder="081234567890" type="tel" {...field} className="bg-slate-50 border-slate-200" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Opsional)</FormLabel>
                    <FormControl>
                      <Input placeholder="email@perusahaan.com" type="email" {...field} className="bg-slate-50 border-slate-200" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-3 mt-8 mb-6">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">2</div>
                <h3 className="text-xl font-bold text-slate-900">Detail Proyek</h3>
              </div>

              <FormField
                control={form.control}
                name="customerAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat Lokasi Proyek</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Alamat lengkap lokasi pengiriman/pemasangan..." className="min-h-[100px] bg-slate-50 border-slate-200 resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catatan Tambahan (Ukuran Custom/Request Khusus)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Misal: Mohon pastikan pintu sudah di-oven kering..." className="min-h-[80px] bg-slate-50 border-slate-200 resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>

      <div className="lg:col-span-5">
        <CheckoutOrderSummary items={checkoutItems} isFromCart={isFromCart} loading={loading} onRemoveItem={isFromCart ? cart.removeItem : undefined} />
      </div>
    </div>
  );
}
