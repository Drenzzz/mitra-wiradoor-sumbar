"use client";

import { useState } from "react";
import { OrderStatus } from "@prisma/client";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";

export function useOrderManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt-desc");
  const [activeTab, setActiveTab] = useState<OrderStatus>(OrderStatus.PENDING);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchOrdersData = async () => {
    const params = new URLSearchParams({
      sort: sortBy,
      page: String(currentPage),
      limit: String(rowsPerPage),
      status: activeTab,
    });

    if (debouncedSearchTerm) {
      params.append("search", debouncedSearchTerm);
    }

    const response = await fetch(`/api/orders?${params.toString()}`);

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || "Gagal memuat data pesanan");
    }
    return response.json();
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["orders", { activeTab, currentPage, rowsPerPage, sortBy, debouncedSearchTerm }],
    queryFn: fetchOrdersData,
    placeholderData: keepPreviousData,
    refetchInterval: 30000,
  });

  return {
    orders: data?.data || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    error: error ? (error as Error).message : null,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    activeTab,
    setActiveTab,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    fetchOrders: refetch,
  };
}
