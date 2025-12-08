"use client";

import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { ProductCard } from "@/components/guest/product-card";
import { ProductCardSkeleton } from "@/components/guest/product-card-skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { AlertTriangle, Info, Search, Filter, ArrowDownUp, Loader2 } from "lucide-react";
import type { Product, Category } from "@/types";
import { Button } from "@/components/ui/button";

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

  const { ref, inView } = useInView();

  const fetchProducts = async ({ pageParam = 1 }) => {
    console.log("🚀 Fetching Client Data...", { pageParam, debouncedSearchTerm, selectedCategoryId });  

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

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
  } = useInfiniteQuery({
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
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] gap-8">
      <aside className="hidden md:block">
        <div className="sticky top-24 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b">
            <Filter className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Filter</h2>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Kategori</label>
            <div className="flex flex-col gap-2">
              <Button variant={selectedCategoryId === "all" ? "default" : "ghost"} className="justify-start" onClick={() => setSelectedCategoryId("all")}>
                Semua Kategori
              </Button>
              {categories.map((cat) => (
                <Button key={cat.id} variant={selectedCategoryId === cat.id ? "default" : "ghost"} className="justify-start truncate" onClick={() => setSelectedCategoryId(cat.id)} title={cat.name}>
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <main>
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-background/50 backdrop-blur p-2 sticky top-16 z-10 rounded-lg">
          <div className="relative w-full sm:w-1/2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Cari pintu..." className="pl-9" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="md:hidden w-1/2">
              <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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

        {status === "error" && (
          <div className="flex flex-col items-center justify-center text-destructive bg-destructive/10 p-8 rounded-lg min-h-[300px]">
            <AlertTriangle className="w-12 h-12 mb-4" />
            <p className="font-semibold">Gagal memuat produk</p>
            <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
              Muat Ulang
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center text-muted-foreground bg-muted/30 p-12 rounded-lg border border-dashed min-h-[300px]">
            <Info className="w-12 h-12 mb-4 opacity-50" />
            <p className="font-semibold text-lg">Produk Tidak Ditemukan</p>
            <p className="text-sm text-center mt-2 max-w-xs">{debouncedSearchTerm ? `Tidak ada hasil untuk "${debouncedSearchTerm}"` : "Belum ada produk dalam kategori ini."}</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchInput("");
                setSelectedCategoryId("all");
              }}
              className="mt-4"
            >
              Reset Filter
            </Button>
          </div>
        )}

        {!isLoading && products.length > 0 && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product.id} slug={product.id} imageUrl={product.imageUrl} category={product.category?.name || "Tanpa Kategori"} name={product.name} description={product.description} />
              ))}

              {isFetchingNextPage && (
                <>
                  <ProductCardSkeleton />
                  <ProductCardSkeleton />
                  <ProductCardSkeleton />
                </>
              )}
            </div>

            <div ref={ref} className="h-20 w-full flex items-center justify-center opacity-50">
              {isFetchingNextPage ? (
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              ) : hasNextPage ? (
                <span className="text-xs text-muted-foreground">Scroll untuk memuat lebih banyak...</span>
              ) : (
                <span className="text-xs text-muted-foreground">Anda telah melihat semua produk.</span>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
