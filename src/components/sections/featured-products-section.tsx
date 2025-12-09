"use client";

import { useQuery } from "@tanstack/react-query";
import { FeaturedProductCard } from "@/components/guest/featured-product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/ui/magnetic-button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FeaturedProductsSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const res = await fetch("/api/products?limit=3&sort=createdAt-desc");
      if (!res.ok) throw new Error("Gagal memuat produk");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const products = data?.data || [];

  return (
    <section className="relative overflow-hidden bg-background py-32">
      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-20 flex flex-col items-end justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4 block text-sm font-medium uppercase tracking-widest text-primary">
              Masterpiece Collection
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl">
              Karya Seni Pintu <br />
              <span className="text-muted-foreground/50">Untuk Hunian Berkelas</span>
            </motion.h2>
          </div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="hidden md:block">
            <Link href="/produk">
              <MagneticButton className="flex items-center gap-2 border-b border-primary pb-1 text-sm font-medium text-primary transition-colors hover:text-primary/80">
                Lihat Semua Koleksi <ArrowRight className="h-4 w-4" />
              </MagneticButton>
            </Link>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[450px] w-full rounded-2xl bg-muted/20">
                <Skeleton className="h-full w-full rounded-2xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {products.map((product: any, index: number) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.2 }}>
                <FeaturedProductCard id={product.id} name={product.name} category={product.category?.name || "Premium Door"} price={product.price || 0} imageUrl={product.imageUrl} index={index} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center md:hidden">
          <Link href="/produk">
            <MagneticButton className="flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-transform hover:scale-105">Lihat Semua Koleksi</MagneticButton>
          </Link>
        </div>
      </div>

      <div className="absolute right-0 top-1/4 -z-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-0 left-0 -z-0 h-[300px] w-[300px] rounded-full bg-secondary/5 blur-[100px]" />
    </section>
  );
}
