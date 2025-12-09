"use client";

import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { DoorOpen, Ruler, Hammer, PaintBucket, ShieldCheck } from "lucide-react";
import Image from "next/image";

export function CategoryBento() {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h2 className="text-3xl font-bold font-serif mb-4 text-foreground">Koleksi Wiradoor</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Temukan pintu yang sesuai dengan karakter hunian Anda. Dari solid wood klasik hingga engineering wood modern.</p>
      </div>

      <BentoGrid className="max-w-6xl mx-auto">
        {items.map((item, i) => (
          <BentoGridItem key={i} title={item.title} description={item.description} header={item.header} icon={item.icon} className={i === 0 || i === 3 ? "md:col-span-2" : ""} href={item.href} />
        ))}
      </BentoGrid>
    </section>
  );
}

const items = [
  {
    title: "Solid Wood Premium",
    description: "Kekuatan dan keindahan kayu asli (Merbau, Kamper, Jati) untuk pintu utama yang megah.",
    header: <Image src="https://images.pexels.com/photos/1002669/pexels-photo-1002669.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Solid Wood Door" fill className="object-cover object-center" />,
    icon: <DoorOpen className="h-6 w-6 text-primary" />,
    href: "/produk?category=solid-wood",
  },
  {
    title: "Engineering Wood",
    description: "Teknologi modern anti-susut dan anti-muai. Stabil dan presisi.",
    header: <Image src="https://images.pexels.com/photos/5696291/pexels-photo-5696291.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Engineering Door" fill className="object-cover object-center" />,
    icon: <Ruler className="h-6 w-6 text-primary" />,
    href: "/produk?category=engineering",
  },
  {
    title: "Custom Project",
    description: "Desain khusus sesuai visi arsitek dan kebutuhan proyek Anda.",
    header: <Image src="https://images.pexels.com/photos/8082560/pexels-photo-8082560.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Custom Door Project" fill className="object-cover object-center" />,
    icon: <Hammer className="h-6 w-6 text-primary" />,
    href: "/hubungi-kami",
  },
  {
    title: "Finishing Mewah",
    description: "Pilihan warna Duco, Melamine, dan PU yang tahan lama dan elegan.",
    header: <Image src="https://images.pexels.com/photos/276554/pexels-photo-276554.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Door Finishing" fill className="object-cover object-center" />,
    icon: <PaintBucket className="h-6 w-6 text-primary" />,
    href: "/produk",
  },
];
