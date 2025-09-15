// components/main-nav.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function MainNav() {
  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          {/* Ganti dengan logo Anda nanti */}
          <span className="font-bold text-lg">WiraDoor Sumbar</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-orange-600">Beranda</Link>
          <Link href="/produk" className="transition-colors hover:text-orange-600">Produk</Link>
          <Link href="/artikel" className="transition-colors hover:text-orange-600">Artikel</Link>
          <Link href="/tentang-kami" className="transition-colors hover:text-orange-600">Tentang Kami</Link>
          <Link href="/kontak" className="transition-colors hover:text-orange-600">Kontak</Link>
        </nav>
        <div className="hidden md:block">
          <Button asChild>
            <Link href="/kontak">Hubungi Kami</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}