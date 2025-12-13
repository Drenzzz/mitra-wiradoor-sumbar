"use client";

import { X } from "lucide-react";
import type { Category } from "@/types";

interface CatalogActiveFiltersProps {
  categories: Category[];
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  debouncedSearchTerm: string;
  setSearchInput: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
}

export function CatalogActiveFilters({ categories, selectedCategoryId, setSelectedCategoryId, debouncedSearchTerm, setSearchInput, sortBy, setSortBy }: CatalogActiveFiltersProps) {
  const isFiltering = debouncedSearchTerm !== "" || selectedCategoryId !== "all" || sortBy !== "createdAt-desc";

  if (!isFiltering) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
      <span className="text-xs text-muted-foreground uppercase tracking-widest mr-2">Active Filters:</span>

      {selectedCategoryId !== "all" && (
        <div className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-medium border border-primary/20">
          {categories.find((c) => c.id === selectedCategoryId)?.name}
          <X className="w-3 h-3 cursor-pointer hover:text-destructive transition-colors ml-1" onClick={() => setSelectedCategoryId("all")} />
        </div>
      )}

      {debouncedSearchTerm && (
        <div className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-medium border border-primary/20">
          Search: &quot;{debouncedSearchTerm}&quot;
          <X className="w-3 h-3 cursor-pointer hover:text-destructive transition-colors ml-1" onClick={() => setSearchInput("")} />
        </div>
      )}

      {sortBy !== "createdAt-desc" && (
        <div className="flex items-center gap-1 bg-secondary/30 text-secondary-foreground text-xs px-3 py-1 rounded-full font-medium border border-secondary/20">
          Sorted
          <X className="w-3 h-3 cursor-pointer hover:text-destructive transition-colors ml-1" onClick={() => setSortBy("createdAt-desc")} />
        </div>
      )}
    </div>
  );
}
