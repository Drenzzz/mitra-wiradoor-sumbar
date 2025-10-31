'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArticleCard } from '@/components/guest/article-card';
import { ArticleCardSkeleton } from '@/components/guest/article-card-skeleton';
import { Button } from '@/components/ui/button'; 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";  
import { AlertTriangle, Info, ChevronLeft, ChevronRight, Filter, Search } from 'lucide-react';
import type { Article, ArticleCategory } from '@/types';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';

const ARTICLES_PER_PAGE = 2;

export default function ArtikelPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalCount / ARTICLES_PER_PAGE);

  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchTerm = useDebounce(searchInput, 500);

  useEffect(() => {
    const fetchArticleCategories = async () => {
      try {
        const res = await fetch('/api/article-categories?status=active&limit=100');
        if (!res.ok) {
          throw new Error('Gagal memuat kategori artikel.');
        }
        const data = await res.json();
        setCategories(data.data || []);
      } catch (err: any) {
        console.error("Fetch article categories error:", err);
      }
    };
    fetchArticleCategories();
  }, []);

  const fetchArticles = useCallback(async (page: number, categoryId?: string, search?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({
        status: 'active',
        statusFilter: 'PUBLISHED',
        limit: String(ARTICLES_PER_PAGE),
        page: String(page),
        sort: 'createdAt-desc',
      });

      if (categoryId) {
        query.append('categoryId', categoryId);
      }

      if (search) {
        query.append('search', search);
      }

      const res = await fetch(`/api/articles?${query.toString()}`, {
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error('Gagal memuat data artikel.');
      }

      const data = await res.json();
      setArticles(data.data || []);
      setTotalCount(data.totalCount || 0);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || 'Terjadi kesalahan saat mengambil data.');
      setArticles([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

useEffect(() => {
    fetchArticles(currentPage, selectedCategoryId, debouncedSearchTerm);
  }, [currentPage, selectedCategoryId, debouncedSearchTerm, fetchArticles]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategoryId, debouncedSearchTerm]);

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
          Artikel & Wawasan
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Dapatkan wawasan, tips, dan berita terbaru dari dunia pintu dan desain interior.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] gap-8">

      <aside className="hidden md:block">
          <div className="sticky top-20 space-y-6">
            <h2 className="text-lg font-semibold flex items-center">
              <Filter className="w-5 h-5 mr-2 text-muted-foreground" />
              Filter & Cari
            </h2>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari judul artikel..."
                className="pl-9"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="article-category-filter" className="block text-sm font-medium mb-2">Kategori Artikel</label>
              <Select
                value={selectedCategoryId || 'all'}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger id="article-category-filter">
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
          {error ? (
            <div className="flex flex-col items-center justify-center text-destructive bg-destructive/10 p-6 rounded-md min-h-[300px]">
              <AlertTriangle className="w-12 h-12 mb-4" />
              <p className="font-semibold">Oops! Terjadi Kesalahan</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : isLoading && articles.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Array.from({ length: 4 }).map((_, index) => (
                <ArticleCardSkeleton key={index} />
              ))}
            </div>
          ) : !isLoading && articles.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-muted-foreground bg-muted/50 p-6 rounded-md min-h-[300px]">
               <Info className="w-12 h-12 mb-4" />
               <p className="font-semibold">Artikel Tidak Ditemukan</p>
              <p className="text-sm text-center">
                 {selectedCategoryId || debouncedSearchTerm
                   ? 'Tidak ada artikel yang cocok dengan filter atau pencarian Anda.'
                   : 'Belum ada artikel yang dipublikasikan.'}
               </p>
            </div>
           ) : (
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${isLoading ? 'opacity-50 transition-opacity' : ''}`}>
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
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
