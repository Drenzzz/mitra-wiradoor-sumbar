'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ClientUser } from '@/types';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from 'sonner';

export function useUserManagement() {
  const [users, setUsers] = useState<ClientUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(rowsPerPage),
      });
      if (debouncedSearchTerm) {
        params.append('search', debouncedSearchTerm);
      }

      const response = await fetch(`/api/users?${params.toString()}`);
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Gagal memuat data pengguna');
      }
      
      const { data, totalCount } = await response.json();
      setUsers(data);
      setTotalCount(totalCount);

    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, currentPage, rowsPerPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  return {
    users,
    totalCount,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    fetchUsers,
  };
}
