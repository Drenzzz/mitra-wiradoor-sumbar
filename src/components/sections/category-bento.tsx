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
    header: <Image src="https://images.unsplash.com/photo-1677468678917-310526a5ab15?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Solid Wood Door" fill className="object-cover object-center" />,
    icon: <DoorOpen className="h-6 w-6 text-primary" />,
    href: "/produk?category=solid-wood",
  },
  {
    title: "Engineering Wood",
    description: "Teknologi modern anti-susut dan anti-muai. Stabil dan presisi.",
    header: <Image src="https://images.unsplash.com/photo-1708180841204-db34dc5c00af?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Engineering Door" fill className="object-cover object-center" />,
    icon: <Ruler className="h-6 w-6 text-primary" />,
    href: "/produk?category=engineering",
  },
  {
    title: "Custom Project",
    description: "Desain khusus sesuai visi arsitek dan kebutuhan proyek Anda.",
    header: <Image src="https://images.pexels.com/photos/277559/pexels-photo-277559.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Custom Door Project" fill className="object-cover object-center" />,
    icon: <Hammer className="h-6 w-6 text-primary" />,
    href: "/hubungi-kami",
  },
  {
    title: "Finishing Mewah",
    description: "Pilihan warna Duco, Melamine, dan PU yang tahan lama dan elegan.",
    header: <Image src="https://images.pexels.com/photos/7166941/pexels-photo-7166941.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Door Finishing" fill className="object-cover object-center" />,
    icon: <PaintBucket className="h-6 w-6 text-primary" />,
    href: "/produk",
  },
];
