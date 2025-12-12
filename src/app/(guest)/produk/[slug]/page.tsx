import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/guest/product-card";
import { ChevronRight, Home } from "lucide-react";
import type { Product } from "@/types";
import { ProductGallery } from "@/components/guest/product-gallery";
import { ProductInfo } from "@/components/guest/product-info";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

interface ProductData {
  product: (Product & { isReadyStock?: boolean; stock?: number | null }) | null;
  relatedProducts: Product[];
}

async function getProductData(slug: string): Promise<ProductData> {
  let product: (Product & { isReadyStock?: boolean; stock?: number | null }) | null = null;
  let relatedProducts: Product[] = [];

  try {
    const productRes = await fetch(`${process.env.NEXTAUTH_URL}/api/products/${slug}`, {
      cache: "no-store",
    });

    if (productRes.status === 404) {
      return { product: null, relatedProducts: [] };
    }
    if (!productRes.ok) {
      throw new Error("Gagal memuat data produk utama.");
    }
    product = await productRes.json();

    if (product?.categoryId) {
      const relatedQuery = new URLSearchParams({
        status: "active",
        limit: "4",
        categoryId: product.categoryId,
      });

      const relatedRes = await fetch(`${process.env.NEXTAUTH_URL}/api/products?${relatedQuery.toString()}`, {
        cache: "no-store",
      });

      if (relatedRes.ok) {
        const relatedData = await relatedRes.json();
        relatedProducts = (relatedData.data as Product[]).filter((p) => p.id !== product?.id);
      } else {
        console.warn("Gagal memuat produk terkait.");
      }
    }

    return { product, relatedProducts };
  } catch (error) {
    console.error("Fetch product data error:", error);
    return { product: null, relatedProducts: [] };
  }
}

interface ProductDetailPageProps {
  params: { slug: string };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const { product, relatedProducts } = await getProductData(slug);

  if (!product) {
    notFound();
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl];

  const breadcrumbItems = [
    { name: "Beranda", url: "/" },
    { name: "Produk", url: "/produk" },
    { name: product.name, url: `/produk/${product.id}` },
  ];

  return (
    <>
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <div className="min-h-screen bg-background pb-20">
        {/* Breadcrumb Section */}
        <div className="bg-muted/30 border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="text-sm text-muted-foreground flex items-center space-x-2 overflow-hidden">
              <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1 shrink-0">
                <Home className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Beranda</span>
              </Link>
              <ChevronRight className="h-4 w-4 shrink-0" />
              <Link href="/produk" className="hover:text-primary transition-colors shrink-0">
                Produk
              </Link>
              <ChevronRight className="h-4 w-4 shrink-0" />
              <span className="font-medium text-foreground truncate">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            {/* Left Column: Gallery */}
            <div className="lg:col-span-7 xl:col-span-7">
              <div className="sticky top-24">
                <ProductGallery images={images} title={product.name} />
              </div>
            </div>

            {/* Right Column: Info */}
            <div className="lg:col-span-5 xl:col-span-5">
              <ProductInfo product={product} />
            </div>
          </div>

          {/* Related Products Section */}
          <div className="mt-24 pt-12 border-t">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Produk Terkait</h2>
              <Link href="/produk" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                Lihat Semua <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {relatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} slug={relatedProduct.id} imageUrl={relatedProduct.imageUrl} category={relatedProduct.category?.name || "Lainnya"} name={relatedProduct.name} description={relatedProduct.description} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed">
                <p className="text-muted-foreground">Tidak ada produk terkait lainnya dalam kategori ini.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { product } = await getProductData(slug);

  if (!product) {
    return { title: "Produk Tidak Ditemukan" };
  }

  const title = `${product.name} - Wiradoor Sumbar`;
  const description = product.description.substring(0, 160);
  const imageUrl = product.imageUrl;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
