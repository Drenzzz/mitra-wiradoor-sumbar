"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { MainNav } from "@/components/guest/main-nav";
import { SiteFooter } from "@/components/guest/site-footer";
import { ForceLightTheme } from "@/components/guest/force-light-theme";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    console.error("Error caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen">
      <ForceLightTheme />
      <MainNav />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Terjadi Kesalahan</h2>
            <p className="text-muted-foreground">Maaf, halaman ini mengalami masalah. Silakan coba muat ulang atau kembali ke halaman sebelumnya.</p>
          </div>

          {error.digest && <p className="text-xs text-muted-foreground font-mono bg-muted px-3 py-2 rounded-lg inline-block">Error ID: {error.digest}</p>}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={reset} variant="default" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Coba Lagi
            </Button>
            <Button variant="outline" onClick={() => router.back()} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
