"use client";

import { useEffect } from "react";
import { Product } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ProductForm, formSchema, ProductFormValues } from "./product-form";

interface EditProductDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditProductDialog({ product, isOpen, onClose, onSuccess }: EditProductDialogProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description,
        specifications: product.specifications,
        categoryId: product.categoryId,
        imageUrl: product.imageUrl,
        isReadyStock: product.isReadyStock || false,
      });
    }
  }, [product, form, isOpen]);

  const onSubmit = async (values: ProductFormValues) => {
    if (!product) return;

    toast.promise(
      fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }).then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Gagal memperbarui produk");
        }
        return res.json();
      }),
      {
        loading: "Menyimpan perubahan...",
        success: () => {
          onSuccess();
          onClose();
          return "Produk berhasil diperbarui!";
        },
        error: (err: Error) => err.message,
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Produk</DialogTitle>
          <DialogDescription>Ubah detail produk di bawah ini.</DialogDescription>
        </DialogHeader>
        <ProductForm form={form} onSubmit={onSubmit} formId="product-edit-form" />
        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" form="product-edit-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
