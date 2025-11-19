import { HeroSection } from '@/components/sections/hero-section';
import { FeaturesSection } from '@/components/sections/features-section';
import { FeaturedProductsSection } from '@/components/sections/featured-products-section';
import { getProducts } from '@/lib/services/product.service';
import { Product } from '@/types';

async function getFeaturedProducts() {
  try {
    const { data } = await getProducts({ 
      limit: 3,
      sort: 'createdAt-desc',
      status: 'active' 
    });
    return data as Product[];
  } catch (error) {
    console.error("Gagal memuat produk unggulan:", error);
    return [];
  }
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <FeaturedProductsSection products={products} />
    </>
  );
}
