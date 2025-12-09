import { getProducts } from "@/lib/services/product.service";
import { getCategories } from "@/lib/services/category.service";
import { ProductCatalog } from "@/components/guest/product-catalog";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalog Produk - Wiradoor Sumbar",
  description: "Jelajahi semua pilihan pintu berkualitas dari Wiradoor Sumatera Barat. Temukan solusi yang tepat untuk kebutuhan Anda.",
};

export default async function ProdukPage() {
  const productsData = await getProducts({
    status: "active",
    limit: 9,
    page: 1,
    sort: "createdAt-desc",
  });

  const categoriesData = await getCategories({
    status: "active",
    limit: 100,
  });

  const serializedProducts = JSON.parse(JSON.stringify(productsData.data));
  const serializedCategories = JSON.parse(JSON.stringify(categoriesData.data));

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Wood Texture Background" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6">
          <div className="overflow-hidden">
            <span className="inline-block py-1 px-3 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-sm">Exclusive Series</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight leading-tight">Signature Collections</h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">Menghadirkan kehangatan kayu alami dengan presisi teknologi modern. Temukan pintu yang menyempurnakan estetika hunian Anda.</p>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7" />
          </svg>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <ProductCatalog initialProducts={serializedProducts} initialTotal={productsData.totalCount} categories={serializedCategories} />
        </div>
      </section>
    </div>
  );
}
