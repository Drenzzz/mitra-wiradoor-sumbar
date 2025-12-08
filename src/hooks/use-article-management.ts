"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import { Article } from "@/types";

export function useArticleManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt-desc");
  const [filterByCategory, setFilterByCategory] = useState("");
  const [filterByStatus, setFilterByStatus] = useState("");
  const [activeTab, setActiveTab] = useState<"active" | "trashed">("active");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchArticlesData = async () => {
    const fetchByStatus = async (status: "active" | "trashed") => {
      const params = new URLSearchParams({
        status,
        sort: sortBy,
        page: activeTab === status ? String(currentPage) : "1",
        limit: String(rowsPerPage),
      });
      if (debouncedSearchTerm) params.append("search", debouncedSearchTerm);
      if (filterByCategory) params.append("categoryId", filterByCategory);
      if (filterByStatus) params.append("statusFilter", filterByStatus);

      const response = await fetch(`/api/articles?${params.toString()}`);
      if (!response.ok) throw new Error(`Gagal memuat artikel ${status}`);
      return response.json() as Promise<{ data: Article[]; totalCount: number }>;
    };

    const [activeRes, trashedRes] = await Promise.all([fetchByStatus("active"), fetchByStatus("trashed")]);

    return {
      articles: { active: activeRes.data, trashed: trashedRes.data },
      totals: { active: activeRes.totalCount, trashed: trashedRes.totalCount },
    };
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["articles", { activeTab, currentPage, rowsPerPage, sortBy, filterByCategory, filterByStatus, debouncedSearchTerm }],
    queryFn: fetchArticlesData,
    placeholderData: keepPreviousData,
  });

  return {
    articles: data?.articles || { active: [], trashed: [] },
    totals: data?.totals || { active: 0, trashed: 0 },
    isLoading,
    error: error ? (error as Error).message : null,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    activeTab,
    setActiveTab,
    filterByCategory,
    setFilterByCategory,
    filterByStatus,
    setFilterByStatus,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    fetchArticles: refetch,
    selectedRowKeys,
    setSelectedRowKeys,
  };
}
