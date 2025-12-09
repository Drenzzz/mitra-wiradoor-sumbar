"use client";

import Link from "next/link";
import { MapPin, Phone, Clock, FileText, ArrowRight, Instagram, Facebook, ShieldCheck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || "MR KONSTRUKSI";
  const companyAddress = process.env.NEXT_PUBLIC_COMPANY_ADDRESS || "Alamat belum diatur";
  const googleMapsUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL || "#";
  const phoneDisplay = process.env.NEXT_PUBLIC_CONTACT_PHONE || "+62 812-3456-7890";
  const waNumber = process.env.NEXT_PUBLIC_CONTACT_WA || "6281234567890";
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "admin@example.com";

  const socialIg = process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "#";
  const socialFb = process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || "#";

  return (
    <footer className="bg-slate-950 text-slate-200 border-t border-slate-800">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold tracking-tight text-white">{companyName}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Distributor resmi Wiradoor untuk wilayah Sumatera Barat. Menyediakan solusi pintu kayu engineering standar ekspor untuk hunian, komersial, dan proyek pemerintahan.</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Authorized Distributor</span>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold tracking-widest text-white uppercase">Showroom</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="leading-relaxed hover:text-white transition-colors">
                  {companyAddress}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-orange-500 shrink-0" />
                <span>Senin - Sabtu: 08.00 - 17.00 WIB</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-orange-500 shrink-0" />
                <a href={`tel:${phoneDisplay}`} className="hover:text-white transition-colors">
                  {phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-orange-500 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold tracking-widest text-white uppercase">Resources</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link href="/produk" className="hover:text-orange-500 transition-colors flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" /> Katalog Produk
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-orange-500 transition-colors flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" /> Portfolio Proyek
                </Link>
              </li>
              <li>
                <Link href="/tentang-kami" className="hover:text-orange-500 transition-colors flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" /> Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-orange-500 transition-colors flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" /> FAQ & Bantuan
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold tracking-widest text-white uppercase">Proyek & Kerjasama</h4>
            <p className="text-slate-400 text-sm leading-relaxed">Butuh penawaran untuk proyek kontraktor atau pengadaan dalam jumlah besar?</p>
            <div className="flex flex-col gap-3">
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white" asChild>
                <Link href={`https://wa.me/${waNumber}`} target="_blank">
                  Konsultasi via WhatsApp
                </Link>
              </Button>
              <Button variant="outline" className="w-full border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white" asChild>
                <Link href={`mailto:${email}`}>Kirim Penawaran Email</Link>
              </Button>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-800 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href={socialIg} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
            <a href={socialFb} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
