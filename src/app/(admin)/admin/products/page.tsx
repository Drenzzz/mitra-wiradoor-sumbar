"use client";

import { useState, useEffect } from "react";
import { Product, Category } from "@/types";
import { useProductManagement } from "@/hooks/use-product-management";
import { toast } from "sonner";
import { getCsrfToken } from "@/lib/csrf";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateProductButton } from "@/components/admin/products/create-product-button";
import { ProductDetailDialog } from "@/components/admin/products/product-detail-dialog";
import { EditProductDialog } from "@/components/admin/products/edit-product-dialog";
import { PageWrapper } from "@/components/admin/page-wrapper";
import { ConfirmationDialog } from "@/components/admin/shared/confirmation-dialog";
import { ProductListCard } from "@/components/admin/products/product-list-card";

export default function ProductManagementPage() {
  const {
    products,
    totals,
    isLoading,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    filterByCategory,
    setFilterByCategory,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    selectedRowKeys,
    setSelectedRowKeys,
    fetchProducts,
  } = useProductManagement();

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories?status=active");
        const data = await response.json();
        setCategories(data.data || []);
      } catch (error) {
        toast.error("Gagal memuat daftar kategori filter.");
      }
    };
    fetchCategories();
  }, []);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    description: "",
    variant: "default" as "default" | "destructive",
    onConfirm: () => {},
  });
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleSuccess = () => fetchProducts();
  const handleViewClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };
  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditOpen(true);
  };

  const handleBulkAction = (action: "delete" | "restore" | "forceDelete") => {
    const configMap = {
      delete: {
        title: `Hapus ${selectedRowKeys.length} Produk?`,
        description: "Produk yang dipilih akan dipindahkan ke sampah.",
        variant: "destructive" as const,
      },
      restore: {
        title: `Pulihkan ${selectedRowKeys.length} Produk?`,
        description: "Produk yang dipilih akan dikembalikan dari sampah.",
        variant: "default" as const,
      },
      forceDelete: {
        title: `Hapus Permanen ${selectedRowKeys.length} Produk?`,
        description: "Aksi ini tidak dapat dibatalkan. Data akan hilang selamanya.",
        variant: "destructive" as const,
      },
    };

    const messages = {
      delete: { loading: "Menghapus...", success: "Produk berhasil dihapus.", error: "Gagal menghapus." },
      restore: { loading: "Memulihkan...", success: "Produk berhasil dipulihkan.", error: "Gagal memulihkan." },
      forceDelete: { loading: "Menghapus permanen...", success: "Produk berhasil dihapus permanen.", error: "Gagal menghapus." },
    };

    setDialogConfig({
      ...configMap[action],
      onConfirm: () => {
        setIsActionLoading(true);
        const endpoints = {
          delete: (id: string) => fetch(`/api/products/${id}`, { method: "DELETE", headers: { "X-CSRF-Token": getCsrfToken() || "" } }),
          restore: (id: string) => fetch(`/api/products/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", "X-CSRF-Token": getCsrfToken() || "" }, body: JSON.stringify({ action: "restore" }) }),
          forceDelete: (id: string) => fetch(`/api/products/${id}?force=true`, { method: "DELETE", headers: { "X-CSRF-Token": getCsrfToken() || "" } }),
        };

        toast.promise(Promise.all(selectedRowKeys.map((id) => endpoints[action](id))), {
          loading: messages[action].loading,
          success: () => {
            fetchProducts();
            setSelectedRowKeys([]);
            return messages[action].success;
          },
          error: (err: any) => err.message || messages[action].error,
          finally: () => {
            setIsConfirmOpen(false);
            setIsActionLoading(false);
          },
        });
      },
    });
    setIsConfirmOpen(true);
  };

  const handleSingleAction = (item: Product, action: "delete" | "restore" | "forceDelete") => {
    const configMap = {
      delete: {
        title: `Hapus Produk "${item.name}"?`,
        description: "Produk ini akan dipindahkan ke sampah.",
        variant: "destructive" as const,
      },
      restore: {
        title: `Pulihkan Produk "${item.name}"?`,
        description: "Produk ini akan dikembalikan dari sampah.",
        variant: "default" as const,
      },
      forceDelete: {
        title: `Hapus Permanen "${item.name}"?`,
        description: "Aksi ini tidak dapat dibatalkan. Data akan hilang selamanya.",
        variant: "destructive" as const,
      },
    };

    const messages = {
      delete: { loading: "Menghapus...", success: "Produk berhasil dihapus.", error: "Gagal menghapus." },
      restore: { loading: "Memulihkan...", success: "Produk berhasil dipulihkan.", error: "Gagal memulihkan." },
      forceDelete: { loading: "Menghapus permanen...", success: "Produk berhasil dihapus permanen.", error: "Gagal menghapus." },
    };

    setDialogConfig({
      ...configMap[action],
      onConfirm: () => {
        setIsActionLoading(true);
        const endpoints = {
          delete: (id: string) => fetch(`/api/products/${id}`, { method: "DELETE", headers: { "X-CSRF-Token": getCsrfToken() || "" } }),
          restore: (id: string) => fetch(`/api/products/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", "X-CSRF-Token": getCsrfToken() || "" }, body: JSON.stringify({ action: "restore" }) }),
          forceDelete: (id: string) => fetch(`/api/products/${id}?force=true`, { method: "DELETE", headers: { "X-CSRF-Token": getCsrfToken() || "" } }),
        };

        toast.promise(endpoints[action](item.id), {
          loading: messages[action].loading,
          success: () => {
            fetchProducts();
            return messages[action].success;
          },
          error: (err: any) => err.message || messages[action].error,
          finally: () => {
            setIsConfirmOpen(false);
            setIsActionLoading(false);
          },
        });
      },
    });
    setIsConfirmOpen(true);
  };

  return (
    <PageWrapper>
      <>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Manajemen Produk</h1>
              <p className="text-muted-foreground">Kelola semua produk di katalog Anda di sini.</p>
            </div>
            <div className="w-full sm:w-auto self-end sm:self-center">
              <CreateProductButton onSuccess={handleSuccess} />
            </div>
          </div>
          <Tabs defaultValue="active" onValueChange={(value) => setActiveTab(value as "active" | "trashed")} className="w-full">
            <TabsList>
              <TabsTrigger value="active">Aktif ({totals.active})</TabsTrigger>
              <TabsTrigger value="trashed">Sampah ({totals.trashed})</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="mt-4">
              <ProductListCard
                variant="active"
                products={products.active || []}
                totalCount={totals.active || 0}
                isLoading={isLoading}
                viewMode={viewMode}
                setViewMode={setViewMode}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterByCategory={filterByCategory}
                setFilterByCategory={setFilterByCategory}
                categories={categories}
                sortBy={sortBy}
                setSortBy={setSortBy}
                selectedRowKeys={selectedRowKeys}
                setSelectedRowKeys={setSelectedRowKeys}
                handleBulkAction={handleBulkAction}
                handleEditClick={handleEditClick}
                handleViewClick={handleViewClick}
                fetchProducts={fetchProducts}
                handleSingleAction={handleSingleAction}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                rowsPerPage={rowsPerPage}
              />
            </TabsContent>
            <TabsContent value="trashed" className="mt-4">
              <ProductListCard
                variant="trashed"
                products={products.trashed || []}
                totalCount={totals.trashed || 0}
                isLoading={isLoading}
                viewMode={viewMode}
                setViewMode={setViewMode}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterByCategory={filterByCategory}
                setFilterByCategory={setFilterByCategory}
                categories={categories}
                sortBy={sortBy}
                setSortBy={setSortBy}
                selectedRowKeys={selectedRowKeys}
                setSelectedRowKeys={setSelectedRowKeys}
                handleBulkAction={handleBulkAction}
                handleEditClick={handleEditClick}
                handleViewClick={handleViewClick}
                fetchProducts={fetchProducts}
                handleSingleAction={handleSingleAction}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                rowsPerPage={rowsPerPage}
              />
            </TabsContent>
          </Tabs>
        </div>
        <ProductDetailDialog isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} product={selectedProduct} />
        <EditProductDialog isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} product={selectedProduct} onSuccess={handleSuccess} />
        <ConfirmationDialog
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={dialogConfig.onConfirm}
          title={dialogConfig.title}
          description={dialogConfig.description}
          variant={dialogConfig.variant}
          isLoading={isActionLoading}
        />
      </>
    </PageWrapper>
  );
}
