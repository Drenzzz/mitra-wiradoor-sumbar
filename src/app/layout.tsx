import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { OrganizationJsonLd, LocalBusinessJsonLd } from "@/components/seo/json-ld";

const onest = Onest({ subsets: ["latin"], variable: "--font-onest", display: "swap" });

const siteUrl = process.env.NEXTAUTH_URL || "https://wiradoorsumbar.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Wiradoor Sumatera Barat - Distributor Pintu Premium",
    template: "%s | Wiradoor Sumbar",
  },
  description: "Distributor resmi pintu premium berkualitas ekspor dari Wiradoor. Melayani penjualan dan pemasangan pintu kayu engineering di seluruh Sumatera Barat.",
  keywords: ["wiradoor", "wiradoor sumbar", "pintu wiradoor", "distributor pintu", "pintu kayu", "pintu premium", "pintu sumatera barat", "pintu bukittinggi", "pintu engineering wood"],
  authors: [{ name: "MR Konstruksi" }],
  creator: "MR Konstruksi",
  publisher: "Wiradoor Sumbar",
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
    title: "Wiradoor Sumatera Barat - Distributor Pintu Premium",
    description: "Distributor resmi pintu premium berkualitas ekspor dari Wiradoor. Melayani penjualan dan pemasangan pintu kayu engineering di seluruh Sumatera Barat.",
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
    title: "Wiradoor Sumatera Barat - Distributor Pintu Premium",
    description: "Distributor resmi pintu premium berkualitas ekspor dari Wiradoor.",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  category: "business",
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
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
