'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { CheckoutForm } from '@/components/guest/checkout-form';
import type { CustomerInfoFormValues } from '@/lib/validations/order.schema';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { toast } from 'sonner'; 

interface OrderPageClientProps {
  product: Product;
}

export function OrderPageClient({ product }: OrderPageClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); 
  const handleFormSubmit = async (values: CustomerInfoFormValues) => {
    setIsLoading(true);

    const payload = {
      ...values,
      productId: product.id, 
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat mengirim pesanan.');
      }

      toast.success('Pesanan Anda berhasil dibuat!');
      
      router.push(`/order/success/${data.id}`);

    } catch (error: any) {
      console.error("Gagal mengirim pesanan:", error);
      toast.error(error.message || 'Gagal terhubung ke server.');
      
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Produk yang Dipesan</h2>
        <Card>
          <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
            <div className="relative w-24 h-24 aspect-square rounded-md overflow-hidden shrink-0">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="flex-1">
              <CardDescription>{product.category.name}</CardDescription>
              <CardTitle className="text-xl">{product.name}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {product.description}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Informasi Pengiriman</h2>
        <CheckoutForm 
          onSubmit={handleFormSubmit} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}
