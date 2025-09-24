'use client';

import { useState } from 'react';
import { PageWrapper } from '@/components/admin/page-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useArticleCategoryManagement } from '@/hooks/use-article-category-management';
import { CreateArticleCategoryButton } from '@/components/admin/article-categories/create-article-category-button';
import { ArticleCategoryTable } from '@/components/admin/article-categories/article-category-table';
import { EditArticleCategoryDialog } from '@/components/admin/article-categories/edit-article-category-dialog';
import { ArticleDetailDialog } from '@/components/admin/articles/article-detail-dialog'; 
import { CreateArticleDialog } from '@/components/admin/articles/create-article-dialog';
import { ArticleCategory, Article } from '@/types';
import { toast } from 'sonner';
import { useArticleManagement } from '@/hooks/use-article-management';
import { ArticleTable } from '@/components/admin/articles/article-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EditArticleDialog } from '@/components/admin/articles/edit-article-dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { Undo, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ArticleManagementPage() { 
  const { categories: articleCategories, fetchCategories } = useArticleCategoryManagement();

  const {
    articles,
    totals,
    isLoading: isArticlesLoading,
    activeTab,
    setActiveTab,
    fetchArticles,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    filterByCategory,
    setFilterByCategory,
    filterByStatus,
    setFilterByStatus,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    selectedRowKeys,
    setSelectedRowKeys,
  } = useArticleManagement();

  const [isArticleEditDialogOpen, setIsArticleEditDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isCategoryEditDialogOpen, setIsCategoryEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleEditCategoryClick = (category: ArticleCategory) => {
    setSelectedCategory(category);
    setIsCategoryEditDialogOpen(true);
  };
  
  const handleEditArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setIsArticleEditDialogOpen(true);
  };

  const handleViewClick = (article: Article) => {
    setSelectedArticle(article);
    setIsDetailOpen(true);
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

  const handleBulkAction = (action: 'delete' | 'restore' | 'forceDelete') => {
    const actionPromise = Promise.all(selectedRowKeys.map(id => {
        if (action === 'delete') return fetch(`/api/articles/${id}`, { method: 'DELETE' });
        if (action === 'restore') return fetch(`/api/articles/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'restore' }) });
        if (action === 'forceDelete') return fetch(`/api/articles/${id}?force=true`, { method: 'DELETE' });
        return Promise.reject('Invalid action');
    }));

    const messages = {
      delete: { loading: `Menghapus ${selectedRowKeys.length} artikel...`, success: 'Artikel berhasil dihapus.', error: 'Gagal menghapus beberapa artikel.' },
      restore: { loading: `Memulihkan ${selectedRowKeys.length} artikel...`, success: 'Artikel berhasil dipulihkan.', error: 'Gagal memulihkan beberapa artikel.' },
      forceDelete: { loading: `Menghapus permanen ${selectedRowKeys.length} artikel...`, success: 'Artikel berhasil dihapus permanen.', error: 'Gagal menghapus beberapa artikel.' },
    };
    
    if (action === 'forceDelete' && !window.confirm(`Anda yakin ingin menghapus ${selectedRowKeys.length} artikel ini secara permanen? Aksi ini tidak dapat dibatalkan.`)) return;

    toast.promise(actionPromise, {
      loading: messages[action].loading,
      success: () => {
          fetchArticles();
          setSelectedRowKeys([]);
          return messages[action].success;
      },
      error: (err) => (err as Error).message || messages[action].error,
    });
  };

  const ArticleListCard = ({ variant }: { variant: 'active' | 'trashed' }) => {
    const totalCount = variant === 'active' ? totals.active : totals.trashed;
    const totalPages = Math.ceil(totalCount / rowsPerPage);

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>{variant === 'active' ? 'Daftar Artikel Aktif' : 'Artikel di Sampah'}</CardTitle>
          <CardDescription>
            {variant === 'active' ? 'Tulis, edit, dan publikasikan artikel Anda.' : 'Daftar artikel yang telah dihapus.'}
          </CardDescription>
          
          <div className="flex flex-col md:flex-row items-center gap-2 pt-4">
            {/* === BAGIAN YANG HILANG: UI AKSI MASSAL === */}
            <AnimatePresence>
              {selectedRowKeys.length > 0 && (
                <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="flex items-center gap-2">
                  {variant === 'active' ? (
                    <Button variant="destructive" size="sm" onClick={() => handleBulkAction('delete')}>
                      <Trash2 className="mr-2 h-4 w-4" /> Hapus ({selectedRowKeys.length})
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" onClick={() => handleBulkAction('restore')}>
                        <Undo className="mr-2 h-4 w-4" /> Pulihkan ({selectedRowKeys.length})
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleBulkAction('forceDelete')}>
                        <Trash2 className="mr-2 h-4 w-4" /> Hapus Permanen
                      </Button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            <Input
              placeholder="Cari judul artikel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:flex-1"
              disabled={variant === 'trashed'}
            />
            <Select 
              value={filterByCategory} 
              onValueChange={(value) => setFilterByCategory(value === 'all' ? '' : value)}
              disabled={variant === 'trashed'}
            >
              <SelectTrigger className="w-full md:w-[220px]">
                <SelectValue placeholder="Filter berdasarkan Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {articleCategories.active.map(category => (
                  <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filterByStatus}
              onValueChange={(value) => setFilterByStatus(value === 'all' ? '' : value)}
              disabled={variant === 'trashed'}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Urutkan berdasarkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Terbaru</SelectItem>
                <SelectItem value="createdAt-asc">Terlama</SelectItem>
                <SelectItem value="title-asc">Judul (A-Z)</SelectItem>
                <SelectItem value="title-desc">Judul (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ArticleTable
            variant={variant}
            articles={variant === 'active' ? articles.active : articles.trashed}
            isLoading={isArticlesLoading}
            onRefresh={fetchArticles}
            onEditClick={handleEditArticleClick}
            onViewClick={handleViewClick} 
            onDeleteClick={handleSoftDelete}
            onRestoreClick={handleRestore}
            onForceDeleteClick={handleForceDelete}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
          />
        </CardContent>
        {/* === BAGIAN YANG HILANG: UI PAGINASI === */}
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
        <TabsContent value="active"><ArticleListCard variant="active" /></TabsContent>
        <TabsContent value="trashed"><ArticleListCard variant="trashed" /></TabsContent>
      </Tabs>
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
      <ArticleDetailDialog
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        article={selectedArticle}
      />
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
