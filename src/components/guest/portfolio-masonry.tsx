"use client";

import { useState } from "react";
import { PortfolioCard } from "@/components/guest/portfolio-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PortfolioItem } from "@/db/schema";
import { motion, AnimatePresence } from "framer-motion";

type PortfolioWithCategory = PortfolioItem & {
  category: { name: string };
};

interface PortfolioMasonryProps {
  items: PortfolioWithCategory[];
  categories: { id: string; name: string }[];
}

export function PortfolioMasonry({ items, categories }: PortfolioMasonryProps) {
  const [filter, setFilter] = useState("all");

  const filteredItems = filter === "all" ? items : items.filter((item) => item.portfolioCategoryId === filter);

  return (
    <div className="space-y-12">
      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")} className={cn("rounded-full px-6 transition-all", filter === "all" ? "shadow-lg shadow-primary/25" : "border-border/50 bg-transparent")}>
          Semua Proyek
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={filter === cat.id ? "default" : "outline"}
            onClick={() => setFilter(cat.id)}
            className={cn("rounded-full px-6 transition-all", filter === cat.id ? "shadow-lg shadow-primary/25" : "border-border/50 bg-transparent")}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      <div className="min-h-[50vh]">
        <AnimatePresence mode="wait">
          <motion.div key={filter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredItems.map((item, index) => (
              <PortfolioCard key={item.id} id={item.id} title={item.title} category={item.category.name} imageUrl={item.imageUrl} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-xl bg-muted/20">
            <p className="font-serif text-xl font-medium">Belum ada proyek di kategori ini</p>
            <Button variant="link" onClick={() => setFilter("all")} className="mt-2 text-primary">
              Lihat semua proyek
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
