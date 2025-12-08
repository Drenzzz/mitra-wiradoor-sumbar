"use client";

import { useState } from "react";
import { InquiryStatus } from "@prisma/client";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";

export function useInquiryManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt-desc");
  const [activeTab, setActiveTab] = useState<InquiryStatus | "ALL">("NEW");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchInquiriesData = async () => {
    const params = new URLSearchParams({
      sort: sortBy,
      page: String(currentPage),
      limit: String(rowsPerPage),
    });
    if (debouncedSearchTerm) {
      params.append("search", debouncedSearchTerm);
    }
    if (activeTab !== "ALL") {
      params.append("status", activeTab);
    }

    const response = await fetch(`/api/inquiries?${params.toString()}`);
    if (!response.ok) {
      throw new Error("Gagal memuat data pesan masuk");
    }
    return response.json();
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["inquiries", { activeTab, currentPage, rowsPerPage, sortBy, debouncedSearchTerm }],
    queryFn: fetchInquiriesData,
    placeholderData: keepPreviousData,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: 30000,
  });

  return {
    inquiries: data?.data || [],
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
    fetchInquiries: refetch,
  };
}
