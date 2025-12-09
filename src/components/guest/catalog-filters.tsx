"use client";

import { cn } from "@/lib/utils";
import { Category } from "@/types";
import { Check } from "lucide-react";

interface CatalogFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  selectedSort: string;
  onSelectSort: (sort: string) => void;
  className?: string;
}

export function CatalogFilters({ categories, selectedCategory, onSelectCategory, selectedSort, onSelectSort, className }: CatalogFiltersProps) {
  const sortOptions = [
    { label: "Terbaru", value: "createdAt-desc" },
    { label: "Terlama", value: "createdAt-asc" },
    { label: "Nama A-Z", value: "name-asc" },
    { label: "Nama Z-A", value: "name-desc" },
  ];

  const allCategories = [{ id: "all", name: "Semua Koleksi" }, ...categories];

  return (
    <div className={cn("", className)}>
      <div className="pb-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground mb-4">Kategori</p>
        <div className="space-y-1">
          {allCategories.map((category) => {
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={cn(
                  "group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-all duration-200",
                  isActive ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <span className={cn("text-sm", isActive && "font-medium")}>{category.name}</span>
                {isActive && <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-border my-6" />

      <div className="pt-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground mb-4">Urutkan</p>
        <div className="grid grid-cols-2 gap-2">
          {sortOptions.map((option) => {
            const isActive = selectedSort === option.value;
            return (
              <button
                key={option.value}
                onClick={() => onSelectSort(option.value)}
                className={cn(
                  "flex h-11 items-center justify-center rounded-lg border text-sm transition-all duration-200",
                  isActive ? "border-primary bg-primary text-primary-foreground font-medium" : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
