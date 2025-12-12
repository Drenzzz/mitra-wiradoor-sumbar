import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, MapPin, Users, Truck, Building2 } from "lucide-react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Button } from "@/components/ui/button";

import fotoMitra from "@/assets/foto_mitra_usaha.jpg";

export const metadata: Metadata = {
  title: "Tentang Kami - MR Konstruksi",
  description: "MR Konstruksi adalah distributor resmi pintu Wiradoor di Sumatera Barat. Kami menghadirkan pintu kayu engineering berkualitas ekspor dengan jaminan keaslian dan garansi resmi pabrik.",
  openGraph: {
    title: "Tentang Kami - MR Konstruksi | Wiradoor Sumbar",
    description: "Distributor resmi Wiradoor di Sumatera Barat. Menghadirkan pintu kayu engineering berkualitas ekspor.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tentang Kami - MR Konstruksi",
    description: "Distributor resmi Wiradoor di Sumatera Barat.",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <AuroraBackground className="min-h-[60vh] h-auto py-20">
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-slate-900/5 border border-slate-900/10 text-xs font-semibold tracking-widest uppercase text-slate-800">
            <ShieldCheck className="w-4 h-4" />
            <span>Authorized Distributor Wiradoor Sumbar</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-slate-900 mb-6 leading-tight">Membangun Kepercayaan Melalui Kualitas</h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">MR Konstruksi hadir sebagai jembatan inovasi, menghadirkan teknologi pintu kayu engineering standar ekspor ke jantung Sumatera Barat.</p>
        </div>
      </AuroraBackground>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-orange-500 rounded-2xl transform rotate-3 opacity-20 translate-x-4 translate-y-4 transition-transform group-hover:rotate-6"></div>

              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-100 aspect-[4/3] bg-slate-100">
                <Image
                  src={fotoMitra}
                  alt="Showroom MR Konstruksi"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">Lebih Dari Sekadar Distributor</h2>
                <div className="w-20 h-1.5 bg-orange-500 rounded-full mb-6"></div>
                <p className="text-slate-600 leading-loose text-lg">
                  Didirikan pada 17 Juli 2025, MR Konstruksi lahir dari sebuah visi sederhana: memberikan akses masyarakat Sumatera Barat terhadap produk pintu berkualitas dunia yang presisi, awet, dan estetis.
                </p>
                <p className="text-slate-600 leading-loose text-lg mt-4">
                  Sebagai mitra resmi Wiradoor, kami tidak hanya menjual produk. Kami memberikan edukasi teknis, solusi pemasangan, dan jaminan kualitas pabrikasi yang tidak bisa didapatkan dari industri konvensional biasa.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h3 className="text-3xl font-bold text-orange-600 mb-1">100+</h3>
                  <p className="text-sm font-medium text-slate-600">Proyek Terselesaikan</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h3 className="text-3xl font-bold text-orange-600 mb-1">15+</h3>
                  <p className="text-sm font-medium text-slate-600">Kabupaten/Kota</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">Pilar Keunggulan Kami</h2>
            <p className="text-slate-500">Standar operasional dan kualitas yang membedakan kami di pasar konstruksi.</p>
          </div>

          <BentoGrid className="max-w-5xl mx-auto">
            {features.map((item, i) => (
              <BentoGridItem key={i} title={item.title} description={item.description} header={item.header} icon={item.icon} className={i === 3 || i === 6 ? "md:col-span-2" : ""} />
            ))}
          </BentoGrid>
        </div>
      </section>

      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Siap Meningkatkan Kualitas Proyek Anda?</h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg">Diskusikan kebutuhan pintu untuk rumah pribadi, kantor, atau proyek pemerintahan Anda bersama konsultan ahli kami.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 h-12 text-base" asChild>
              <Link href="https://wa.me/6281234567890">Hubungi Kami via WhatsApp</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white px-8 h-12 text-base" asChild>
              <Link href="/produk">Lihat Koleksi Pintu</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}


const BentoImage = ({ src }: { src: string }) => (
  <div className="relative w-full h-full min-h-[6rem] rounded-xl overflow-hidden">
    <Image src={src} alt="Feature Image" fill className="object-cover transition-transform duration-500 group-hover/bento:scale-110" sizes="(max-width: 768px) 100vw, 33vw" />
    <div className="absolute inset-0 bg-black/20 group-hover/bento:bg-black/10 transition-colors" />
  </div>
);

const features = [
  {
    title: "Authorized Distributor",
    description: "Jaminan produk asli Wiradoor dengan garansi resmi pabrik.",
    header: <BentoImage src="https://images.unsplash.com/photo-1621645592814-245943c4c66d?q=80&w=800&auto=format&fit=crop" />,
    icon: <ShieldCheck className="h-4 w-4 text-white" />,
  },
  {
    title: "Teknologi Pabrikasi",
    description: "Pintu diproses dengan mesin presisi tinggi dan teknologi oven terkini.",
    header: <BentoImage src="https://images.unsplash.com/photo-1617103996702-96ff29b1c467?q=80&w=800&auto=format&fit=crop" />,
    icon: <Building2 className="h-4 w-4 text-white" />,
  },
  {
    title: "Konsultasi Ahli",
    description: "Tim kami siap membantu pemilihan spesifikasi teknis yang tepat.",
    header: <BentoImage src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop" />,
    icon: <Users className="h-4 w-4 text-white" />,
  },
  {
    title: "Showroom Fisik",
    description: "Kunjungi showroom kami di Bukittinggi untuk melihat dan merasakan langsung kualitas material kayu solid dan engineering wood kami.",
    header: <BentoImage src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop" />,
    icon: <MapPin className="h-4 w-4 text-white" />,
  },
  {
    title: "Jangkauan Luas",
    description: "Melayani pengiriman dan pemasangan ke seluruh Sumatera Barat.",
    header: <BentoImage src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop" />,
    icon: <Truck className="h-4 w-4 text-white" />,
  },
];
