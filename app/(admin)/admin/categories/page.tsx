'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category } from '@/types';
import { useDebounce } from '@/hooks/use-debounce';

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

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({
        search: debouncedSearchTerm,
        sort: sortBy,
      });

      const [activeRes, trashedRes] = await Promise.all([
        fetch(`/api/categories?status=active&${query.toString()}`),
        fetch(`/api/categories?status=trashed&${query.toString()}`)
      ]);
      
      if (!activeRes.ok) throw new Error('Gagal memuat kategori aktif');
      const activeData = await activeRes.json();
      setActiveCategories(activeData);

      if (!trashedRes.ok) throw new Error('Gagal memuat kategori sampah');
      const trashedData = await trashedRes.json();
      setTrashedCategories(trashedData);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, sortBy]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedCategory(null);
  };

  // Komponen pembungkus untuk Card agar tidak duplikasi kode
  const CategoryCard = ({ variant }: { variant: 'active' | 'trashed' }) => {
    const isTrash = variant === 'trashed';
    const categories = isTrash ? trashedCategories : activeCategories;

    return (
      <Card>
        <CardHeader>
          <CardTitle>{isTrash ? 'Kategori di Sampah' : 'Kategori Aktif'}</CardTitle>
          <CardDescription>
            {isTrash
              ? 'Kategori yang telah dihapus. Anda bisa memulihkannya atau menghapus permanen.'
              : 'Daftar semua kategori produk yang tersedia untuk publik.'}
          </CardDescription>
          {/* Kontrol filter dan search yang responsif */}
          <div className="flex flex-col md:flex-row items-center gap-2 pt-4">
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
            />
          </motion.div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {/* Tata letak header yang responsif */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold">Manajemen Kategori</h1>
           <p className="text-muted-foreground">Kelola semua kategori produk Anda di sini.</p>
        </div>
        <div className="w-full sm:w-auto self-end sm:self-center">
          <CreateCategoryButton onSuccess={fetchCategories} />
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Aktif</TabsTrigger>
          <TabsTrigger value="trashed">Sampah</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-4">
            <AnimatePresence mode="wait">
                <motion.div
                    key="active-content"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <CategoryCard variant="active" />
                </motion.div>
            </AnimatePresence>
        </TabsContent>
        <TabsContent value="trashed" className="mt-4">
            <AnimatePresence mode="wait">
                <motion.div
                    key="trashed-content"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <CategoryCard variant="trashed" />
                </motion.div>
            </AnimatePresence>
        </TabsContent>
      </Tabs>

      <EditCategoryDialog
        isOpen={isEditDialogOpen}
        onClose={handleCloseDialog}
        category={selectedCategory}
        onSuccess={() => {
          fetchCategories();
          toast.success('Kategori berhasil diperbarui!');
        }}
      />

    </div>
  );
}
