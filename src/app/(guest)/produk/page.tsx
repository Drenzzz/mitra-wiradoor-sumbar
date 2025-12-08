import { getProducts } from "@/lib/services/product.service";
import { getCategories } from "@/lib/services/category.service";
import { ProductCatalog } from "@/components/guest/product-catalog";

export const metadata = {
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
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Katalog Produk</h1>
        <p className="mt-2 text-lg text-muted-foreground">Jelajahi semua pilihan pintu berkualitas dari Wiradoor Sumatera Barat. Temukan solusi yang tepat untuk kebutuhan Anda.</p>
      </div>

      <ProductCatalog initialProducts={serializedProducts} initialTotal={productsData.totalCount} categories={serializedCategories} />
    </div>
  );
}
