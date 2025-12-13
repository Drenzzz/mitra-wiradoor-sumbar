"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Trash2, ArrowRight, ShieldCheck, ShoppingBag } from "lucide-react";

import { useCart, CartItem } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

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

      if (!items) {
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
      {/* KOLOM KIRI: FORMULIR */}
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

      {/* KOLOM KANAN: ORDER SUMMARY (STICKY) */}
      <div className="lg:col-span-5">
        <div className="sticky top-32 space-y-6">
          <Card className="border-0 shadow-xl bg-slate-900 text-white overflow-hidden">
            <CardHeader className="bg-slate-800/50 pb-4">
              <CardTitle className="flex items-center justify-between text-lg">
                <span>Ringkasan Inquiry</span>
                <span className="text-sm font-normal text-slate-400">{checkoutItems.length} Item</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 max-h-[400px] overflow-y-auto custom-scrollbar">
              <div className="space-y-6">
                {checkoutItems.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                      <Image src={item.imageUrl || "/placeholder-image.jpg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-200 truncate">{item.name}</h4>
                      <p className="text-sm text-slate-400 mt-1">Qty: {item.quantity} unit</p>
                    </div>
                    {!items && (
                      <Button variant="ghost" size="icon" onClick={() => cart.removeItem(item.id)} className="text-slate-500 hover:text-red-400 hover:bg-slate-800 -mr-2">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>

            <Separator className="bg-slate-700" />

            <CardFooter className="p-6 bg-slate-800/30 flex flex-col gap-4">
              <div className="text-xs text-slate-500 bg-slate-800/50 p-3 rounded-lg flex gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Harga dan ongkir akan diinformasikan oleh tim kami melalui WhatsApp setelah pesanan dibuat.</span>
              </div>

              <Button type="submit" form="checkout-form" disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12 text-base font-semibold shadow-lg shadow-orange-900/20">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...
                  </>
                ) : (
                  <>
                    Kirim Permintaan <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
