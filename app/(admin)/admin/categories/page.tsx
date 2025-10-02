// app/(admin)/admin/categories/page.tsx

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category } from '@/types';
import { useCategoryManagement } from '@/hooks/use-category-management';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Undo, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateCategoryButton } from '@/components/admin/categories/create-category-button';
import { CategoryTable } from '@/components/admin/categories/category-table';
import { EditCategoryDialog } from '@/components/admin/categories/edit-category-dialog';
import { ConfirmationDialog } from '@/components/admin/shared/confirmation-dialog';

// Konfigurasi untuk animasi container tabel
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.05,
    },
  },
};

export default function CategoryManagementPage() {
  const {
    categories,
    totals,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    activeTab,
    setActiveTab,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    fetchCategories,
  } = useCategoryManagement();

  // State lokal hanya untuk UI (dialog dan selection)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: '',
    description: '',
    variant: 'default' as 'default' | 'destructive',
    onConfirm: () => {},
  });
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleBulkAction = (action: 'delete' | 'restore' | 'forceDelete') => {
    const configMap = {
      delete: {
        title: `Hapus ${selectedRowKeys.length} Kategori?`,
        description: 'Kategori yang dipilih akan dipindahkan ke sampah.',
        variant: 'destructive' as const,
      },
      restore: {
        title: `Pulihkan ${selectedRowKeys.length} Kategori?`,
        description: 'Kategori yang dipilih akan dikembalikan dari sampah.',
        variant: 'default' as const,
      },
      forceDelete: {
        title: `Hapus Permanen ${selectedRowKeys.length} Kategori?`,
        description: 'Aksi ini tidak dapat dibatalkan. Data akan hilang selamanya.',
        variant: 'destructive' as const,
      },
    };

    const messages = {
      delete: { loading: 'Menghapus...', success: 'Kategori berhasil dihapus.', error: 'Gagal menghapus.' },
      restore: { loading: 'Memulihkan...', success: 'Kategori berhasil dipulihkan.', error: 'Gagal memulihkan.' },
      forceDelete: { loading: 'Menghapus permanen...', success: 'Kategori berhasil dihapus permanen.', error: 'Gagal menghapus.' },
    };

    setDialogConfig({
      ...configMap[action],
      onConfirm: () => {
        setIsActionLoading(true);
        const endpoints = {
          delete: (id: string) => fetch(`/api/categories/${id}`, { method: 'DELETE' }),
          restore: (id: string) => fetch(`/api/categories/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'restore' }) }),
          forceDelete: (id: string) => fetch(`/api/categories/${id}?force=true`, { method: 'DELETE' }),
        };

        toast.promise(Promise.all(selectedRowKeys.map(id => endpoints[action](id))), {
          loading: messages[action].loading,
          success: () => {
            fetchCategories();
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

  const handleSingleAction = (
    item: Category,
    action: 'delete' | 'restore' | 'forceDelete'
  ) => {
    const configMap = {
      delete: {
        title: `Hapus Kategori "${item.name}"?`,
        description: 'Kategori ini akan dipindahkan ke sampah.',
        variant: 'destructive' as const,
      },
      restore: {
        title: `Pulihkan Kategori "${item.name}"?`,
        description: 'Kategori ini akan dikembalikan dari sampah.',
        variant: 'default' as const,
      },
      forceDelete: {
        title: `Hapus Permanen "${item.name}"?`,
        description: 'Aksi ini tidak dapat dibatalkan. Data akan hilang selamanya.',
        variant: 'destructive' as const,
      },
    };

    const messages = {
      delete: { loading: 'Menghapus...', success: 'Kategori berhasil dihapus.', error: 'Gagal menghapus.' },
      restore: { loading: 'Memulihkan...', success: 'Kategori berhasil dipulihkan.', error: 'Gagal memulihkan.' },
      forceDelete: { loading: 'Menghapus permanen...', success: 'Kategori berhasil dihapus permanen.', error: 'Gagal menghapus.' },
    };

    setDialogConfig({
      ...configMap[action],
      onConfirm: () => {
        setIsActionLoading(true);
        const endpoints = {
          delete: (id: string) => fetch(`/api/categories/${id}`, { method: 'DELETE' }),
          restore: (id: string) => fetch(`/api/categories/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'restore' }) }),
          forceDelete: (id: string) => fetch(`/api/categories/${id}?force=true`, { method: 'DELETE' }),
        };

        toast.promise(endpoints[action](item.id), {
          loading: messages[action].loading,
          success: () => {
            fetchCategories();
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

  // Komponen pembungkus untuk Card
  const CategoryCard = ({ variant }: { variant: 'active' | 'trashed' }) => {
    const isTrash = variant === 'trashed';
    const currentCategories = isTrash ? categories.trashed : categories.active;
    const totalCategories = isTrash ? totals.trashed : totals.active;
    const totalPages = Math.ceil(totalCategories / rowsPerPage);
    const debouncedSearchTerm = searchTerm;

    return (
      <Card>
        <CardHeader>
          <CardTitle>{isTrash ? 'Kategori di Sampah' : 'Kategori Aktif'}</CardTitle>
          <CardDescription>
            {isTrash ? 'Kategori yang telah dihapus.' : 'Daftar semua kategori produk yang tersedia.'}
          </CardDescription>
          <div className="flex flex-col md:flex-row items-center gap-2 pt-4">
            <AnimatePresence>
              {selectedRowKeys.length > 0 && activeTab === variant && (
                <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}>
                  <div className="flex items-center gap-2">
                    {isTrash ? (
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
                    ) : (
                      <Button variant="destructive" size="sm" onClick={() => handleBulkAction('delete')}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus ({selectedRowKeys.length})
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="relative w-full md:grow">
              <Input
                placeholder="Cari nama kategori..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
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
        <CardContent>
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <CategoryTable
            variant={variant}
            categories={currentCategories}
            isLoading={isLoading}
            error={error}
            searchTerm={debouncedSearchTerm}
            onRefresh={fetchCategories}
            onEditClick={handleEditClick}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
            onDeleteClick={(category) => handleSingleAction(category, 'delete')}
            onRestoreClick={(category) => handleSingleAction(category, 'restore')}
            onForceDeleteClick={(category) => handleSingleAction(category, 'forceDelete')}
          />
          </motion.div>
        </CardContent>
        {totalPages > 1 && (
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong>
            </div>
            <div className="flex items-center space-x-2 ml-auto">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage <= 1}>
                Sebelumnya
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages}>
                Selanjutnya
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold">Manajemen Kategori</h1>
           <p className="text-muted-foreground">Kelola semua kategori produk Anda di sini.</p>
        </div>
        <div className="w-full sm:w-auto self-end sm:self-center">
          <CreateCategoryButton onSuccess={fetchCategories} />
        </div>
      </div>

      <Tabs defaultValue="active" onValueChange={setActiveTab} className="w-full">
        <TabsList>
          {/* ✅ DIPERBAIKI: Mengambil data dari state `totals` */}
          <TabsTrigger value="active">Aktif ({totals.active})</TabsTrigger>
          <TabsTrigger value="trashed">Sampah ({totals.trashed})</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4">
          <AnimatePresence mode="wait">
            <motion.div key="active-content" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.2 }}>
              <CategoryCard variant="active" />
            </motion.div>
          </AnimatePresence>
        </TabsContent>
        <TabsContent value="trashed" className="mt-4">
          <AnimatePresence mode="wait">
            <motion.div key="trashed-content" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.2 }}>
              <CategoryCard variant="trashed" />
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>
      <EditCategoryDialog isOpen={isEditDialogOpen} onClose={handleCloseDialog} category={selectedCategory}
        onSuccess={() => {
          fetchCategories();
          toast.success('Kategori berhasil diperbarui!');
        }}
      />
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={dialogConfig.onConfirm}
        title={dialogConfig.title}
        description={dialogConfig.description}
        variant={dialogConfig.variant}
        isLoading={isActionLoading}
      />

    </div>
  );
}