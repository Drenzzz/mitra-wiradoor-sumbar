'use client';

import { useState, useEffect, useCallback } from 'react';
import { PortfolioCategory } from '@/types';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from 'sonner';

export function usePortfolioCategoryManagement() {
  const [categories, setCategories] = useState<{ active: PortfolioCategory[], trashed: PortfolioCategory[] }>({ active: [], trashed: [] });
  const [totals, setTotals] = useState({ active: 0, trashed: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchByStatus = async (status: 'active' | 'trashed') => {
        const params = new URLSearchParams({
          status,
          page: activeTab === status ? String(currentPage) : '1',
          limit: String(rowsPerPage),
          sort: 'name-asc',
        });
        if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);

        const res = await fetch(`/api/portfolio-categories?${params.toString()}`);
        if (!res.ok) throw new Error(`Gagal mengambil kategori ${status}`);
        return res.json();
      };

      const [activeRes, trashedRes] = await Promise.all([
        fetchByStatus('active'),
        fetchByStatus('trashed')
      ]);

      setCategories({ active: activeRes.data, trashed: trashedRes.data });
      setTotals({ active: activeRes.totalCount, trashed: trashedRes.totalCount });

    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data kategori");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, currentPage, rowsPerPage, activeTab]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, activeTab]);

  return {
    categories,
    totals,
    isLoading,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    fetchCategories,
  };
}
