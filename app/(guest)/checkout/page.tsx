"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { CheckoutForm } from "@/components/guest/checkout-form";
import { CustomerInfoFormValues } from "@/lib/validations/order.schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const cart = useCart();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto py-24 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Keranjang Belanja Kosong</h1>
        <p className="text-muted-foreground mb-8">Anda belum menambahkan produk apapun.</p>
        <Button onClick={() => router.push("/produk")}>Lihat Katalog</Button>
      </div>
    );
  }

  const handleCheckout = async (values: CustomerInfoFormValues) => {
    setIsLoading(true);
    try {
      const payload = {
        ...values,
        items: cart.items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
        })),
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal memproses pesanan.");
      }

      cart.clearCart();
      toast.success("Pesanan berhasil dibuat!");
      router.push(`/order/success/${data.id}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Checkout Pesanan</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Daftar Barang</h2>
          {cart.items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4 flex gap-4 items-center">
                <div className="relative w-20 h-20 bg-muted rounded-md overflow-hidden shrink-0">
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.category.name}</p>
                  <p className="text-sm mt-1">Jumlah: {item.quantity}</p>
                </div>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => cart.removeItem(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pengiriman</CardTitle>
            </CardHeader>
            <CardContent>
              <CheckoutForm onSubmit={handleCheckout} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
