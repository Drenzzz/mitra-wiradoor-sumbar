import Link from 'next/link';
import { Package2, Instagram } from 'lucide-react';
import { cn } from '@/lib/utils';

const footerNavItems = [
  { href: "/produk", label: "Produk" },
  { href: "/portfolio", label: "Portofolio" },
  { href: "/tentang-kami", label: "Tentang Kami" },
  { href: "/kontak", label: "Kontak" },
];

export function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col items-center py-12 px-4">
        
        <Link href="/" className="flex items-center gap-2 mb-6">
          <Package2 className="h-7 w-7" />
          <span className="font-bold text-xl">WiraDoor Sumbar</span>
        </Link>

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6 text-gray-400">
          {footerNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex justify-center mb-8">
          <a
            href="https://www.instagram.com/wiradoor_sumbar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 transition-colors hover:text-white"
            aria-label="Instagram"
          >
            <Instagram className="h-6 w-6" />
          </a>
        </div>
        
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Wiradoor Sumatera Barat. All rights reserved.
        </p>

      </div>
    </footer>
  );
}
