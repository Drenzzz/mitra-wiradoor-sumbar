// components/main-nav.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-lg">WiraDoor Sumbar</span>
        </Link>
        
        {/* Navigasi untuk Desktop (hanya tampil di layar medium ke atas) */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/">Beranda</Link>
          <Link href="/produk">Produk</Link>
          <Link href="/artikel">Artikel</Link>
          <Link href="/tentang-kami">Tentang Kami</Link>
          <Link href="/kontak">Kontak</Link>
        </nav>
        
        <div className="flex items-center gap-4">
          {/* Tombol Hubungi Kami untuk Desktop */}
          <div className="hidden md:block">
            <Button asChild>
              <Link href="/kontak">Hubungi Kami</Link>
            </Button>
          </div>

          {/* Tombol Menu Hamburger untuk Mobile (hanya tampil di layar kecil) */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Bars3Icon className="h-6 w-6" />
                  <span className="sr-only">Buka menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Menu Navigasi</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 py-6">
                  <Link href="/" onClick={() => setIsOpen(false)}>Beranda</Link>
                  <Link href="/produk" onClick={() => setIsOpen(false)}>Produk</Link>
                  <Link href="/artikel" onClick={() => setIsOpen(false)}>Artikel</Link>
                  <Link href="/tentang-kami" onClick={() => setIsOpen(false)}>Tentang Kami</Link>
                  <Link href="/kontak" onClick={() => setIsOpen(false)}>Kontak</Link>
                  <Button asChild className="w-full mt-4">
                    <Link href="/kontak" onClick={() => setIsOpen(false)}>Hubungi Kami</Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}