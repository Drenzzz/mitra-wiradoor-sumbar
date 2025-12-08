import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/types';

interface FeaturedProductsSectionProps {
  products: Product[];
}

export function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  return (
    <section className="py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Produk Terbaru Kami</h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Pilihan produk pintu terbaru dengan kualitas terbaik untuk hunian Anda.
          </p>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <Card key={product.id} className="overflow-hidden flex flex-col hover:shadow-lg transition-all">
                <CardHeader className="p-0">
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name} 
                      fill 
                      className="object-cover transition-transform duration-300 hover:scale-105" 
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6 flex-grow">
                  <CardDescription className="mb-2">{product.category.name}</CardDescription>
                  <CardTitle className="text-xl mb-2 line-clamp-1">{product.name}</CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button variant="outline" asChild className="w-full">
                    <Link href={`/produk/${product.id}`}>
                      Lihat Detail <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              Belum ada produk yang ditampilkan.
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" asChild>
            <Link href="/produk">Lihat Semua Produk</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
