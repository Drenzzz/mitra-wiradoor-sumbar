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
    <div className="flex h-screen w-full bg-muted/40 overflow-hidden relative">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSidebar}
        className={cn("hidden md:inline-flex absolute top-1/2 -translate-y-1/2 z-50 h-7 w-7 transition-all duration-300 ease-in-out shadow-md bg-background", isCollapsed ? "left-[50px]" : "left-[242px]")}
      >
        {isCollapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
      </Button>

      <div className="hidden md:flex h-full flex-col border-r bg-background">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 w-full min-w-0 h-full">
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-4 border-b bg-background px-4 md:hidden">
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

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-6">
          <div className="mx-auto max-w-7xl space-y-4">{children}</div>
        </main>
      </div>

      <Toaster position="top-center" />
    </div>
  );
}
