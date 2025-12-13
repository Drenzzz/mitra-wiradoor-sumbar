"use client";

import { useState, useEffect } from "react";
import { PageWrapper } from "@/components/admin/page-wrapper";
import { ArticleDetailDialog } from "@/components/admin/articles/article-detail-dialog";
import { CreateArticleDialog } from "@/components/admin/articles/create-article-dialog";
import { Article } from "@/types";
import { toast } from "sonner";
import { useArticleManagement } from "@/hooks/use-article-management";
import { useArticleCategoryManagement } from "@/hooks/use-article-category-management";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditArticleDialog } from "@/components/admin/articles/edit-article-dialog";
import { useDebounce } from "@/hooks/use-debounce";
import { ConfirmationDialog } from "@/components/admin/shared/confirmation-dialog";
import { ArticleListCard } from "@/components/admin/articles/article-list-card";

export default function ArticleManagementPage() {
  const { categories: articleCategories } = useArticleCategoryManagement();
  const {
    articles,
    totals,
    isLoading: isArticlesLoading,
    activeTab,
    setActiveTab,
    fetchArticles,
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

  const [localSearchInput, setLocalSearchInput] = useState("");
  const debouncedLocalSearch = useDebounce(localSearchInput, 400);

  useEffect(() => {
    setSearchTerm(debouncedLocalSearch);
  }, [debouncedLocalSearch, setSearchTerm]);

  const [isArticleEditDialogOpen, setIsArticleEditDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleEditArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setIsArticleEditDialogOpen(true);
  };

  const handleViewClick = (article: Article) => {
    setSelectedArticle(article);
    setIsDetailOpen(true);
  };

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    description: "",
    variant: "default" as "default" | "destructive",
    onConfirm: () => {},
  });
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleBulkAction = (action: "delete" | "restore" | "forceDelete") => {
    const configMap = {
      delete: {
        title: `Hapus ${selectedRowKeys.length} Artikel?`,
        description: "Artikel yang dipilih akan dipindahkan ke sampah.",
        variant: "destructive" as const,
      },
      restore: {
        title: `Pulihkan ${selectedRowKeys.length} Artikel?`,
        description: "Artikel yang dipilih akan dikembalikan dari sampah.",
        variant: "default" as const,
      },
      forceDelete: {
        title: `Hapus Permanen ${selectedRowKeys.length} Artikel?`,
        description: "Aksi ini tidak dapat dibatalkan. Data akan hilang selamanya.",
        variant: "destructive" as const,
      },
    };

    const messages = {
      delete: { loading: "Menghapus...", success: "Artikel berhasil dihapus.", error: "Gagal menghapus." },
      restore: { loading: "Memulihkan...", success: "Artikel berhasil dipulihkan.", error: "Gagal memulihkan." },
      forceDelete: { loading: "Menghapus permanen...", success: "Artikel berhasil dihapus permanen.", error: "Gagal menghapus." },
    };

    setDialogConfig({
      ...configMap[action],
      onConfirm: () => {
        setIsActionLoading(true);
        const endpoints = {
          delete: (id: string) => fetch(`/api/articles/${id}`, { method: "DELETE" }),
          restore: (id: string) => fetch(`/api/articles/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "restore" }) }),
          forceDelete: (id: string) => fetch(`/api/articles/${id}?force=true`, { method: "DELETE" }),
        };

        toast.promise(Promise.all(selectedRowKeys.map((id) => endpoints[action](id))), {
          loading: messages[action].loading,
          success: () => {
            fetchArticles();
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

  const handleSingleAction = (item: Article, action: "delete" | "restore" | "forceDelete") => {
    const configMap = {
      delete: {
        title: `Hapus Artikel "${item.title}"?`,
        description: "Artikel ini akan dipindahkan ke sampah.",
        variant: "destructive" as const,
      },
      restore: {
        title: `Pulihkan Artikel "${item.title}"?`,
        description: "Artikel ini akan dikembalikan dari sampah.",
        variant: "default" as const,
      },
      forceDelete: {
        title: `Hapus Permanen "${item.title}"?`,
        description: "Aksi ini tidak dapat dibatalkan. Data akan hilang selamanya.",
        variant: "destructive" as const,
      },
    };

    const messages = {
      delete: { loading: "Menghapus...", success: "Artikel berhasil dihapus.", error: "Gagal menghapus." },
      restore: { loading: "Memulihkan...", success: "Artikel berhasil dipulihkan.", error: "Gagal memulihkan." },
      forceDelete: { loading: "Menghapus permanen...", success: "Artikel berhasil dihapus permanen.", error: "Gagal menghapus." },
    };

    setDialogConfig({
      ...configMap[action],
      onConfirm: () => {
        setIsActionLoading(true);
        const endpoints = {
          delete: (id: string) => fetch(`/api/articles/${id}`, { method: "DELETE" }),
          restore: (id: string) => fetch(`/api/articles/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "restore" }) }),
          forceDelete: (id: string) => fetch(`/api/articles/${id}?force=true`, { method: "DELETE" }),
        };

        toast.promise(endpoints[action](item.id), {
          loading: messages[action].loading,
          success: () => {
            fetchArticles();
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
    <PageWrapper className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Artikel</h1>
          <p className="text-muted-foreground">Kelola semua konten dan artikel untuk website Anda di sini.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "active" | "trashed")}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="active">Aktif ({totals.active})</TabsTrigger>
            <TabsTrigger value="trashed">Sampah ({totals.trashed})</TabsTrigger>
          </TabsList>
          <CreateArticleDialog onSuccess={fetchArticles} />
        </div>
        <TabsContent value="active">
          <ArticleListCard
            variant="active"
            articles={articles.active}
            isLoading={isArticlesLoading}
            articleCategories={articleCategories.active}
            localSearchInput={localSearchInput}
            setLocalSearchInput={setLocalSearchInput}
            filterByCategory={filterByCategory}
            setFilterByCategory={setFilterByCategory}
            filterByStatus={filterByStatus}
            setFilterByStatus={setFilterByStatus}
            sortBy={sortBy}
            setSortBy={setSortBy}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            rowsPerPage={rowsPerPage}
            totalCount={totals.active}
            onRefresh={fetchArticles}
            onEditClick={handleEditArticleClick}
            onViewClick={handleViewClick}
            onDeleteClick={(article) => handleSingleAction(article, "delete")}
            onRestoreClick={(article) => handleSingleAction(article, "restore")}
            onForceDeleteClick={(article) => handleSingleAction(article, "forceDelete")}
            onBulkAction={handleBulkAction}
          />
        </TabsContent>
        <TabsContent value="trashed">
          <ArticleListCard
            variant="trashed"
            articles={articles.trashed}
            isLoading={isArticlesLoading}
            articleCategories={articleCategories.active}
            localSearchInput={localSearchInput}
            setLocalSearchInput={setLocalSearchInput}
            filterByCategory={filterByCategory}
            setFilterByCategory={setFilterByCategory}
            filterByStatus={filterByStatus}
            setFilterByStatus={setFilterByStatus}
            sortBy={sortBy}
            setSortBy={setSortBy}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            rowsPerPage={rowsPerPage}
            totalCount={totals.trashed}
            onRefresh={fetchArticles}
            onEditClick={handleEditArticleClick}
            onViewClick={handleViewClick}
            onDeleteClick={(article) => handleSingleAction(article, "delete")}
            onRestoreClick={(article) => handleSingleAction(article, "restore")}
            onForceDeleteClick={(article) => handleSingleAction(article, "forceDelete")}
            onBulkAction={handleBulkAction}
          />
        </TabsContent>
      </Tabs>
      <ArticleDetailDialog isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} article={selectedArticle} />
      <EditArticleDialog isOpen={isArticleEditDialogOpen} onClose={() => setIsArticleEditDialogOpen(false)} article={selectedArticle} onSuccess={fetchArticles} />
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={dialogConfig.onConfirm}
        title={dialogConfig.title}
        description={dialogConfig.description}
        variant={dialogConfig.variant}
        isLoading={isActionLoading}
      />
    </PageWrapper>
  );
}
