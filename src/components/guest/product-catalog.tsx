"use client";

import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useDebounce } from "@/hooks/use-debounce";
import { CatalogFilterBar } from "@/components/guest/catalog-filter-bar";
import { CatalogActiveFilters } from "@/components/guest/catalog-active-filters";
import { CatalogProductGrid } from "@/components/guest/catalog-product-grid";
import type { Product, Category } from "@/types";

interface ProductCatalogProps {
  initialProducts: Product[];
  initialTotal: number;
  categories: Category[];
}

const PRODUCTS_PER_PAGE = 9;

export function ProductCatalog({ initialProducts, initialTotal, categories }: ProductCatalogProps) {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchTerm = useDebounce(searchInput, 500);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("createdAt-desc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { ref, inView } = useInView();

  const fetchProducts = async ({ pageParam = 1 }) => {
    const query = new URLSearchParams({
      status: "active",
      limit: String(PRODUCTS_PER_PAGE),
      page: String(pageParam),
      sort: sortBy,
    });

    if (debouncedSearchTerm) query.append("search", debouncedSearchTerm);
    if (selectedCategoryId && selectedCategoryId !== "all") query.append("categoryId", selectedCategoryId);

    const res = await fetch(`/api/products?${query.toString()}`);
    if (!res.ok) throw new Error("Gagal memuat data produk.");
    return res.json();
  };

  const isFiltering = debouncedSearchTerm !== "" || selectedCategoryId !== "all" || sortBy !== "createdAt-desc";

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, isLoading } = useInfiniteQuery({
    queryKey: ["products-catalog", debouncedSearchTerm, selectedCategoryId, sortBy],
    queryFn: fetchProducts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.ceil(lastPage.totalCount / PRODUCTS_PER_PAGE);
      const nextPage = allPages.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    initialData: isFiltering
      ? undefined
      : {
          pages: [{ data: initialProducts, totalCount: initialTotal }],
          pageParams: [1],
        },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const products = data?.pages.flatMap((page) => page.data) || [];

  const handleReset = () => {
    setSearchInput("");
    setSelectedCategoryId("all");
    setSortBy("createdAt-desc");
  };

  return (
    <div className="flex flex-col gap-8 min-h-screen">
      <div className="sticky top-24 z-30 mx-auto w-full max-w-5xl">
        <CatalogFilterBar
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          sortBy={sortBy}
          setSortBy={setSortBy}
          isFiltering={isFiltering}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          onReset={handleReset}
        />
        <CatalogActiveFilters
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
          debouncedSearchTerm={debouncedSearchTerm}
          setSearchInput={setSearchInput}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </div>

      <div className="w-full">
        <CatalogProductGrid ref={ref} products={products} isLoading={isLoading} status={status} isFetchingNextPage={isFetchingNextPage} hasNextPage={hasNextPage ?? false} onReset={handleReset} />
      </div>
    </div>
  );
}
