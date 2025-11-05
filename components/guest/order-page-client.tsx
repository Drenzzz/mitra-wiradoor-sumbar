'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { CustomerInfoFormValues, CheckoutForm } from '@/components/guest/checkout-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';

interface OrderPageClientProps {
  product: Product;
}

export function OrderPageClient({ product }: OrderPageClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleFormSubmit = async (values: CustomerInfoFormValues) => {
    setIsLoading(true);
    
    console.log("Formulir disubmit dengan data:", values);
    console.log("Memesan produk:", product.name, "(ID: ", product.id, ")");

    await new Promise(resolve => setTimeout(resolve, 1500)); 

    alert(`(HANYA TES) Pesanan untuk ${product.name} diterima.\nData: ${JSON.stringify(values)}`);
    
    setIsLoading(false);
    
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
