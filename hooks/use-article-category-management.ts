"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import { ArticleCategory } from "@/types";

export function useArticleCategoryManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [activeTab, setActiveTab] = useState<"active" | "trashed">("active");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchCategoriesData = async () => {
    const fetchByStatus = async (status: "active" | "trashed") => {
      const query = new URLSearchParams({
        status,
        search: debouncedSearchTerm,
        sort: sortBy,
        page: activeTab === status ? String(currentPage) : "1",
        limit: String(rowsPerPage),
      });

      const response = await fetch(`/api/article-categories?${query.toString()}`);
      if (!response.ok) throw new Error(`Gagal memuat kategori ${status}`);
      return response.json() as Promise<{ data: ArticleCategory[]; totalCount: number }>;
    };

    const [activeRes, trashedRes] = await Promise.all([fetchByStatus("active"), fetchByStatus("trashed")]);

    return {
      categories: { active: activeRes.data, trashed: trashedRes.data },
      totals: { active: activeRes.totalCount, trashed: trashedRes.totalCount },
    };
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["article-categories", { activeTab, currentPage, rowsPerPage, sortBy, debouncedSearchTerm }],
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
    sortBy,
    setSortBy,
    activeTab,
    setActiveTab,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    fetchCategories: refetch,
  };
}
