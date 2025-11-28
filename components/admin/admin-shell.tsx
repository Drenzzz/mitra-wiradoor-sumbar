"use client";

import Link from "next/link";
import { Sidebar } from "@/components/admin/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, Package2, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSidebar } from "@/hooks/use-sidebar";
import { useEffect, useState } from "react";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { isCollapsed, toggleSidebar } = useSidebar();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/40 relative">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSidebar}
        className={cn("hidden md:inline-flex absolute top-1/2 -translate-y-1/2 z-20 h-7 w-7 transition-all duration-300 ease-in-out", isCollapsed ? "left-[50px]" : "left-[242px]")}
      >
        {isCollapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
      </Button>

      <div className="hidden md:flex">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 w-full min-w-0">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs p-0 w-[260px]">
              <Sidebar />
            </SheetContent>
          </Sheet>
          <Link href="/admin" className="flex items-center gap-2 font-semibold text-lg">
            <Package2 className="h-5 w-5" />
            <span>Wiradoor Admin</span>
          </Link>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto">{children}</main>
      </div>

      <Toaster position="top-center" />
    </div>
  );
}
