import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconFileUnknown as FileQuestion, IconHome as Home } from "@tabler/icons-react";
import { MainNav } from "@/components/guest/layout/main-nav";
import { SiteFooter } from "@/components/guest/layout/site-footer";
import { ForceLightTheme } from "@/components/guest/layout/force-light-theme";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <ForceLightTheme />
      <MainNav />
      <main className="flex-grow flex items-center justify-center p-4 bg-background">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <FileQuestion className="h-10 w-10 text-muted-foreground" />
          </div>

          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-foreground">404</h1>
            <h2 className="text-xl font-semibold text-foreground">Halaman Tidak Ditemukan</h2>
            <p className="text-muted-foreground">Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button className="gap-2" render={<Link href="/" />} nativeButton={false}>
              <Home className="h-4 w-4" />
              Kembali ke Beranda
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              render={<Link href="/produk" />}
              nativeButton={false}>Lihat Katalog Produk</Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
