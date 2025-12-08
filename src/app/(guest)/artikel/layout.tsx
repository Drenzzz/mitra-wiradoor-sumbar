import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artikel & Wawasan - Wiradoor Sumbar",
  description: "Dapatkan wawasan, tips, dan berita terbaru dari dunia pintu dan desain interior.",
};

export default function ArtikelLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
