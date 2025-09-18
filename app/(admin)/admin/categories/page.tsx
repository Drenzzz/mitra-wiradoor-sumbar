'use client';

import { useEffect, useState, useCallback } from 'react';
import { Category } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateCategoryButton } from '@/components/admin/categories/create-category-button';
import { CategoryTable } from '@/components/admin/categories/category-table';
import { Separator } from '@/components/ui/separator';

export default function CategoryManagementPage() {
  const [activeCategories, setActiveCategories] = useState<Category[]>([]);
  const [trashedCategories, setTrashedCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const activeRes = await fetch('/api/categories?status=active');
      if (!activeRes.ok) throw new Error('Gagal memuat kategori aktif');
      const activeData = await activeRes.json();
      setActiveCategories(activeData);

      const trashedRes = await fetch('/api/categories?status=trashed');
      if (!trashedRes.ok) throw new Error('Gagal memuat kategori sampah');
      const trashedData = await trashedRes.json();
      setTrashedCategories(trashedData);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
      <Separator />

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Aktif</TabsTrigger>
          <TabsTrigger value="trashed">Sampah</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          {/* Tabel untuk kategori AKTIF */}
          <CategoryTable
            variant="active"
            categories={activeCategories}
            isLoading={isLoading}
            error={error}
            onRefresh={fetchCategories}
          />
        </TabsContent>
        <TabsContent value="trashed">
           {/* Tabel untuk kategori di SAMPAH */}
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
