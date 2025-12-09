import { Metadata } from "next";
import { getPortfolioItems } from "@/lib/services/portfolio.service";
import { getPortfolioCategories } from "@/lib/services/portfolio-category.service";
import { PortfolioMasonry } from "@/components/guest/portfolio-masonry";

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
    // @ts-ignore - Handle struktur response { data: [] }
    categoriesList = categoriesRaw.data;
  } else {
    categoriesList = [];
  }

  const portfolios = JSON.parse(JSON.stringify(portfoliosData.data));
  const categories = JSON.parse(JSON.stringify(categoriesList));

  return (
    <div className="bg-background min-h-screen">
      <section className="pt-32 pb-16 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-primary mb-4 block">Our Masterpieces</span>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-foreground">Galeri Proyek</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Kumpulan dokumentasi pemasangan pintu Wiradoor yang telah terpasang rapi di berbagai hunian dan gedung di Sumatera Barat. Bukti nyata kualitas dan presisi.
          </p>
        </div>
      </section>

      {/* Gallery Masonry */}
      <section className="container mx-auto px-4 pb-32">
        <PortfolioMasonry items={portfolios} categories={categories} />
      </section>
    </div>
  );
}
