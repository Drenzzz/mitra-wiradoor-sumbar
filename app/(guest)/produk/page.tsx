'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProductCard } from '@/components/guest/product-card';
import { ProductCardSkeleton } from '@/components/guest/product-card-skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from '@/hooks/use-debounce';
import { AlertTriangle, Info, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import type { Product, Category } from '@/types';

const PRODUCTS_PER_PAGE = 9; 

export default function ProdukPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchTerm = useDebounce(searchInput, 500);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(''); 

  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories?status=active&limit=100'); 
        if (!res.ok) {
          throw new Error('Gagal memuat kategori.');
        }
        const data = await res.json();
        setCategories(data.data || []);
      } catch (err: any) {
        console.error("Fetch categories error:", err);
      }
    };
    fetchCategories();
  }, []);

  const fetchProducts = useCallback(async (page: number, search: string, categoryId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({
        status: 'active',
        limit: String(PRODUCTS_PER_PAGE),
        page: String(page),
      });

      if (search) {
        query.append('search', search);
      }      
      if (categoryId) {
        query.append('categoryId', categoryId);
      }
      const res = await fetch(`/api/products?${query.toString()}`, {
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error('Gagal memuat data produk.');
      }

      const data = await res.json();
      setProducts(data.data || []);
      setTotalCount(data.totalCount || 0);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || 'Terjadi kesalahan saat mengambil data.');
      setProducts([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(currentPage, debouncedSearchTerm, selectedCategoryId);
  }, [currentPage, debouncedSearchTerm, selectedCategoryId, fetchProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedCategoryId]);   

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value === 'all' ? '' : value);
  };
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Katalog Produk
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Jelajahi semua pilihan pintu berkualitas dari Wiradoor Sumatera Barat. Temukan solusi yang tepat untuk kebutuhan Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] gap-8">
<aside className="hidden md:block">
          <div className="sticky top-20 space-y-6">
            <h2 className="text-lg font-semibold flex items-center">
              <Filter className="w-5 h-5 mr-2 text-muted-foreground"/>
              Filter
            </h2>
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium mb-2">Kategori</label>
              <Select
                value={selectedCategoryId || 'all'}
                onValueChange={handleCategoryChange}
              >
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
             <div>
               <label className="block text-sm font-medium mb-2">Harga </label>
               <div className="h-20 bg-muted rounded-md animate-pulse"></div>
            </div>
          </div>
        </aside>

        <main>
          <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-1/2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari nama produk..."
                className="pl-9"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
             <div className="h-9 bg-muted rounded-md animate-pulse w-full sm:w-[180px]"></div>
          </div>

          {error ? (
             <div className="flex flex-col items-center justify-center text-destructive bg-destructive/10 p-6 rounded-md min-h-[300px]">
               <AlertTriangle className="w-12 h-12 mb-4" />
               <p className="font-semibold">Oops! Terjadi Kesalahan</p>
               <p className="text-sm">{error}</p>
             </div>
          ) : isLoading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : !isLoading && products.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-muted-foreground bg-muted/50 p-6 rounded-md min-h-[300px]">
              <Info className="w-12 h-12 mb-4" />
              <p className="font-semibold">Produk Tidak Ditemukan</p>
              <p className="text-sm text-center">
                {debouncedSearchTerm
                  ? `Tidak ada produk yang cocok dengan pencarian "${debouncedSearchTerm}".`
                  : 'Belum ada produk yang tersedia saat ini.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  slug={product.id}
                  imageUrl={product.imageUrl}
                  category={product.category?.name || 'Tanpa Kategori'}
                  name={product.name}
                  description={product.description}
                />
              ))}
            </div>
          )}

           {!error && totalPages > 1 && (
             <div className="mt-8 flex items-center justify-between">
               <div className="text-sm text-muted-foreground">
                 Halaman <span className="font-semibold">{currentPage}</span> dari <span className="font-semibold">{totalPages}</span>
               </div>

               <div className="flex items-center space-x-2">
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={handlePreviousPage}
                   disabled={currentPage <= 1 || isLoading}
                 >
                   <ChevronLeft className="h-4 w-4 mr-1" />
                   Sebelumnya
                 </Button>
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={handleNextPage}
                   disabled={currentPage >= totalPages || isLoading}
                 >
                   Selanjutnya
                   <ChevronRight className="h-4 w-4 ml-1" />
                 </Button>
               </div>
             </div>
           )}

        </main>
      </div>
    </div>
  );
}
