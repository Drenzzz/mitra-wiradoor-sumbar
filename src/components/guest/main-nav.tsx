"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ClipboardList, Menu, X } from "lucide-react";
import wiradoorLogo from "@/assets/wiradoor.png";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";

const routes = [
  {
    href: "/",
    label: "HOME",
  },
  {
    href: "/produk",
    label: "COLLECTIONS",
  },
  {
    href: "/portfolio",
    label: "PROJECTS",
  },
  {
    href: "/artikel",
    label: "JOURNAL",
  },
  {
    href: "/tentang-kami",
    label: "ABOUT",
  },
  {
    href: "/kontak",
    label: "CONTACT",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } as const },
};

export function MainNav() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const pathname = usePathname();
  const cart = useCart();
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500 ease-in-out",
        isScrolled ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/50 py-3 shadow-sm" : "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-6"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/" className={cn("transition-opacity duration-300 relative z-50 hover:opacity-90", isOpen && "opacity-100")}>
          <Image src={wiradoorLogo} alt="Wiradoor Logo" height={40} width={140} className="h-10 w-auto object-contain" priority />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn("text-xs font-bold tracking-[0.2em] transition-all hover:text-orange-500", isScrolled ? "text-slate-600" : "text-white/90 drop-shadow-sm", pathname === route.href && "text-orange-500 scale-105")}
            >
              {route.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/checkout">
            <Button variant={isScrolled ? "outline" : "secondary"} size="sm" className={cn("gap-2 transition-all rounded-full px-4 h-9", !isScrolled && "bg-white/10 text-white hover:bg-white/20 border-white/20 border backdrop-blur-sm")}>
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline font-medium text-xs tracking-wide">INQUIRY</span>
              {cart.items.length > 0 && <span className="bg-orange-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full -mr-1">{cart.items.length}</span>}
            </Button>
          </Link>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={cn("md:hidden hover:bg-white/20 transition-colors z-50 relative", isScrolled ? "text-slate-900" : "text-white", isOpen && "text-slate-900 hover:bg-slate-100")}>
                {isOpen ? <X className="h-6 w-6 animate-in spin-in-90 duration-300" /> : <Menu className="h-6 w-6 animate-in zoom-in duration-300" />}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="top" className="w-full h-[100dvh] border-none bg-white/95 backdrop-blur-2xl p-0 flex flex-col items-center justify-center">
              <AnimatePresence>
                {isOpen && (
                  <motion.nav variants={containerVariants} initial="hidden" animate="show" exit="hidden" className="flex flex-col items-center gap-8">
                    {routes.map((route) => (
                      <motion.div key={route.href} variants={itemVariants}>
                        <Link
                          href={route.href}
                          onClick={() => setIsOpen(false)}
                          className={cn("text-3xl font-bold tracking-[0.1em] transition-all duration-300 hover:scale-110 block", pathname === route.href ? "text-orange-600" : "text-slate-800 hover:text-orange-500")}
                        >
                          {route.label}
                        </Link>
                      </motion.div>
                    ))}
                  </motion.nav>
                )}
              </AnimatePresence>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
