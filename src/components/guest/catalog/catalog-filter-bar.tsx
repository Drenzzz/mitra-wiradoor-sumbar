"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { CatalogFilters } from "@/components/guest/catalog/catalog-filters";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

interface CatalogFilterBarProps {
  categories: Category[];
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  searchInput: string;
  setSearchInput: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  isFiltering: boolean;
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  onReset: () => void;
}

export function CatalogFilterBar({ categories, selectedCategoryId, setSelectedCategoryId, searchInput, setSearchInput, sortBy, setSortBy, isFiltering, isFilterOpen, setIsFilterOpen, onReset }: CatalogFilterBarProps) {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg shadow-black/5 border border-slate-100 p-4 md:p-5">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <div className="flex gap-2">
            <Button variant={selectedCategoryId === "all" ? "default" : "outline"} size="sm" onClick={() => setSelectedCategoryId("all")} className="rounded-full px-6 font-medium transition-all">
              Semua
            </Button>
            {categories.map((cat) => (
              <Button key={cat.id} variant={selectedCategoryId === cat.id ? "default" : "outline"} size="sm" onClick={() => setSelectedCategoryId(cat.id)} className="rounded-full whitespace-nowrap transition-all">
                {cat.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari koleksi..."
              className="pl-9 h-10 rounded-full bg-slate-50 border-slate-200 focus:bg-white focus:border-primary/50 transition-all"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className={cn("h-10 rounded-full px-5 gap-2 border-slate-200 hover:border-primary hover:text-primary transition-all", isFiltering && "border-primary text-primary bg-primary/5")}>
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filter & Sort</span>
                {isFiltering && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[340px] sm:w-[400px] flex flex-col h-full">
              <SheetHeader className="pb-6 border-b">
                <SheetTitle className="font-serif text-3xl font-medium">Refine</SheetTitle>
                <SheetDescription>Sesuaikan tampilan koleksi Anda.</SheetDescription>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto py-6 px-6">
                <CatalogFilters categories={categories} selectedCategory={selectedCategoryId} onSelectCategory={setSelectedCategoryId} selectedSort={sortBy} onSelectSort={setSortBy} />
              </div>

              <SheetFooter className="pt-4 border-t flex flex-row gap-3 sm:justify-between">
                <Button variant="outline" onClick={onReset} className="flex-1">
                  Reset
                </Button>
                <SheetClose asChild>
                  <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">Terapkan</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
