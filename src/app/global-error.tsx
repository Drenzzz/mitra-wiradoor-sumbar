"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900">Terjadi Kesalahan</h1>
            <p className="text-slate-600">Maaf, terjadi kesalahan yang tidak terduga. Silakan coba muat ulang halaman atau kembali ke beranda.</p>
          </div>

          {error.digest && <p className="text-xs text-slate-400 font-mono bg-slate-100 px-3 py-2 rounded-lg inline-block">Error ID: {error.digest}</p>}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={reset} variant="default" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Coba Lagi
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                Kembali ke Beranda
              </Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
