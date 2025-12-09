"use client";

import Image from "next/image";
import Link from "next/link";
import { Tilt } from "@/components/ui/tilt";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

interface FeaturedProductCardProps {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  index: number;
}

export function FeaturedProductCard({ id, name, category, price, imageUrl, index }: FeaturedProductCardProps) {
  return (
    <Link href={`/produk/${id}`}>
      <Tilt className="group relative h-[450px] w-full cursor-pointer rounded-2xl bg-transparent">
        <div style={{ transform: "translateZ(50px)" }} className="absolute inset-4 z-10 flex flex-col justify-end rounded-xl p-6 text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <p className="text-sm font-medium uppercase tracking-widest text-primary-foreground/80">{category}</p>
            <h3 className="font-serif text-3xl font-bold leading-tight">{name}</h3>
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-white/90">
              Lihat Detail <ArrowUpRight className="h-4 w-4" />
            </div>
          </motion.div>
        </div>

        <div style={{ transform: "translateZ(0px)" }} className="relative h-full w-full overflow-hidden rounded-2xl bg-neutral-900 shadow-2xl transition-all duration-500 group-hover:shadow-primary/20">
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />

          <Image src={imageUrl} alt={name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        </div>

        <div className="absolute -bottom-10 left-0 right-0 z-0 mx-auto h-40 w-[90%] bg-primary/20 blur-3xl transition-all duration-500 group-hover:bg-primary/40" />
      </Tilt>

      <div className="mt-6 text-center md:hidden">
        <h3 className="font-serif text-xl font-bold">{name}</h3>
        <p className="text-sm text-muted-foreground">{category}</p>
      </div>
    </Link>
  );
}
