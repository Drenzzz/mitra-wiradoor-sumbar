"use client";

import { useState } from "react";
import type { OrderStatus } from "@/db/schema";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import { DateRange } from "react-day-picker";

export function useOrderManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt-desc");
  const [activeTab, setActiveTab] = useState<OrderStatus>("PENDING");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

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

    if (dateRange?.from) {
      params.append("startDate", dateRange.from.toISOString());
    }
    if (dateRange?.to) {
      params.append("endDate", dateRange.to.toISOString());
    }

    const response = await fetch(`/api/orders?${params.toString()}`);

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || "Gagal memuat data pesanan");
    }
    return response.json();
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["orders", { activeTab, currentPage, rowsPerPage, sortBy, debouncedSearchTerm, dateRange }],
    queryFn: fetchOrdersData,
    placeholderData: keepPreviousData,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: 30000,
  });

  const handleBulkAction = async (action: "updateStatus" | "delete", status?: OrderStatus) => {
    if (selectedRowKeys.length === 0) return;

    try {
      const response = await fetch("/api/orders/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderIds: selectedRowKeys,
          action,
          status,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Gagal melakukan aksi massal");
      }

      setSelectedRowKeys([]);
      refetch();
      return true;
    } catch (error: unknown) {
      throw error;
    }
  };

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
    dateRange,
    setDateRange,
    selectedRowKeys,
    setSelectedRowKeys,
    handleBulkAction,
  };
}
