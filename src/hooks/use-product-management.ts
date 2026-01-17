

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Product } from "@/types";
import { useDebounce } from "@/hooks/use-debounce";

export function useProductManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt-desc");
  const [filterByCategory, setFilterByCategory] = useState("");
  const [activeTab, setActiveTab] = useState<"active" | "trashed">("active");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchProductsData = async () => {
    const fetchByStatus = async (status: "active" | "trashed") => {
      const params = new URLSearchParams({
        status,
        sort: sortBy,
        page: activeTab === status ? String(currentPage) : "1",
        limit: String(rowsPerPage),
      });

      if (debouncedSearchTerm) params.append("search", debouncedSearchTerm);
      if (filterByCategory) params.append("categoryId", filterByCategory);

      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) throw new Error(`Gagal memuat produk ${status}`);
      return response.json();
    };

    const [activeRes, trashedRes] = await Promise.all([fetchByStatus("active"), fetchByStatus("trashed")]);

    return {
      products: { active: activeRes.data, trashed: trashedRes.data },
      totals: { active: activeRes.totalCount, trashed: trashedRes.totalCount },
    };
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["products", { activeTab, currentPage, rowsPerPage, sortBy, filterByCategory, debouncedSearchTerm }],
    queryFn: fetchProductsData,
    placeholderData: keepPreviousData,
  });

  return {
    products: data?.products || { active: [], trashed: [] },
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
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    selectedRowKeys,
    setSelectedRowKeys,
    fetchProducts: refetch,
  };
}
