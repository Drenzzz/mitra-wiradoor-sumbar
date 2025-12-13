import { Metadata } from "next";
import Image from "next/image";
import { getPortfolioItems } from "@/lib/services/portfolio.service";
import { getPortfolioCategories } from "@/lib/services/portfolio-category.service";
import { PortfolioMasonry } from "@/components/guest/portfolio/portfolio-masonry";

export const metadata: Metadata = {
  title: "Portfolio Proyek - Wiradoor Sumbar",
  description: "Lihat hasil pemasangan pintu Wiradoor di berbagai proyek residensial dan komersial di Sumatera Barat.",
};

export default async function PortfolioPage() {
  const portfoliosData = await getPortfolioItems({ limit: 100 });
  const categoriesRaw = await getPortfolioCategories();

  let categoriesList: any[] = [];
  if (Array.isArray(categoriesRaw)) {
    categoriesList = categoriesRaw;
  } else if (categoriesRaw && typeof categoriesRaw === "object" && "data" in categoriesRaw) {
    categoriesList = (categoriesRaw as { data: any[] }).data;
  } else {
    categoriesList = [];
  }

  const portfolios = JSON.parse(JSON.stringify(portfoliosData.data));
  const categories = JSON.parse(JSON.stringify(categoriesList));

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1470&auto=format&fit=crop" alt="Portfolio Background" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6">
          <div className="overflow-hidden">
            <span className="inline-block py-1 px-3 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-sm">Our Masterpieces</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight leading-tight">Galeri Proyek</h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">Kumpulan dokumentasi pemasangan pintu Wiradoor yang telah terpasang rapi di berbagai hunian dan gedung di Sumatera Barat.</p>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7" />
          </svg>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <PortfolioMasonry items={portfolios} categories={categories} />
      </section>
    </div>
  );
}
