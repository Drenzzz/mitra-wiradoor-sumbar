'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArticleCard } from '@/components/guest/article-card';
import { ArticleCardSkeleton } from '@/components/guest/article-card-skeleton';
import { Button } from '@/components/ui/button'; 
import { AlertTriangle, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Article } from '@/types';

const ARTICLES_PER_PAGE = 2;

export default function ArtikelPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalCount / ARTICLES_PER_PAGE);

  const fetchArticles = useCallback(async (page: number) => {
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
    fetchArticles(currentPage);
  }, [currentPage, fetchArticles]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
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
            <h2 className="text-lg font-semibold">Filter & Cari</h2>
            <div className="h-9 w-full bg-muted rounded-md animate-pulse"></div>
            <div>
              <div className="h-5 w-1/2 bg-muted rounded-md mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-muted rounded-md animate-pulse"></div>
                <div className="h-4 w-3/4 bg-muted rounded-md animate-pulse"></div>
              </div>
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
                <p className="font-semibold">Belum Ada Artikel</p>
                <p className="text-sm">Silakan cek kembali nanti.</p>
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
