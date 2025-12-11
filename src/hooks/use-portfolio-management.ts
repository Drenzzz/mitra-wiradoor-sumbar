"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import { PortfolioItem, PortfolioCategory } from "@/types";

export function usePortfolioManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterByCategory, setFilterByCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchItemsData = async () => {
    const params = new URLSearchParams({
      page: String(currentPage),
      limit: String(rowsPerPage),
      sort: "projectDate-desc",
    });

    if (debouncedSearchTerm) {
      params.append("search", debouncedSearchTerm);
    }

    if (filterByCategory && filterByCategory !== "all") {
      params.append("categoryId", filterByCategory);
    }

    const response = await fetch(`/api/portfolio?${params.toString()}`);
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || "Gagal memuat data portofolio");
    }
    return response.json() as Promise<{ data: PortfolioItem[]; totalCount: number }>;
  };

  const fetchCategoriesData = async () => {
    const response = await fetch("/api/portfolio-categories?status=active&limit=100");
    if (response.ok) {
      const res = await response.json();
      return res.data as PortfolioCategory[];
    }
    return [] as PortfolioCategory[];
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["portfolio", { currentPage, rowsPerPage, filterByCategory, debouncedSearchTerm }],
    queryFn: fetchItemsData,
    placeholderData: keepPreviousData,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["portfolio-categories-list"],
    queryFn: fetchCategoriesData,
    staleTime: 1000 * 60 * 10,
  });

  const deletePortfolio = async (id: string) => {
    const response = await fetch(`/api/portfolio/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Gagal menghapus portfolio");
    }
    refetch();
  };

  return {
    portfolio: data?.data || [],
    totalCount: data?.totalCount || 0,
    categories,
    isLoading,
    error: error ? (error as Error).message : null,
    searchTerm,
    setSearchTerm,
    filterByCategory,
    setFilterByCategory,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    fetchportfolio: refetch,
    deletePortfolio,
    fetchCategories: async () => {},
  };
}
