import type { Metadata } from "next";
import { Suspense } from "react";
import { Onest } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { OrganizationJsonLd, LocalBusinessJsonLd } from "@/components/seo/json-ld";
import { NavigationProgress } from "@/components/navigation-progress";

const onest = Onest({ subsets: ["latin"], variable: "--font-onest", display: "swap" });

const siteUrl = process.env.NEXTAUTH_URL || "https://wiradoorsumbar.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Wiradoor Sumatera Barat - Pusat Pintu Engineering Premium",
    template: "%s | Wiradoor Sumbar",
  },
  description: "Distributor Resmi Pintu Wiradoor Sumatera Barat. Sedia Pintu Engineering, HDF, Kusen & Jendela berkualitas Premium. Anti Rayap & Susut. Melayani Padang, Bukittinggi & seluruh Sumbar.",
  keywords: [
    "wiradoor",
    "wiradoor sumbar",
    "pintu wiradoor",
    "distributor pintu padang",
    "toko pintu sumatera barat",
    "pintu engineering wood",
    "pintu HDF",
    "pintu tahan rayap",
    "pintu rumah minimalis",
    "pintu kamar mandi",
    "kusen wpc",
    "kusen kayu",
    "jendela",
    "pintu bukittinggi",
    "pintu payakumbuh",
    "pintu solok",
    "pintu pariaman",
    "pintu batusangkar",
    "pintu lubuk basung",
    "pintu painan",
    "MR Konstruksi",
  ],
  authors: [{ name: "MR Konstruksi", url: siteUrl }],
  creator: "MR Konstruksi",
  publisher: "Wiradoor Sumbar",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
    languages: {
      "id-ID": "/",
    },
  },
  openGraph: {
    title: "Wiradoor Sumatera Barat - Pusat Pintu Engineering Premium",
    description: "Solusi pintu rumah berkualitas di Sumbar. Tahan rayap, tidak susut/memuai, garansi produk. Kunjungi showroom kami di Padang.",
    url: siteUrl,
    siteName: "Wiradoor Sumbar",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Wiradoor Sumatera Barat - Distributor Pintu Premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wiradoor Sumatera Barat - Pusat Pintu Engineering Premium",
    description: "Solusi pintu rumah berkualitas di Sumbar. Tahan rayap, garansi produk.",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  category: "Home Improvement",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <OrganizationJsonLd />
        <LocalBusinessJsonLd />
      </head>
      <body className={onest.className}>
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
