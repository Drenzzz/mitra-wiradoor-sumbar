import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalog Produk - Wiradoor Sumbar",
  description: "Jelajahi semua pilihan pintu berkualitas dari Wiradoor Sumatera Barat.",
};

export default function ProdukLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
