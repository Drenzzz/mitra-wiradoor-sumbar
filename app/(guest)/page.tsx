// app/page.tsx
import { HeroSection } from '@/components/sections/hero-section';
import { FeaturesSection } from '@/components/sections/features-section';
import { FeaturedProductsSection } from '@/components/sections/featured-products-section';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <FeaturedProductsSection />
    </>
  );
}