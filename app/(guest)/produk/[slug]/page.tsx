import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/guest/product-card';
import { ArrowLeft, ChevronRight, Home, ShoppingCart, MessageCircle } from 'lucide-react';
import type { Product } from '@/types';

interface ProductData {
  product: Product | null;
  relatedProducts: Product[];
}

async function getProductData(slug: string): Promise<ProductData> {
  let product: (Product & { isReadyStock?: boolean; stock?: number | null }) | null = null;
  let relatedProducts: Product[] = [];

  try {
    const productRes = await fetch(`${process.env.NEXTAUTH_URL}/api/products/${slug}`, {
      cache: 'no-store',
    });

    if (productRes.status === 404) {
      return { product: null, relatedProducts: [] };
    }
    if (!productRes.ok) {
      throw new Error('Gagal memuat data produk utama.');
    }
    product = await productRes.json();

    if (product?.categoryId) {
      const relatedQuery = new URLSearchParams({
        status: 'active',
        limit: '4',
        categoryId: product.categoryId,
      });

      const relatedRes = await fetch(`${process.env.NEXTAUTH_URL}/api/products?${relatedQuery.toString()}`, {
        cache: 'no-store', 
      });

      if (relatedRes.ok) {
        const relatedData = await relatedRes.json();
        relatedProducts = (relatedData.data as Product[]).filter(p => p.id !== product?.id);
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

  const whatsAppNumber = process.env.WHATSAPP_NUMBER || '6281234567890';
  const whatsappMessage = `Halo, saya tertarik dengan produk: ${product.name}`;
  const whatsappLink = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  // const isReadyStock = product.isReadyStock ?? false; 
  // const currentStock = product.stock ?? 0;

  return (
    <div className="container mx-auto py-8 px-4">
      <nav className="mb-6 text-sm text-muted-foreground flex items-center space-x-2">
        <Link href="/" className="hover:text-primary">
          <Home className="h-4 w-4 inline-block mr-1" /> Beranda
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/produk" className="hover:text-primary">
          Produk
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground truncate max-w-[200px] sm:max-w-none">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-square relative rounded-lg overflow-hidden shadow-md bg-muted">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="flex flex-col space-y-4">
          <Badge variant="outline" className="w-fit">{product.category?.name || 'Lainnya'}</Badge>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">{product.name}</h1>

          <div className="text-2xl font-semibold text-primary">
             Harga via WhatsApp
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Deskripsi</h2>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Spesifikasi Teknis</h2>
            <p className="text-muted-foreground whitespace-pre-wrap text-sm">{product.specifications || '-'}</p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            {/* {isReadyStock ? (
              <Button size="lg" disabled={currentStock <= 0}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                {currentStock <= 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
              </Button>
            ) : ( */}
              <Button size="lg" asChild>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Tanya / Pesan Custom
                </a>
              </Button>
            {/* )} */}

             {/* {isReadyStock && (
                <Button size="lg" variant="outline" asChild>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Tanya Detail
                  </a>
                </Button>
             )} */}
          </div>

          <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">Bagikan:</p>
          </div>

        </div>
      </div>

      <div className="mt-16 pt-8 border-t">
        <h2 className="text-2xl font-semibold mb-6">Produk Terkait</h2>
        {relatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Map data produk terkait menggunakan ProductCard */}
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                slug={relatedProduct.id} // Gunakan ID sebagai slug sementara
                imageUrl={relatedProduct.imageUrl}
                category={relatedProduct.category?.name || 'Lainnya'}
                name={relatedProduct.name}
                description={relatedProduct.description}
              />
            ))}
          </div>
        ) : (
          // Tampilkan pesan jika tidak ada produk terkait
          <p className="text-muted-foreground">Tidak ada produk terkait lainnya dalam kategori ini.</p>
        )}
      </div>

    </div>
  );
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
    const { slug } = await params;
    const { product } = await getProductData(slug);

  if (!product) {
    return { title: 'Produk Tidak Ditemukan' };
  }

  return {
    title: `${product.name} - Wiradoor Sumbar`,
    description: product.description.substring(0, 160),
  };
}
