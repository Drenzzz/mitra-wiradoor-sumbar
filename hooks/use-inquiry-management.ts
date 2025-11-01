'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Inquiry } from '@/types';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from 'sonner';

export function useInquiryManagement() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt-desc');
  const [activeTab, setActiveTab] = useState('NEW');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchInquiries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        sort: sortBy,
        page: String(currentPage),
        limit: String(rowsPerPage),
      });
      if (debouncedSearchTerm) {
        params.append('search', debouncedSearchTerm);
      }
      if (activeTab !== 'ALL') {
        params.append('status', activeTab);
      }
      
      const response = await fetch(`/api/inquiries?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Gagal memuat data pesan masuk');
      }
      
      const { data, totalCount } = await response.json();
      setInquiries(data);
      setTotalCount(totalCount);

    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, sortBy, currentPage, rowsPerPage, activeTab]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, sortBy, activeTab]);

  return {
    inquiries,
    totalCount,
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
    fetchInquiries,
  };
}
