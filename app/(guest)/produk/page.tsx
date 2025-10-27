import { ProductCard } from '@/components/guest/product-card';
import { ProductCardSkeleton } from '@/components/guest/product-card-skeleton';
import { AlertTriangle, Info } from 'lucide-react';
import type { Product } from '@/types';

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products?status=active&limit=9`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Gagal memuat data produk.');
    }

    const data = await res.json();
    return { products: data.data as Product[], totalCount: data.totalCount, error: null };
  } catch (error: any) {
    console.error("Fetch error:", error);
    return { products: [], totalCount: 0, error: error.message || 'Terjadi kesalahan saat mengambil data.' };
  }
}

export default async function ProdukPage() {
  const { products, totalCount, error } = await getProducts();
  const isLoading = !error && products.length === 0 && totalCount === 0;
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Katalog Produk
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Jelajahi semua pilihan pintu berkualitas dari Wiradoor Sumatera Barat. Temukan solusi yang tepat untuk kebutuhan Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] gap-8">
        <aside className="hidden md:block">
          <div className="sticky top-20 space-y-6">
            <h2 className="text-lg font-semibold">Filter</h2>
            <div className="h-40 bg-muted rounded-md animate-pulse"></div>
            <div className="h-20 bg-muted rounded-md animate-pulse"></div>
          </div>
        </aside>

        <main>
          <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
             <div className="h-9 bg-muted rounded-md animate-pulse w-full sm:w-1/2"></div>
             <div className="h-9 bg-muted rounded-md animate-pulse w-full sm:w-[180px]"></div>
          </div>

\          {error ? (
            <div className="flex flex-col items-center justify-center text-destructive bg-destructive/10 p-6 rounded-md min-h-[300px]">
              <AlertTriangle className="w-12 h-12 mb-4" />
              <p className="font-semibold">Oops! Terjadi Kesalahan</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-muted-foreground bg-muted/50 p-6 rounded-md min-h-[300px]">
               <Info className="w-12 h-12 mb-4" />
               <p className="font-semibold">Belum Ada Produk</p>
               <p className="text-sm">Silakan cek kembali nanti atau hubungi kami.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  slug={product.id}
                  imageUrl={product.imageUrl}
                  category={product.category?.name || 'Tanpa Kategori'}
                  name={product.name}
                  description={product.description}
                />
              ))}
            </div>
          )}

           {!error && !isLoading && totalCount > 9 && (
             <div className="mt-8 flex justify-center">
                <div className="h-9 bg-muted rounded-md animate-pulse w-40"></div>
             </div>
           )}
        </main>
      </div>
    </div>
  );
}
