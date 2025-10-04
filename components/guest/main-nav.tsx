'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu, Package2, Home, Package, Newspaper, Briefcase, Building2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/produk", label: "Produk", icon: Package },
  { href: "/artikel", label: "Artikel", icon: Newspaper },
  { href: "/portfolio", label: "Portofolio", icon: Briefcase },
  { href: "/tentang-kami", label: "Tentang Kami", icon: Building2 },
];

export function MainNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Package2 className="h-6 w-6 text-primary" />
          <span>WiraDoor Sumbar</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-muted-foreground transition-all duration-300 hover:text-primary hover:drop-shadow-[0_0_8px_rgba(234,88,12,0.4)]",
                  pathname === item.href && "text-primary"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          <Button asChild>
            <Link href="/kontak">Hubungi Kami</Link>
          </Button>
        </div>
        
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Buka menu</span>
              </Button>
            </SheetTrigger>
            
            <SheetContent side="left" className="flex flex-col p-4">
              <div className="mb-4">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                  <Package2 className="h-6 w-6 text-primary" />
                  <span>WiraDoor Sumbar</span>
                </Link>
              </div>
              <nav className="flex flex-col gap-2 flex-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10",
                          isActive && "bg-primary/10 text-primary font-semibold"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>

              <div className="mt-auto">
                <SheetClose asChild>
                  <Button asChild className="w-full">
                    <Link href="/kontak">Hubungi Kami</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
