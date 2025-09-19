'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category } from '@/types';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Undo, Trash2 } from 'lucide-react'; 
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CreateCategoryButton } from '@/components/admin/categories/create-category-button';
import { CategoryTable } from '@/components/admin/categories/category-table';
import { EditCategoryDialog } from '@/components/admin/categories/edit-category-dialog';

// Konfigurasi untuk animasi container tabel
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.05, // Efek muncul berurutan
    },
  },
};

export default function CategoryManagementPage() {
  const [activeCategories, setActiveCategories] = useState<Category[]>([]);
  const [trashedCategories, setTrashedCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Ubah sesuai kebutuhan
  const [totalActive, setTotalActive] = useState(0);
  const [totalTrashed, setTotalTrashed] = useState(0);
  const [activeTab, setActiveTab] = useState('active');

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const activeQuery = new URLSearchParams({
        status: 'active',
        search: debouncedSearchTerm,
        sort: sortBy,
        page: activeTab === 'active' ? String(currentPage) : '1',
        limit: String(rowsPerPage),
      });
      const trashedQuery = new URLSearchParams({
        status: 'trashed',
        search: debouncedSearchTerm,
        sort: sortBy,
        page: activeTab === 'trashed' ? String(currentPage) : '1',
        limit: String(rowsPerPage),
      });

      const [activeRes, trashedRes] = await Promise.all([
        fetch(`/api/categories?${activeQuery.toString()}`),
        fetch(`/api/categories?${trashedQuery.toString()}`)
      ]);
      
      if (!activeRes.ok) throw new Error('Gagal memuat kategori aktif');
      const { data: activeData, totalCount: activeCount } = await activeRes.json();
      setActiveCategories(activeData);
      setTotalActive(activeCount);

      if (!trashedRes.ok) throw new Error('Gagal memuat kategori sampah');
      const { data: trashedData, totalCount: trashedCount } = await trashedRes.json();
      setTrashedCategories(trashedData);
      setTotalTrashed(trashedCount);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, sortBy, currentPage, rowsPerPage, activeTab]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  
  useEffect(() => {
    setCurrentPage(1);
    setSelectedRowKeys([]);
  }, [debouncedSearchTerm, sortBy, activeTab]);


  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleBulkDelete = () => {
     toast.promise(
       Promise.all(selectedRowKeys.map(id => fetch(`/api/categories/${id}`, { method: 'DELETE' }))),
       {
         loading: 'Menghapus kategori terpilih...',
         success: () => {
           fetchCategories();
           setSelectedRowKeys([]);
           return 'Kategori terpilih berhasil dihapus.';
         },
         error: 'Gagal menghapus beberapa kategori.',
       }
     );
  };

  const handleBulkRestore = () => {
    toast.promise(
      Promise.all(selectedRowKeys.map(id => fetch(`/api/categories/${id}/restore`, { method: 'PATCH' }))),
      {
        loading: 'Memulihkan kategori terpilih...',
        success: () => {
          fetchCategories();
          setSelectedRowKeys([]);
          return 'Kategori terpilih berhasil dipulihkan.';
        },
        error: 'Gagal memulihkan beberapa kategori.',
      }
    );
  };

  const handleBulkPermanentDelete = () => {
    if (!window.confirm(`Anda yakin ingin menghapus ${selectedRowKeys.length} kategori ini secara permanen? Aksi ini tidak dapat dibatalkan.`)) {
        return;
    }

    toast.promise(
      Promise.all(selectedRowKeys.map(id => fetch(`/api/categories/${id}/force`, { method: 'DELETE' }))),
      {
        loading: 'Menghapus kategori secara permanen...',
        success: () => {
          fetchCategories();
          setSelectedRowKeys([]);
          return 'Kategori terpilih berhasil dihapus permanen.';
        },
        error: 'Gagal menghapus beberapa kategori.',
      }
    );
  };

  // Komponen pembungkus untuk Card agar tidak duplikasi kode
  const CategoryCard = ({ variant }: { variant: 'active' | 'trashed' }) => {
    const isTrash = variant === 'trashed';
    const categories = isTrash ? trashedCategories : activeCategories;
    const totalCategories = isTrash ? totalTrashed : totalActive;
    const totalPages = Math.ceil(totalCategories / rowsPerPage);

    return (
      <Card>
        <CardHeader>
          <CardTitle>{isTrash ? 'Kategori di Sampah' : 'Kategori Aktif'}</CardTitle>
          <CardDescription>
            {isTrash
              ? 'Kategori yang telah dihapus.'
              : 'Daftar semua kategori produk yang tersedia.'}
          </CardDescription>
          <div className="flex flex-col md:flex-row items-center gap-2 pt-4">
            {/* --- Tombol Aksi Massal --- */}
            <AnimatePresence>
            {selectedRowKeys.length > 0 && activeTab === variant && (
                <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}>
                    <div className="flex items-center gap-2">
                        {isTrash ? (
                            <>
                                <Button variant="outline" size="sm" onClick={handleBulkRestore}>
                                    <Undo className="mr-2 h-4 w-4" />
                                    Pulihkan ({selectedRowKeys.length})
                                </Button>
                                <Button variant="destructive" size="sm" onClick={handleBulkPermanentDelete}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Hapus Permanen
                                </Button>
                            </>
                        ) : (
                            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
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
              categories={categories}
              isLoading={isLoading}
              error={error}
              searchTerm={debouncedSearchTerm}
              onRefresh={fetchCategories}
              onEditClick={handleEditClick}
              selectedRowKeys={selectedRowKeys}
              setSelectedRowKeys={setSelectedRowKeys}
            />
          </motion.div>
        </CardContent>
        {/* --- Pagination Footer --- */}
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
          <TabsTrigger value="active">Aktif ({totalActive})</TabsTrigger>
          <TabsTrigger value="trashed">Sampah ({totalTrashed})</TabsTrigger>
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
    </div>
  );
}
