"use client";

import { forwardRef } from "react";
import { CatalogCard } from "@/components/guest/catalog-card";
import { ProductCardSkeleton } from "@/components/guest/product-card-skeleton";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface CatalogProductGridProps {
  products: Product[];
  isLoading: boolean;
  status: "pending" | "error" | "success";
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onReset: () => void;
}

export const CatalogProductGrid = forwardRef<HTMLDivElement, CatalogProductGridProps>(function CatalogProductGrid({ products, isLoading, status, isFetchingNextPage, hasNextPage, onReset }, ref) {
  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="font-serif text-xl font-medium text-foreground">Gagal memuat produk</p>
        <Button variant="outline" onClick={() => window.location.reload()} className="mt-6">
          Muat Ulang
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed rounded-xl bg-muted/20">
        <p className="font-serif text-xl font-medium text-foreground">Koleksi tidak ditemukan</p>
        <p className="text-muted-foreground mt-2 max-w-sm">Coba sesuaikan filter pencarian Anda.</p>
        <Button variant="link" onClick={onReset} className="mt-4 text-primary">
          Lihat Semua Koleksi
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
        {products.map((product: Product, index: number) => (
          <div key={product.id} className={cn("transition-all duration-700", index % 3 === 1 ? "lg:mt-8" : "")}>
            <CatalogCard id={product.id} imageUrl={product.imageUrl} category={(product as any).category?.name || "Koleksi Eksklusif"} name={product.name} description={product.description} index={index % 9} />
          </div>
        ))}
      </div>

      <div ref={ref} className="h-32 w-full flex items-center justify-center">
        {isFetchingNextPage ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
            <span className="text-xs text-muted-foreground tracking-[0.2em] uppercase">Memuat Koleksi...</span>
          </div>
        ) : hasNextPage ? (
          <span className="text-xs text-muted-foreground/30">Scroll untuk melihat lebih banyak</span>
        ) : (
          <div className="flex items-center gap-4 w-full max-w-md mx-auto opacity-50">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.3em]">End of Gallery</span>
            <div className="h-px flex-1 bg-border" />
          </div>
        )}
      </div>
    </div>
  );
});
