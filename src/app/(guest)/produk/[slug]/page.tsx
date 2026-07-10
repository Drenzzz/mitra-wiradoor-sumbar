import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/guest/product/product-card";
import { ChevronRight, Home } from "lucide-react";
import type { Product } from "@/types";
import { ProductGallery } from "@/components/guest/product/product-gallery";
import { ProductInfo } from "@/components/guest/product/product-info";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { getProductById, getProducts } from "@/lib/services/product.service";

export const dynamic = "force-dynamic";

interface ProductData {
  product: Product | null;
  relatedProducts: Product[];
}

type ProductSource = {
  id: string;
  name: string;
  description: string | null;
  specifications: string | null;
  imageUrl: string;
  images: string[] | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  category: {
    name: string;
  };
  isReadyStock: boolean | null;
};

function toProductView(product: ProductSource): Product {
  return {
    id: product.id,
    name: product.name,
    description: product.description ?? "",
    specifications: product.specifications ?? "",
    imageUrl: product.imageUrl,
    images: product.images ?? [],
    deletedAt: product.deletedAt,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    categoryId: product.categoryId,
    category: {
      name: product.category.name,
    },
    isReadyStock: Boolean(product.isReadyStock),
    price: 0,
  };
}

async function getProductData(slug: string): Promise<ProductData> {
  let product: Product | null = null;
  let relatedProducts: Product[] = [];

  try {
    const productData = await getProductById(slug);
    if (!productData) {
      return { product: null, relatedProducts: [] };
    }
    product = toProductView(productData as ProductSource);

    if (product?.categoryId) {
      const relatedData = await getProducts({
        status: "active",
        limit: 4,
        categoryId: product.categoryId,
      });
      relatedProducts = relatedData.data.map((item) => toProductView(item as ProductSource)).filter((p) => p.id !== product?.id);
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
        <div className="bg-muted/30 border-b pt-20">
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
            <div className="lg:col-span-7 xl:col-span-7">
              <div className="sticky top-24">
                <ProductGallery images={images} title={product.name} />
              </div>
            </div>

            <div className="lg:col-span-5 xl:col-span-5">
              <ProductInfo product={product} />
            </div>
          </div>

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
