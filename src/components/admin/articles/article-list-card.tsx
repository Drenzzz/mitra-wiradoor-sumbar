"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Undo, Trash2 } from "lucide-react";
import { ArticleTable } from "@/components/admin/articles/article-table";
import type { Article, ArticleCategory } from "@/types";

interface ArticleListCardProps {
  variant: "active" | "trashed";
  articles: Article[];
  isLoading: boolean;
  articleCategories: ArticleCategory[];
  localSearchInput: string;
  setLocalSearchInput: (value: string) => void;
  filterByCategory: string;
  setFilterByCategory: (value: string) => void;
  filterByStatus: string;
  setFilterByStatus: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  selectedRowKeys: string[];
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<string[]>>;
  currentPage: number;
  setCurrentPage: (fn: (p: number) => number) => void;
  rowsPerPage: number;
  totalCount: number;
  onRefresh: () => void;
  onEditClick: (article: Article) => void;
  onViewClick: (article: Article) => void;
  onDeleteClick: (article: Article) => void;
  onRestoreClick: (article: Article) => void;
  onForceDeleteClick: (article: Article) => void;
  onBulkAction: (action: "delete" | "restore" | "forceDelete") => void;
}

export function ArticleListCard({
  variant,
  articles,
  isLoading,
  articleCategories,
  localSearchInput,
  setLocalSearchInput,
  filterByCategory,
  setFilterByCategory,
  filterByStatus,
  setFilterByStatus,
  sortBy,
  setSortBy,
  selectedRowKeys,
  setSelectedRowKeys,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  totalCount,
  onRefresh,
  onEditClick,
  onViewClick,
  onDeleteClick,
  onRestoreClick,
  onForceDeleteClick,
  onBulkAction,
}: ArticleListCardProps) {
  const totalPages = Math.ceil(totalCount / rowsPerPage);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{variant === "active" ? "Daftar Artikel Aktif" : "Artikel di Sampah"}</CardTitle>
        <CardDescription>{variant === "active" ? "Tulis, edit, dan publikasikan artikel Anda." : "Daftar artikel yang telah dihapus."}</CardDescription>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4">
          <div className="flex w-full sm:w-auto items-center gap-2 flex-1">
            <AnimatePresence>
              {selectedRowKeys.length > 0 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                  {variant === "active" ? (
                    <Button variant="destructive" size="sm" onClick={() => onBulkAction("delete")}>
                      <Trash2 className="mr-2 h-4 w-4" /> Hapus ({selectedRowKeys.length})
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => onBulkAction("restore")}>
                        <Undo className="mr-2 h-4 w-4" /> Pulihkan ({selectedRowKeys.length})
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => onBulkAction("forceDelete")}>
                        <Trash2 className="mr-2 h-4 w-4" /> Hapus Permanen
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            <Input placeholder="Cari judul artikel..." value={localSearchInput} onChange={(e) => setLocalSearchInput(e.target.value)} className="w-full" disabled={variant === "trashed"} />
          </div>

          <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-2">
            <div className="flex w-full items-center gap-2">
              <Select value={filterByCategory} onValueChange={(value) => setFilterByCategory(value === "all" ? "" : value)} disabled={variant === "trashed"}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {articleCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterByStatus} onValueChange={(value) => setFilterByStatus(value === "all" ? "" : value)} disabled={variant === "trashed"}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-auto">
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
        </div>
      </CardHeader>

      <CardContent>
        <ArticleTable
          variant={variant}
          articles={articles}
          isLoading={isLoading}
          onRefresh={onRefresh}
          onEditClick={onEditClick}
          onViewClick={onViewClick}
          onDeleteClick={onDeleteClick}
          onRestoreClick={onRestoreClick}
          onForceDeleteClick={onForceDeleteClick}
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
            <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage <= 1}>
              Sebelumnya
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage >= totalPages}>
              Selanjutnya
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
