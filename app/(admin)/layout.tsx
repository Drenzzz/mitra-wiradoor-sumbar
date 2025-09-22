// File: app/(admin)/layout.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/admin/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, Package2, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen w-full bg-muted/40 relative">
      
      {/* Tombol Collapse untuk Desktop */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSidebar}
        className={cn(
          "hidden md:inline-flex absolute top-1/2 -translate-y-1/2 z-20 h-7 w-7 transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "left-[50px]" : "left-[242px]"
        )}
      >
        {isSidebarCollapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
      </Button>

      {/* Sidebar untuk Desktop */}
      <div className="hidden md:flex">
        <Sidebar isCollapsed={isSidebarCollapsed} />
      </div>

      <div className="flex flex-col flex-1 w-full min-w-0">
        
        {/* Header Khusus untuk Mobile */}
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs p-0 w-[260px]">
                <Sidebar isCollapsed={false} />
            </SheetContent>
          </Sheet>
           <Link href="/admin" className="flex items-center gap-2 font-semibold text-lg">
              <Package2 className="h-5 w-5" />
              <span>Wiradoor Admin</span>
           </Link>
        </header>

        {/* Konten Utama Halaman */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>

      <Toaster position="top-center" />
    </div>
  );
}
