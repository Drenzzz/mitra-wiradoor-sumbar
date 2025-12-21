"use client";

import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";

interface PortfolioCardProps {
  id: string;
  title: string;
  category: string;
  location?: string;
  imageUrl: string;
  index: number;
}

export const PortfolioCard = memo(function PortfolioCard({ id, title, category, location, imageUrl, index }: PortfolioCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="group relative mb-6 break-inside-avoid">
      <Link href={`/portfolio/${id}`} className="block w-full">
        <div className="relative w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
          <Image
            src={imageUrl}
            alt={title}
            width={800}
            height={600}
            className="h-auto w-full object-cover transition-transform duration-700 will-change-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">{category}</p>
                <h3 className="font-serif text-xl font-bold text-white leading-tight mb-1">{title}</h3>
                {location && (
                  <div className="flex items-center gap-1 text-white/70 text-xs">
                    <MapPin className="h-3 w-3" />
                    <span>{location}</span>
                  </div>
                )}
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20 transition-colors hover:bg-primary hover:border-primary">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});
