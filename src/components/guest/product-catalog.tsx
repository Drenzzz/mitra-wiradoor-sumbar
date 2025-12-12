"use client";

import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { CatalogCard } from "@/components/guest/catalog-card";
import { ProductCardSkeleton } from "@/components/guest/product-card-skeleton";
import { CatalogFilters } from "@/components/guest/catalog-filters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { useDebounce } from "@/hooks/use-debounce";
import { Search, SlidersHorizontal, Loader2, X } from "lucide-react";
import type { Product, Category } from "@/types";
import { cn } from "@/lib/utils";

interface ProductCatalogProps {
  initialProducts: Product[];
  initialTotal: number;
  categories: Category[];
}

const PRODUCTS_PER_PAGE = 9;

export function ProductCatalog({ initialProducts, initialTotal, categories }: ProductCatalogProps) {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchTerm = useDebounce(searchInput, 500);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("createdAt-desc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { ref, inView } = useInView();

  const fetchProducts = async ({ pageParam = 1 }) => {
    const query = new URLSearchParams({
      status: "active",
      limit: String(PRODUCTS_PER_PAGE),
      page: String(pageParam),
      sort: sortBy,
    });

    if (debouncedSearchTerm) query.append("search", debouncedSearchTerm);
    if (selectedCategoryId && selectedCategoryId !== "all") query.append("categoryId", selectedCategoryId);

    const res = await fetch(`/api/products?${query.toString()}`);
    if (!res.ok) throw new Error("Gagal memuat data produk.");
    return res.json();
  };

  const isFiltering = debouncedSearchTerm !== "" || selectedCategoryId !== "all" || sortBy !== "createdAt-desc";

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, isLoading } = useInfiniteQuery({
    queryKey: ["products-catalog", debouncedSearchTerm, selectedCategoryId, sortBy],
    queryFn: fetchProducts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.ceil(lastPage.totalCount / PRODUCTS_PER_PAGE);
      const nextPage = allPages.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    initialData: isFiltering
      ? undefined
      : {
          pages: [{ data: initialProducts, totalCount: initialTotal }],
          pageParams: [1],
        },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const products = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="flex flex-col gap-8 min-h-screen">
      <div className="sticky top-24 z-30 mx-auto w-full max-w-5xl">
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
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchInput("");
                        setSelectedCategoryId("all");
                        setSortBy("createdAt-desc");
                      }}
                      className="flex-1"
                    >
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

          {isFiltering && (
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
                  Search: "{debouncedSearchTerm}"
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
          )}
        </div>
      </div>

      <div className="w-full">
        {status === "error" ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="font-serif text-xl font-medium text-foreground">Gagal memuat produk</p>
            <Button variant="outline" onClick={() => window.location.reload()} className="mt-6">
              Muat Ulang
            </Button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed rounded-xl bg-muted/20">
            <p className="font-serif text-xl font-medium text-foreground">Koleksi tidak ditemukan</p>
            <p className="text-muted-foreground mt-2 max-w-sm">Coba sesuaikan filter pencarian Anda.</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchInput("");
                setSelectedCategoryId("all");
                setSortBy("createdAt-desc");
              }}
              className="mt-4 text-primary"
            >
              Lihat Semua Koleksi
            </Button>
          </div>
        ) : (
          <div className="space-y-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {products.map((product: any, index: number) => (
                <div key={product.id} className={cn("transition-all duration-700", index % 3 === 1 ? "lg:mt-8" : "")}>
                  <CatalogCard id={product.id} imageUrl={product.imageUrl} category={product.category?.name || "Koleksi Eksklusif"} name={product.name} description={product.description} index={index % 9} />
                </div>
              ))}
            </div>

            <div ref={ref} className="h-32 w-full flex items-center justify-center">
              {isFetchingNextPage ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
                  <span className="text-xs text-muted-foreground tracking-[0.2em] uppercase">Memuat Koleksi...</span>
                </div>
              ) : hasNextPage ? (
                <span className="text-xs text-muted-foreground/30">Scroll untuk melihat lebih banyak</span>
              ) : (
                <div className="flex items-center gap-4 w-full max-w-md mx-auto opacity-50">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.3em]">End of Gallery</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
