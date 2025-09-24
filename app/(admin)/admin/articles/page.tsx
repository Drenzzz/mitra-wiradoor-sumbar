'use client';

import { useState } from 'react';
import { PageWrapper } from '@/components/admin/page-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useArticleCategoryManagement } from '@/hooks/use-article-category-management';
import { CreateArticleCategoryButton } from '@/components/admin/article-categories/create-article-category-button';
import { ArticleCategoryTable } from '@/components/admin/article-categories/article-category-table';
import { EditArticleCategoryDialog } from '@/components/admin/article-categories/edit-article-category-dialog';
import { CreateArticleDialog } from '@/components/admin/articles/create-article-dialog';
import { ArticleCategory, Article } from '@/types';
import { toast } from 'sonner';
import { useArticleManagement } from '@/hooks/use-article-management';
import { ArticleTable } from '@/components/admin/articles/article-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EditArticleDialog } from '@/components/admin/articles/edit-article-dialog';

export default function ArticleManagementPage() { 
  const { categories: articleCategories, fetchCategories } = useArticleCategoryManagement();

  const {
    articles,
    totals,
    isLoading: isArticlesLoading,
    activeTab,
    setActiveTab,
    fetchArticles,
  } = useArticleManagement();

  const [isArticleEditDialogOpen, setIsArticleEditDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isCategoryEditDialogOpen, setIsCategoryEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | null>(null);

  const handleEditCategoryClick = (category: ArticleCategory) => {
    setSelectedCategory(category);
    setIsCategoryEditDialogOpen(true);
  };
  
  const handleEditArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setIsArticleEditDialogOpen(true);
  };

  const handleAction = async (actionPromise: Promise<Response>, messages: { loading: string; success: string; error: string; }) => {
    toast.promise(actionPromise, {
      loading: messages.loading,
      success: (res) => {
        fetchArticles();
        return messages.success;
      },
      error: (err) => err.message || messages.error,
    });
  };

  const handleSoftDelete = (articleId: string) => {
    handleAction(
      fetch(`/api/articles/${articleId}`, { method: 'DELETE' }),
      { loading: 'Memindahkan ke sampah...', success: 'Artikel berhasil dipindahkan ke sampah.', error: 'Gagal memindahkan artikel.' }
    );
  };

  const handleRestore = (articleId: string) => {
    handleAction(
      fetch(`/api/articles/${articleId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'restore' }) }),
      { loading: 'Memulihkan artikel...', success: 'Artikel berhasil dipulihkan.', error: 'Gagal memulihkan artikel.' }
    );
  };

  const handleForceDelete = (articleId: string) => {
    if (!window.confirm('Anda yakin? Aksi ini tidak dapat dibatalkan.')) return;
    handleAction(
      fetch(`/api/articles/${articleId}?force=true`, { method: 'DELETE' }),
      { loading: 'Menghapus permanen...', success: 'Artikel berhasil dihapus permanen.', error: 'Gagal menghapus artikel.' }
    );
  };

  return (
    <PageWrapper className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manajemen Artikel</h1>
        <p className="text-muted-foreground">Kelola kategori dan konten artikel untuk website Anda di sini.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="active">Aktif ({totals.active})</TabsTrigger>
            <TabsTrigger value="trashed">Sampah ({totals.trashed})</TabsTrigger>
          </TabsList>
          <CreateArticleDialog onSuccess={fetchArticles} />
        </div>
        <TabsContent value="active">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Daftar Artikel Aktif</CardTitle>
              <CardDescription>Tulis, edit, dan publikasikan artikel Anda.</CardDescription>
              {/* Nanti di sini bisa ditambahkan filter */}
            </CardHeader>
            <CardContent>
              <ArticleTable 
                variant="active"
                articles={articles.active}
                isLoading={isArticlesLoading}
                onRefresh={fetchArticles}
                onEditClick={handleEditArticleClick}
                onDeleteClick={handleSoftDelete} // <-- Hubungkan fungsi baru
                onRestoreClick={handleRestore}
                onForceDeleteClick={handleForceDelete}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trashed">
           <Card className="mt-4">
            <CardHeader>
              <CardTitle>Artikel di Sampah</CardTitle>
              <CardDescription>Daftar artikel yang telah dihapus.</CardDescription>
            </CardHeader>
            <CardContent>
              <ArticleTable 
                variant="trashed"
                articles={articles.trashed}
                isLoading={isArticlesLoading}
                onRefresh={fetchArticles}
                onEditClick={handleEditArticleClick}
                onDeleteClick={handleSoftDelete}
                onRestoreClick={handleRestore}
                onForceDeleteClick={handleForceDelete}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Kartu untuk Kategori Artikel */}
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
            categories={articleCategories.active}
            isLoading={false}
            error={null}
            onRefresh={fetchCategories}
            onEditClick={handleEditCategoryClick}
            selectedRowKeys={[]}
            setSelectedRowKeys={() => {}}
            searchTerm=""
          />
        </CardContent>
      </Card>

      <EditArticleDialog
        isOpen={isArticleEditDialogOpen}
        onClose={() => setIsArticleEditDialogOpen(false)}
        article={selectedArticle}
        onSuccess={fetchArticles}
      />

      <EditArticleCategoryDialog
        isOpen={isCategoryEditDialogOpen}
        onClose={() => setIsCategoryEditDialogOpen(false)}
        category={selectedCategory}
        onSuccess={() => {
          fetchCategories();
          toast.success('Kategori berhasil diperbarui!');
        }}
      />
    </PageWrapper>
  );
}
