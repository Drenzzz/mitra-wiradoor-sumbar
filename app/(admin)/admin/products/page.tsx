'use client';

import { useState, useEffect } from "react";
import { Product, Category } from "@/types";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateProductButton } from "@/components/admin/products/create-product-button";
import { ProductTable } from "@/components/admin/products/product-table";
import { ProductDetailDialog } from "@/components/admin/products/product-detail-dialog";
import { EditProductDialog } from '@/components/admin/products/edit-product-dialog';
import { motion, AnimatePresence } from "framer-motion";
import { Undo, Trash2 } from "lucide-react";

export default function ProductManagementPage() {
  const [products, setProducts] = useState<{ active: Product[], trashed: Product[] }>({ active: [], trashed: [] });
  const [totals, setTotals] = useState({ active: 0, trashed: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [filterByCategory, setFilterByCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories?status=active');
            const data = await response.json();
            setCategories(data.data);
        } catch (error) {
            toast.error("Gagal memuat daftar kategori filter.");
        }
    };
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const buildQuery = (status: 'active' | 'trashed') => {
        const params = new URLSearchParams({ 
            status, 
            sort: sortBy,
            page: String(currentPage),
            limit: String(rowsPerPage),
         });
        if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
        if (filterByCategory) params.append('categoryId', filterByCategory);
        return params.toString();
      };

      const statusToFetch = activeTab as 'active' | 'trashed';
      const res = await fetch(`/api/products?${buildQuery(statusToFetch)}`);
      if (!res.ok) throw new Error('Gagal memuat data');

      const { data, totalCount } = await res.json();
      setProducts(prev => ({ ...prev, [statusToFetch]: data }));
      setTotals(prev => ({ ...prev, [statusToFetch]: totalCount }));

    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearchTerm, sortBy, filterByCategory, currentPage, activeTab]);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedRowKeys([]);
  }, [activeTab, debouncedSearchTerm, sortBy, filterByCategory]);

  const handleSuccess = () => fetchProducts();
  const handleViewClick = (product: Product) => { setSelectedProduct(product); setIsDetailOpen(true); };
  const handleEditClick = (product: Product) => { setSelectedProduct(product); setIsEditOpen(true); };

  const handleBulkAction = (action: 'delete' | 'restore' | 'forceDelete') => {
    const endpoints = {
      delete: (id: string) => fetch(`/api/products/${id}`, { method: 'DELETE' }),
      restore: (id: string) => fetch(`/api/products/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'restore' }) }),
      forceDelete: (id: string) => fetch(`/api/products/${id}?force=true`, { method: 'DELETE' }),
    };

    const messages = {
      delete: { loading: 'Menghapus...', success: 'Produk berhasil dihapus.', error: 'Gagal menghapus beberapa produk.' },
      restore: { loading: 'Memulihkan...', success: 'Produk berhasil dipulihkan.', error: 'Gagal memulihkan beberapa produk.' },
      forceDelete: { loading: 'Menghapus permanen...', success: 'Produk berhasil dihapus permanen.', error: 'Gagal menghapus beberapa produk.' },
    };

    if (action === 'forceDelete' && !window.confirm(`Anda yakin ingin menghapus ${selectedRowKeys.length} produk ini secara permanen? Aksi ini tidak dapat dibatalkan.`)) {
        return;
    }

    toast.promise(
      Promise.all(selectedRowKeys.map(id => endpoints[action](id))),
      {
        loading: messages[action].loading,
        success: () => {
          fetchProducts();
          setSelectedRowKeys([]);
          return messages[action].success;
        },
        error: (err: any) => err.message || messages[action].error,
      }
    );
  };

  const ProductListCard = ({ variant }: { variant: 'active' | 'trashed' }) => {
    const productList = products[variant] || [];
    const totalCount = totals[variant] || 0;
    const totalPages = Math.ceil(totalCount / rowsPerPage);

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                    <div className="flex-1">
                        <CardTitle>{variant === 'active' ? 'Produk Aktif' : 'Produk di Sampah'}</CardTitle>
                        <CardDescription className="mt-1">
                            {variant === 'active' ? 'Daftar semua produk yang tersedia di katalog Anda.' : 'Daftar produk yang telah dipindahkan ke sampah.'}
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                       <AnimatePresence>
                        {selectedRowKeys.length > 0 && (
                            <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="flex items-center gap-2">
                                {variant === 'active' ? (
                                    <Button variant="destructive" size="sm" onClick={() => handleBulkAction('delete')}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Hapus ({selectedRowKeys.length})
                                    </Button>
                                ) : (
                                    <>
                                        <Button variant="outline" size="sm" onClick={() => handleBulkAction('restore')}>
                                            <Undo className="mr-2 h-4 w-4" />
                                            Pulihkan ({selectedRowKeys.length})
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleBulkAction('forceDelete')}>
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
                    <Input
                        placeholder="Cari nama produk..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:flex-1"
                    />
                    <Select value={filterByCategory} onValueChange={(value) => setFilterByCategory(value === 'all' ? '' : value)}>
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder="Filter berdasarkan Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Kategori</SelectItem>
                            {categories.map(category => (
                                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
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
            <CardContent className="p-0">
                <ProductTable 
                    variant={variant}
                    products={productList} 
                    isLoading={isLoading} 
                    error={null} 
                    onEditClick={handleEditClick} 
                    onViewClick={handleViewClick}
                    onRefresh={fetchProducts}
                    selectedRowKeys={selectedRowKeys}
                    setSelectedRowKeys={setSelectedRowKeys}
                />
            </CardContent>
            {totalPages > 1 && (
                <CardFooter>
                    <div className="text-xs text-muted-foreground">
                        Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong>
                    </div>
                    <div className="flex items-center space-x-2 ml-auto">
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1}>
                            Sebelumnya
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>
                            Selanjutnya
                        </Button>
                    </div>
                </CardFooter>
            )}
        </Card>
    );
  };

  return (
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
        <Tabs defaultValue="active" onValueChange={(value) => setActiveTab(value as 'active' | 'trashed')} className="w-full">
          <TabsList>
            <TabsTrigger value="active">Aktif ({totals.active})</TabsTrigger>
            <TabsTrigger value="trashed">Sampah ({totals.trashed})</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-4"><ProductListCard variant="active" /></TabsContent>
          <TabsContent value="trashed" className="mt-4"><ProductListCard variant="trashed" /></TabsContent>
        </Tabs>
      </div>
      <ProductDetailDialog isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} product={selectedProduct} />
      <EditProductDialog isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} product={selectedProduct} onSuccess={handleSuccess} />
    </>
  );
}
