import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";

const onest = Onest({ subsets: ["latin"], variable: "--font-onest" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: {
    default: "Wiradoor Sumatera Barat - Distributor Pintu Premium",
    template: "%s | Wiradoor Sumbar",
  },
  description: "Distributor resmi pintu premium berkualitas ekspor dari Wiradoor.",
  openGraph: {
    title: "Wiradoor Sumatera Barat",
    description: "Distributor resmi pintu premium berkualitas ekspor dari Wiradoor.",
    url: "/",
    siteName: "Wiradoor Sumbar",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wiradoor Sumatera Barat",
    description: "Distributor resmi pintu premium berkualitas ekspor dari Wiradoor.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
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
