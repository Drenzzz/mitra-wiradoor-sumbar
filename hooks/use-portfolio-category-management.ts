"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";

export function usePortfolioCategoryManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"active" | "trashed">("active");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchCategoriesData = async () => {
    const fetchByStatus = async (status: "active" | "trashed") => {
      const params = new URLSearchParams({
        status,
        page: activeTab === status ? String(currentPage) : "1",
        limit: String(rowsPerPage),
        sort: "name-asc",
      });
      if (debouncedSearchTerm) params.append("search", debouncedSearchTerm);

      const res = await fetch(`/api/portfolio-categories?${params.toString()}`);
      if (!res.ok) throw new Error(`Gagal mengambil kategori ${status}`);
      return res.json();
    };

    const [activeRes, trashedRes] = await Promise.all([fetchByStatus("active"), fetchByStatus("trashed")]);

    return {
      categories: { active: activeRes.data, trashed: trashedRes.data },
      totals: { active: activeRes.totalCount, trashed: trashedRes.totalCount },
    };
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["portfolio-categories", { activeTab, currentPage, rowsPerPage, debouncedSearchTerm }],
    queryFn: fetchCategoriesData,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  return {
    categories: data?.categories || { active: [], trashed: [] },
    totals: data?.totals || { active: 0, trashed: 0 },
    isLoading,
    error: error ? (error as Error).message : null,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    fetchCategories: refetch,
  };
}
