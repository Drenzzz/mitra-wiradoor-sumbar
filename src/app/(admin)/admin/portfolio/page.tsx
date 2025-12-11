"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageWrapper } from "@/components/admin/page-wrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePortfolioManagement } from "@/hooks/use-portfolio-management";
import { PortfolioTable } from "@/components/admin/portfolio/portfolio-table";
import { CreatePortfolioDialog } from "@/components/admin/portfolio/create-portfolio-dialog";
import { EditPortfolioDialog } from "@/components/admin/portfolio/edit-portfolio-dialog";
import { ConfirmationDialog } from "@/components/admin/shared/confirmation-dialog";
import { PortfolioItem } from "@/types";

export default function PortfolioManagementPage() {
  const { portfolio, totalCount, isLoading, searchTerm, setSearchTerm, currentPage, setCurrentPage, rowsPerPage, fetchportfolio, deletePortfolio } = usePortfolioManagement();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState<string | null>(null);

  const handleEdit = (portfolio: PortfolioItem) => {
    setSelectedPortfolio(portfolio);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setPortfolioToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (portfolioToDelete) {
      await deletePortfolio(portfolioToDelete);
      setIsDeleteOpen(false);
      setPortfolioToDelete(null);
    }
  };

  const totalPages = Math.ceil(totalCount / rowsPerPage);

  return (
    <PageWrapper>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Portfolio</h1>
          <p className="text-muted-foreground">Kelola daftar proyek dan hasil kerja yang ditampilkan di website.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Portfolio
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Proyek</CardTitle>
          <CardDescription>Semua portfolio proyek yang telah Anda kerjakan. Kategori dapat dikelola langsung saat menambah/edit proyek.</CardDescription>
          <div className="pt-4">
            <Input placeholder="Cari judul proyek..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" />
          </div>
        </CardHeader>
        <CardContent>
          <PortfolioTable portfolio={portfolio} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDeleteClick} />
        </CardContent>
        {totalPages > 1 && (
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong>
            </div>
            <div className="flex items-center space-x-2 ml-auto">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1 || isLoading}>
                Sebelumnya
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages || isLoading}>
                Selanjutnya
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

      <CreatePortfolioDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={fetchportfolio} />

      <EditPortfolioDialog isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} onSuccess={fetchportfolio} portfolio={selectedPortfolio} />

      <ConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Portfolio"
        description="Apakah Anda yakin ingin menghapus portfolio ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
        variant="destructive"
      />
    </PageWrapper>
  );
}
