'use client';

import { useEffect, useState, useCallback } from 'react';
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
import { CreateCategoryButton } from '@/components/admin/categories/create-category-button';
import { CategoryTable } from '@/components/admin/categories/category-table';
import { Separator } from '@/components/ui/separator';

export default function CategoryManagementPage() {
  const [activeCategories, setActiveCategories] = useState<Category[]>([]);
  const [trashedCategories, setTrashedCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500); 

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({
        search: debouncedSearchTerm,
        sort: sortBy,
      });

      const activeRes = await fetch(`/api/categories?status=active&${query.toString()}`);
      if (!activeRes.ok) throw new Error('Gagal memuat kategori aktif');
      const activeData = await activeRes.json();
      setActiveCategories(activeData);

      const trashedRes = await fetch(`/api/categories?status=trashed&${query.toString()}`);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium">Manajemen Kategori</h1>
          <p className="text-sm text-muted-foreground">
            Kelola semua kategori produk Anda di sini.
          </p>
        </div>
        <CreateCategoryButton onSuccess={fetchCategories} />
      </div>

      {/* --- UI UNTUK FILTER & SEARCH --- */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Cari nama kategori..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
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
      
      <Separator />

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Aktif</TabsTrigger>
          <TabsTrigger value="trashed">Sampah</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <CategoryTable
            variant="active"
            categories={activeCategories}
            isLoading={isLoading}
            error={error}
            onRefresh={fetchCategories}
          />
        </TabsContent>
        <TabsContent value="trashed">
           <CategoryTable
            variant="trashed"
            categories={trashedCategories}
            isLoading={isLoading}
            error={error}
            onRefresh={fetchCategories}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}