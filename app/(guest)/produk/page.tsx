import { ProductCardSkeleton } from '@/components/guest/product-card-skeleton'; 

export default function ProdukPage() {
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>

           <div className="mt-8 flex justify-center">
              <div className="h-9 bg-muted rounded-md animate-pulse w-40"></div>
           </div>
        </main>
      </div>
    </div>
  );
}
