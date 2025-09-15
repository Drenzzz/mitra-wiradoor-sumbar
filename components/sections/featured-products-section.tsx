// components/sections/featured-products-section.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

// Data tiruan - nanti akan diganti dengan data dari API
const featuredProducts = [
  {
    name: 'Pintu Solid Merbau',
    category: 'Kayu Solid',
    description: 'Sangat cocok untuk pintu utama, memberikan kesan kokoh dan mewah.',
    imageUrl: 'https://images.pexels.com/photos/1954331/pexels-photo-1954331.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Pintu Engineering PVC',
    category: 'Kayu Engineering',
    description: 'Pilihan modern untuk interior, tahan lama dan mudah perawatannya.',
    imageUrl: 'https://images.pexels.com/photos/2089422/pexels-photo-2089422.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Pintu Kaca French',
    category: 'Desain Kustom',
    description: 'Memberikan sentuhan elegan dan memaksimalkan cahaya alami.',
    imageUrl: 'https://images.pexels.com/photos/3935329/pexels-photo-3935329.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

export function FeaturedProductsSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Produk Unggulan Kami</h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Beberapa pilihan terbaik yang paling diminati oleh pelanggan kami.
          </p>
        </div>
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <Card key={product.name} className="overflow-hidden">
              <CardHeader>
                <div className="relative h-60 w-full">
                  <Image src={product.imageUrl} alt={product.name} layout="fill" objectFit="cover" />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{product.category}</CardDescription>
                <CardTitle className="mt-1">{product.name}</CardTitle>
                <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}