'use client';

import { useState } from 'react';
import { PageWrapper } from '@/components/admin/page-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useArticleCategoryManagement } from '@/hooks/use-article-category-management';
import { CreateArticleCategoryButton } from '@/components/admin/article-categories/create-article-category-button';
import { ArticleCategoryTable } from '@/components/admin/article-categories/article-category-table';
import { EditArticleCategoryDialog } from '@/components/admin/article-categories/edit-article-category-dialog';
import { ArticleCategory } from '@/types';
import { toast } from 'sonner';

// import { useArticleManagement } from '@/hooks/use-article-management';

export default function ArticleManagementPage() { 
  const {
    categories,
    isLoading: isCategoriesLoading,
    fetchCategories,
  } = useArticleCategoryManagement();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | null>(null);

  const handleEditClick = (category: ArticleCategory) => {
    setSelectedCategory(category);
    setIsEditDialogOpen(true);
  };

  return (
    <PageWrapper className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manajemen Artikel</h1>
        <p className="text-muted-foreground">Kelola kategori dan konten artikel untuk website Anda di sini.</p>
      </div>

      {/* Card untuk Manajemen Kategori Artikel */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Kategori Artikel</CardTitle>
            <CardDescription>Kelompokkan artikel Anda ke dalam kategori yang relevan.</CardDescription>
          </div>
          <CreateArticleCategoryButton onSuccess={fetchCategories} />
        </CardHeader>
        <CardContent>
          <ArticleCategoryTable
            variant="active"
            categories={categories.active}
            isLoading={isCategoriesLoading}
            error={null}
            onRefresh={fetchCategories}
            onEditClick={handleEditClick}
            selectedRowKeys={[]}
            setSelectedRowKeys={() => {}}
            searchTerm=""
          />
        </CardContent>
      </Card>

      {/* Placeholder untuk Card Manajemen Artikel */}
      <Card>
         <CardHeader>
           <CardTitle>Daftar Artikel</CardTitle>
           <CardDescription>Tulis, edit, dan publikasikan artikel Anda.</CardDescription>
         </CardHeader>
         <CardContent>
           <p className="text-center text-muted-foreground py-8">
             (Tabel Daftar Artikel akan ditampilkan di sini pada tahap selanjutnya)
           </p>
         </CardContent>
      </Card>

      <EditArticleCategoryDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        category={selectedCategory}
        onSuccess={() => {
          fetchCategories();
          toast.success('Kategori berhasil diperbarui!');
        }}
      />
    </PageWrapper>
  );
}
