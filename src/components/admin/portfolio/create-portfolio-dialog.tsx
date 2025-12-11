"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PortfolioForm } from "./portfolio-form";
import { PortfolioFormValues } from "@/lib/validations/portfolio.schema";
import { toast } from "sonner";
import { useState } from "react";

interface CreatePortfolioDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreatePortfolioDialog({ isOpen, onClose, onSuccess }: CreatePortfolioDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: PortfolioFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Gagal menambahkan portfolio");
      }

      toast.success("Portfolio berhasil ditambahkan");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan data");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Portfolio Baru</DialogTitle>
          <DialogDescription>Masukkan detail proyek yang telah dikerjakan. Anda bisa memilih kategori yang ada atau membuat baru.</DialogDescription>
        </DialogHeader>
        <PortfolioForm onSubmit={onSubmit} isSubmitting={isSubmitting} submitLabel="Simpan Portfolio" />
      </DialogContent>
    </Dialog>
  );
}
