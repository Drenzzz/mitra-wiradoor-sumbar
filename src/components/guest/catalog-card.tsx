"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CatalogCardProps {
  id: string;
  name: string;
  category: string;
  description?: string;
  imageUrl: string;
  index: number;
}

export function CatalogCard({ id, name, category, description, imageUrl, index }: CatalogCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="group relative block">
      <Link href={`/produk/${id}`} className="block">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-neutral-100 dark:bg-neutral-800">
          <Image src={imageUrl} alt={name} fill className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />

          <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/20" />

          <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-lg">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{category}</p>
          <h3 className="font-serif text-xl font-medium text-foreground transition-colors group-hover:text-primary">{name}</h3>
          {description && <p className="line-clamp-1 text-sm text-muted-foreground/80">{description}</p>}
        </div>
      </Link>
    </motion.div>
  );
}
