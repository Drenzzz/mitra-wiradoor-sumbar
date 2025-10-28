import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCardSkeleton } from '@/components/guest/product-card-skeleton';
import { ArrowLeft, ChevronRight, Home, ShoppingCart, MessageCircle } from 'lucide-react';
import type { Product } from '@/types';

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products/${slug}`, {
      cache: 'no-store',
    });

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      throw new Error('Gagal memuat data produk.');
    }

    const data = await res.json();
    return data as Product;
  } catch (error) {
    console.error("Fetch product error:", error);
    return null;
  }
}

interface ProductDetailPageProps {
  params: { slug: string };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;    
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

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
                <Button size="lg" asChild>
                  <a href={`https://wa.me/${process.env.WHATSAPP_NUMBER}?text=Halo,%20saya%20tertarik%20dengan%20produk:%20${encodeURIComponent(product.name)}`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Tanya via WhatsApp
                  </a>
                </Button>

          </div>

          <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">Bagikan:</p>
          </div>

        </div>
      </div>

      <div className="mt-16 pt-8 border-t">
        <h2 className="text-2xl font-semibold mb-6">Produk Terkait</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {Array.from({ length: 4 }).map((_, index) => ( <ProductCardSkeleton key={index} /> ))}
        </div>
      </div>

    </div>
  );
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
    const { slug } = await params;
    const product =     await getProduct(slug);

  if (!product) {
    return { title: 'Produk Tidak Ditemukan' };
  }

  return {
    title: `${product.name} - Wiradoor Sumbar`,
    description: product.description.substring(0, 160),
  };
}
