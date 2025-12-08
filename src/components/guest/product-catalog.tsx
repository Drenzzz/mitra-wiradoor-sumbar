"use client";

import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { ProductCard } from "@/components/guest/product-card";
import { ProductCardSkeleton } from "@/components/guest/product-card-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { AlertTriangle, Info, ChevronLeft, ChevronRight, Search, Filter, ArrowDownUp } from "lucide-react";
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
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProducts = async () => {
    const query = new URLSearchParams({
      status: "active",
      limit: String(PRODUCTS_PER_PAGE),
      page: String(currentPage),
      sort: sortBy,
    });

    if (debouncedSearchTerm) {
      query.append("search", debouncedSearchTerm);
    }
    if (selectedCategoryId && selectedCategoryId !== "all") {
      query.append("categoryId", selectedCategoryId);
    }

    const res = await fetch(`/api/products?${query.toString()}`);
    if (!res.ok) throw new Error("Gagal memuat data produk.");
    return res.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["products-catalog", currentPage, debouncedSearchTerm, selectedCategoryId, sortBy],
    queryFn: fetchProducts,
    placeholderData: keepPreviousData,
    initialData: currentPage === 1 && !debouncedSearchTerm && selectedCategoryId === "all" && sortBy === "createdAt-desc" ? { data: initialProducts, totalCount: initialTotal } : undefined,
  });

  const products = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value === "all" ? "" : value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);


  return (
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] gap-8">
      <aside className="hidden md:block">
        <div className="sticky top-20 space-y-6">
          <h2 className="text-lg font-semibold flex items-center">
            <Filter className="w-5 h-5 mr-2 text-muted-foreground" />
            Filter
          </h2>
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium mb-2">
              Kategori
            </label>
            <Select value={selectedCategoryId} onValueChange={handleCategoryChange}>
              <SelectTrigger id="category-filter">
                <SelectValue placeholder="Pilih Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </aside>

      <main>
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-1/2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Cari nama produk..." className="pl-9" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
          </div>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full sm:w-auto sm:min-w-[180px]">
              <ArrowDownUp className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Urutkan berdasarkan..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-desc">Terbaru</SelectItem>
              <SelectItem value="createdAt-asc">Terlama</SelectItem>
              <SelectItem value="name-asc">Nama (A-Z)</SelectItem>
              <SelectItem value="name-desc">Nama (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error ? (
          <div className="flex flex-col items-center justify-center text-destructive bg-destructive/10 p-6 rounded-md min-h-[300px]">
            <AlertTriangle className="w-12 h-12 mb-4" />
            <p className="font-semibold">Oops! Terjadi Kesalahan</p>
            <p className="text-sm">Gagal memuat data produk.</p>
          </div>
        ) : isLoading && products.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-muted-foreground bg-muted/50 p-6 rounded-md min-h-[300px]">
            <Info className="w-12 h-12 mb-4" />
            <p className="font-semibold">Produk Tidak Ditemukan</p>
            <p className="text-sm text-center">{debouncedSearchTerm ? `Tidak ada produk yang cocok dengan pencarian "${debouncedSearchTerm}".` : "Belum ada produk yang tersedia saat ini."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: any) => (
              <ProductCard key={product.id} slug={product.id} imageUrl={product.imageUrl} category={product.category?.name || "Tanpa Kategori"} name={product.name} description={product.description} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Halaman <span className="font-semibold">{currentPage}</span> dari <span className="font-semibold">{totalPages}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={currentPage <= 1 || isLoading}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Sebelumnya
              </Button>
              <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage >= totalPages || isLoading}>
                Selanjutnya
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
