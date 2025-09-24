'use client';

import { useState, useEffect, useCallback } from 'react';
import { Article } from '@/types';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from 'sonner';

export function useArticleManagement() {
  const [articles, setArticles] = useState<{ active: Article[], trashed: Article[] }>({ active: [], trashed: [] });
  const [totals, setTotals] = useState({ active: 0, trashed: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt-desc');
  const [filterByCategory, setFilterByCategory] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchByStatus = async (status: 'active' | 'trashed') => {
        const params = new URLSearchParams({
          status,
          sort: sortBy,
          page: activeTab === status ? String(currentPage) : '1',
          limit: String(rowsPerPage),
        });
        if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
        if (filterByCategory) params.append('categoryId', filterByCategory);
        
        const response = await fetch(`/api/articles?${params.toString()}`);
        if (!response.ok) throw new Error(`Gagal memuat artikel ${status}`);
        return response.json();
      };

      const [activeRes, trashedRes] = await Promise.all([
        fetchByStatus('active'),
        fetchByStatus('trashed')
      ]);

      setArticles({ active: activeRes.data, trashed: trashedRes.data });
      setTotals({ active: activeRes.totalCount, trashed: trashedRes.totalCount });

    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, sortBy, filterByCategory, currentPage, rowsPerPage, activeTab]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, sortBy, filterByCategory, activeTab]);

  return {
    articles,
    totals,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    activeTab,
    setActiveTab,
    filterByCategory,
    setFilterByCategory,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    fetchArticles,
  };
}