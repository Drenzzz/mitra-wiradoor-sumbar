'use client';

import { useState, useEffect, useCallback } from 'react';
import { PortfolioItem, PortfolioCategory } from '@/types';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from 'sonner';

export function usePortfolioManagement() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterByCategory, setFilterByCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/portfolio-categories?status=active&limit=100');
      if (response.ok) {
        const { data } = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch portfolio categories:", error);
    }
  }, []);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(rowsPerPage),
        sort: 'projectDate-desc',
      });

      if (debouncedSearchTerm) {
        params.append('search', debouncedSearchTerm);
      }

      if (filterByCategory && filterByCategory !== 'all') {
        params.append('categoryId', filterByCategory);
      }

      const response = await fetch(`/api/portfolio?${params.toString()}`);
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Gagal memuat data portofolio');
      }
      
      const { data, totalCount } = await response.json();
      setItems(data);
      setTotalCount(totalCount);

    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, currentPage, rowsPerPage, filterByCategory]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, filterByCategory]);

  return {
    items,
    categories,
    totalCount,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    filterByCategory,
    setFilterByCategory,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    fetchItems, 
    fetchCategories
  };
}
