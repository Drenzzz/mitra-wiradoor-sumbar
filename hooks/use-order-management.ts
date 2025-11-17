'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Order } from '@/types';
import { OrderStatus } from '@prisma/client';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from 'sonner';

export function useOrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt-desc');
  const [activeTab, setActiveTab] = useState<OrderStatus>(OrderStatus.PENDING);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        sort: sortBy,
        page: String(currentPage),
        limit: String(rowsPerPage),
        status: activeTab,
      });

      if (debouncedSearchTerm) {
        params.append('search', debouncedSearchTerm);
      }
      
      const response = await fetch(`/api/orders?${params.toString()}`);
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Gagal memuat data pesanan');
      }
      
      const { data, totalCount } = await response.json();
      setOrders(data);
      setTotalCount(totalCount);

    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, sortBy, currentPage, rowsPerPage, activeTab]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]); 
  
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, sortBy, activeTab]);

  return {
    orders,
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
    fetchOrders,
  };
}
