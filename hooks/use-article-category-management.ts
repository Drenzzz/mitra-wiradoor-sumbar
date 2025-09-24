'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArticleCategory } from '@/types';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from 'sonner';

export function useArticleCategoryManagement() {
  const [categories, setCategories] = useState<{ active: ArticleCategory[], trashed: ArticleCategory[] }>({ active: [], trashed: [] });
  const [totals, setTotals] = useState({ active: 0, trashed: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [activeTab, setActiveTab] = useState('active');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchByStatus = async (status: 'active' | 'trashed') => {
        const query = new URLSearchParams({
          status,
          search: debouncedSearchTerm,
          sort: sortBy,
          page: activeTab === status ? String(currentPage) : '1',
          limit: String(rowsPerPage),
        });

        const response = await fetch(`/api/article-categories?${query.toString()}`);
        if (!response.ok) throw new Error(`Gagal memuat kategori ${status}`);
        return response.json();
      };

      const [activeRes, trashedRes] = await Promise.all([
        fetchByStatus('active'),
        fetchByStatus('trashed')
      ]);

      setCategories({ active: activeRes.data, trashed: trashedRes.data });
      setTotals({ active: activeRes.totalCount, trashed: trashedRes.totalCount });

    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, sortBy, currentPage, rowsPerPage, activeTab]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, sortBy, activeTab]);

  return {
    categories,
    totals,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    activeTab,
    setActiveTab,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    fetchCategories,
  };
}
