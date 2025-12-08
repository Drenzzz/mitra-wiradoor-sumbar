"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Undo, LayoutGrid, List as ListIcon } from "lucide-react";
import { Product, Category } from "@/types";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductTable } from "./product-table";
import { ProductGrid } from "./product-grid";

interface ProductListCardProps {
  variant: "active" | "trashed";
  products: Product[];
  totalCount: number;
  isLoading: boolean;
  viewMode: "list" | "grid";
  setViewMode: (mode: "list" | "grid") => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterByCategory: string;
  setFilterByCategory: (category: string) => void;
  categories: Category[];
  sortBy: string;
  setSortBy: (sort: string) => void;
  selectedRowKeys: string[];
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<string[]>>;
  handleBulkAction: (action: "delete" | "restore" | "forceDelete") => void;
  handleEditClick: (product: Product) => void;
  handleViewClick: (product: Product) => void;
  fetchProducts: () => void;
  handleSingleAction: (product: Product, action: "delete" | "restore" | "forceDelete") => void;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  rowsPerPage: number;
}

export function ProductListCard({
  variant,
  products,
  totalCount,
  isLoading,
  viewMode,
  setViewMode,
  searchTerm,
  setSearchTerm,
  filterByCategory,
  setFilterByCategory,
  categories,
  sortBy,
  setSortBy,
  selectedRowKeys,
  setSelectedRowKeys,
  handleBulkAction,
  handleEditClick,
  handleViewClick,
  fetchProducts,
  handleSingleAction,
  currentPage,
  setCurrentPage,
  rowsPerPage,
}: ProductListCardProps) {
  const totalPages = Math.ceil(totalCount / rowsPerPage);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <CardTitle>{variant === "active" ? "Produk Aktif" : "Produk di Sampah"}</CardTitle>
              <CardDescription className="mt-1">{variant === "active" ? "Daftar semua produk yang tersedia di katalog Anda." : "Daftar produk yang telah dipindahkan ke sampah."}</CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="flex items-center border rounded-md p-1 bg-muted/50">
                <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="sm" className="h-8 px-2" onClick={() => setViewMode("grid")}>
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="sm" className="h-8 px-2" onClick={() => setViewMode("list")}>
                  <ListIcon className="h-4 w-4" />
                </Button>
              </div>

              <AnimatePresence>
                {selectedRowKeys.length > 0 && viewMode === "list" && (
                  <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="flex items-center gap-2 overflow-hidden">
                    {variant === "active" ? (
                      <Button variant="destructive" size="sm" onClick={() => handleBulkAction("delete")}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus ({selectedRowKeys.length})
                      </Button>
                    ) : (
                      <>
                        <Button variant="outline" size="sm" onClick={() => handleBulkAction("restore")}>
                          <Undo className="mr-2 h-4 w-4" />
                          Pulihkan ({selectedRowKeys.length})
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleBulkAction("forceDelete")}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Hapus Permanen
                        </Button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-2 pt-4">
            <Input placeholder="Cari nama produk..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full md:flex-1" />
            <Select value={filterByCategory} onValueChange={(value) => setFilterByCategory(value === "all" ? "" : value)}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter berdasarkan Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories &&
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Urutkan berdasarkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Nama (A-Z)</SelectItem>
                <SelectItem value="name-desc">Nama (Z-A)</SelectItem>
                <SelectItem value="createdAt-desc">Terbaru</SelectItem>
                <SelectItem value="createdAt-asc">Terlama</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className={viewMode === "list" ? "p-0" : "p-6"}>
          {viewMode === "list" ? (
            <ProductTable
              variant={variant}
              products={products}
              isLoading={isLoading}
              error={null}
              onEditClick={handleEditClick}
              onViewClick={handleViewClick}
              onRefresh={fetchProducts}
              selectedRowKeys={selectedRowKeys}
              setSelectedRowKeys={setSelectedRowKeys}
              onDeleteClick={(product) => handleSingleAction(product, "delete")}
              onRestoreClick={(product) => handleSingleAction(product, "restore")}
              onForceDeleteClick={(product) => handleSingleAction(product, "forceDelete")}
            />
          ) : (
            <ProductGrid
              variant={variant}
              products={products}
              isLoading={isLoading}
              onEditClick={handleEditClick}
              onViewClick={handleViewClick}
              onDeleteClick={(product) => handleSingleAction(product, "delete")}
              onRestoreClick={(product) => handleSingleAction(product, "restore")}
              onForceDeleteClick={(product) => handleSingleAction(product, "forceDelete")}
            />
          )}
        </CardContent>
        {totalPages > 1 && (
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong>
            </div>
            <div className="flex items-center space-x-2 ml-auto">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1}>
                Sebelumnya
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>
                Selanjutnya
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}
