"use client";

import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { CatalogCard } from "@/components/guest/catalog-card";
import { ProductCardSkeleton } from "@/components/guest/product-card-skeleton";
import { CatalogFilters } from "@/components/guest/catalog-filters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { Search, SlidersHorizontal, Loader2, ArrowDownUp } from "lucide-react";
import type { Product, Category } from "@/types";

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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

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
    <div className="flex flex-col lg:flex-row gap-12 relative items-start">
      {/* DESKTOP SIDEBAR (Sticky) */}
      <aside className="hidden lg:block w-64 sticky top-24 shrink-0">
        <CatalogFilters categories={categories} selectedCategory={selectedCategoryId} onSelectCategory={setSelectedCategoryId} />
      </aside>

      <div className="flex-1 w-full">
        {/* TOOLBAR: Search & Sort & Mobile Filter Trigger */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8 pb-6 border-b border-border/40">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Cari nama pintu..." className="pl-9 bg-background/50" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* MOBILE FILTER TRIGGER */}
            <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden w-1/2 sm:w-auto">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="font-serif text-left">Filter Produk</SheetTitle>
                  <SheetDescription className="text-left">Saring berdasarkan kategori pilihan Anda.</SheetDescription>
                </SheetHeader>
                <div className="mt-8">
                  <CatalogFilters
                    categories={categories}
                    selectedCategory={selectedCategoryId}
                    onSelectCategory={(id) => {
                      setSelectedCategoryId(id);
                      setIsMobileFilterOpen(false);
                    }}
                  />
                </div>
              </SheetContent>
            </Sheet>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-1/2 sm:w-[180px]">
                <ArrowDownUp className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Terbaru</SelectItem>
                <SelectItem value="createdAt-asc">Terlama</SelectItem>
                <SelectItem value="name-asc">Nama (A-Z)</SelectItem>
                <SelectItem value="name-desc">Nama (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* PRODUCT GRID */}
        {status === "error" ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="font-serif text-xl font-medium text-foreground">Gagal memuat produk</p>
            <p className="text-muted-foreground mt-2">Silakan coba muat ulang halaman.</p>
            <Button variant="outline" onClick={() => window.location.reload()} className="mt-6">
              Muat Ulang
            </Button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed rounded-lg">
            <p className="font-serif text-xl font-medium text-foreground">Tidak ada produk ditemukan</p>
            <p className="text-muted-foreground mt-2 max-w-sm">Coba ubah kata kunci pencarian atau ganti filter kategori.</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchInput("");
                setSelectedCategoryId("all");
              }}
              className="mt-4 text-primary"
            >
              Reset Semua Filter
            </Button>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
              {products.map((product: any, index: number) => (
                <CatalogCard key={product.id} id={product.id} imageUrl={product.imageUrl} category={product.category?.name || "Koleksi Eksklusif"} name={product.name} description={product.description} index={index % 9} />
              ))}
            </div>

            {/* Load More Trigger */}
            <div ref={ref} className="h-20 w-full flex items-center justify-center">
              {isFetchingNextPage ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="text-xs text-muted-foreground tracking-widest uppercase">Memuat produk...</span>
                </div>
              ) : hasNextPage ? (
                <span className="text-xs text-muted-foreground/50">Scroll untuk melihat lebih banyak</span>
              ) : products.length > 0 ? (
                <div className="flex items-center gap-4 w-full">
                  <div className="h-px flex-1 bg-border/50" />
                  <span className="text-xs text-muted-foreground/50 font-medium uppercase tracking-widest">End of Collection</span>
                  <div className="h-px flex-1 bg-border/50" />
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
