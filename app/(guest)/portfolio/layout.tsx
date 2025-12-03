import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portofolio Proyek - Wiradoor Sumbar",
  description: "Lihat berbagai proyek pemasangan pintu yang telah kami selesaikan di Sumatera Barat.",
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
