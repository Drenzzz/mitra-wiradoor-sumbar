"use client";

import { Product } from "@/types";
import { CheckoutForm } from "@/components/guest/checkout-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";

interface OrderPageClientProps {
  product: Product;
}

export function OrderPageClient({ product }: OrderPageClientProps) {
  const orderItems = [{ ...product, quantity: 1 }];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Produk yang Dipesan</h2>
        <Card>
          <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
            <div className="relative w-24 h-24 aspect-square rounded-md overflow-hidden shrink-0">
              <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
            <div className="flex-1">
              <CardDescription>{product.category.name}</CardDescription>
              <CardTitle className="text-xl">{product.name}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-muted-foreground line-clamp-3">{product.description}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Informasi Pengiriman</h2>
        <CheckoutForm items={orderItems} />
      </div>
    </div>
  );
}
