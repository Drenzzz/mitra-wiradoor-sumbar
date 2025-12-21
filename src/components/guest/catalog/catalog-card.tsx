"use client";

import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface CatalogCardProps {
  id: string;
  name: string;
  category: string;
  description?: string;
  imageUrl: string;
  index: number;
}

export const CatalogCard = memo(function CatalogCard({ id, name, category, description, imageUrl, index }: CatalogCardProps) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: index * 0.05 }} className="group relative block">
      <Link href={`/produk/${id}`} className="block">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-neutral-100 dark:bg-neutral-800">
          <Image src={imageUrl} alt={name} fill className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />

          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
        </div>

        <div className="mt-3 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/80">{category}</p>
            <h3 className="font-serif text-lg font-medium text-foreground leading-tight transition-colors group-hover:text-primary">{name}</h3>
          </div>

          <div className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            <ArrowRight className="h-5 w-5 text-primary" strokeWidth={1.5} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
});
