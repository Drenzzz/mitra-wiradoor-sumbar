"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PortfolioCard } from "@/components/guest/portfolio-card";
import { PortfolioCardSkeleton } from "@/components/guest/portfolio-card-skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { Search, Filter, AlertTriangle, Info, ChevronLeft, ChevronRight } from "lucide-react";
import type { PortfolioItem, PortfolioCategory } from "@/types";

const ITEMS_PER_PAGE = 9;

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch("/api/portfolio-categories?status=active&limit=100");
        if (res.ok) {
          const { data } = await res.json();
          setCategories(data);
        }
      } catch (e) {
        console.error("Gagal memuat kategori portofolio");
      }
    };
    fetchCats();
  }, []);

  const fetchPortfolio = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(ITEMS_PER_PAGE),
        sort: "projectDate-desc",
      });

      if (debouncedSearch) params.append("search", debouncedSearch);
      if (selectedCategory && selectedCategory !== "all") params.append("categoryId", selectedCategory);

      const res = await fetch(`/api/portfolio?${params.toString()}`);
      if (!res.ok) throw new Error("Gagal memuat data portofolio.");

      const { data, totalCount } = await res.json();
      setItems(data);
      setTotalCount(totalCount);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearch, selectedCategory]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategory]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Portofolio Proyek</h1>
        <p className="text-lg text-muted-foreground">Bukti nyata kualitas kerja kami. Lihat berbagai proyek pemasangan pintu yang telah kami selesaikan di Sumatera Barat.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between bg-muted/30 p-4 rounded-lg">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari proyek..." className="pl-9 bg-background" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px] bg-background">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center py-12 text-destructive bg-destructive/5 rounded-lg">
          <AlertTriangle className="w-12 h-12 mb-4" />
          <p className="font-semibold">Terjadi Kesalahan</p>
          <p className="text-sm">{error}</p>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <PortfolioCardSkeleton key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
          <Info className="w-12 h-12 mb-4 opacity-50" />
          <h3 className="text-lg font-medium">Tidak Ada Proyek Ditemukan</h3>
          <p className="text-sm mt-1">Coba ubah kata kunci pencarian atau filter kategori Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {!isLoading && !error && totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-4">
          <Button variant="outline" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1}>
            <ChevronLeft className="h-4 w-4 mr-2" /> Sebelumnya
          </Button>
          <span className="text-sm text-muted-foreground">
            Halaman {currentPage} dari {totalPages}
          </span>
          <Button variant="outline" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>
            Selanjutnya <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
