"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Category } from "@/types";
import { X } from "lucide-react";

interface CatalogFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  className?: string;
}

export function CatalogFilters({ categories, selectedCategory, onSelectCategory, className }: CatalogFiltersProps) {
  return (
    <div className={cn("space-y-8", className)}>
      <div>
        <h3 className="font-serif text-lg font-medium text-foreground mb-4">Kategori</h3>
        <div className="space-y-2">
          <button
            onClick={() => onSelectCategory("all")}
            className={cn("flex w-full items-center justify-between text-sm transition-colors hover:text-primary", selectedCategory === "all" ? "font-medium text-primary" : "text-muted-foreground")}
          >
            Semua Koleksi
            {selectedCategory === "all" && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={cn("flex w-full items-center justify-between text-sm transition-colors hover:text-primary", selectedCategory === category.id ? "font-medium text-primary" : "text-muted-foreground")}
            >
              {category.name}
              {selectedCategory === category.id && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
            </button>
          ))}
        </div>
      </div>

      <Separator className="bg-border/50" />

      <div>
        <h3 className="font-serif text-lg font-medium text-foreground mb-4">Material</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">Setiap pintu Wiradoor dibuat menggunakan kayu pilihan (Solid Wood) atau teknologi rekayasa (Engineering) yang telah melalui proses kiln-dry untuk stabilitas maksimal.</p>
      </div>
    </div>
  );
}
