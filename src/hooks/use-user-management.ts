"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";

export function useUserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchUsersData = async () => {
    const params = new URLSearchParams({
      page: String(currentPage),
      limit: String(rowsPerPage),
    });
    if (debouncedSearchTerm) {
      params.append("search", debouncedSearchTerm);
    }

    const response = await fetch(`/api/users?${params.toString()}`);

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || "Gagal memuat data pengguna");
    }
    return response.json();
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["users", { currentPage, rowsPerPage, debouncedSearchTerm }],
    queryFn: fetchUsersData,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });

  return {
    users: data?.data || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    error: error ? (error as Error).message : null,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    fetchUsers: refetch,
  };
}
