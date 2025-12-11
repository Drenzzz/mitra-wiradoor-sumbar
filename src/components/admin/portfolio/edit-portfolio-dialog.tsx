"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PortfolioForm } from "./portfolio-form";
import { PortfolioFormValues } from "@/lib/validations/portfolio.schema";
import { PortfolioItem } from "@/types";
import { toast } from "sonner";
import { useState } from "react";

interface EditPortfolioDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  portfolio: PortfolioItem | null;
}

export function EditPortfolioDialog({ isOpen, onClose, onSuccess, portfolio }: EditPortfolioDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!portfolio) return null;

  const onSubmit = async (data: PortfolioFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/portfolio/${portfolio.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Gagal memperbarui portfolio");
      }

      toast.success("Portfolio berhasil diperbarui");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan perubahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultValues: Partial<PortfolioFormValues> = {
    title: portfolio.title,
    description: portfolio.description,
    imageUrl: portfolio.imageUrl,
    projectDate: new Date(portfolio.projectDate),
    portfolioCategoryId: portfolio.portfolioCategoryId || "",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Portfolio</DialogTitle>
          <DialogDescription>Ubah informasi proyek ini. Klik simpan untuk menerapkan perubahan.</DialogDescription>
        </DialogHeader>
        <PortfolioForm defaultValues={defaultValues} onSubmit={onSubmit} isSubmitting={isSubmitting} submitLabel="Simpan Perubahan" />
      </DialogContent>
    </Dialog>
  );
}
