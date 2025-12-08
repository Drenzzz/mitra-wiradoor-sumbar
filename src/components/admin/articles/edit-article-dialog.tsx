'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Article } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ArticleForm, formSchema, ArticleFormValues } from './article-form';

interface EditArticleDialogProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditArticleDialog({ article, isOpen, onClose, onSuccess }: EditArticleDialogProps) {
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (article && isOpen) {
      form.reset({
        title: article.title,
        content: article.content,
        categoryId: article.categoryId,
        featuredImageUrl: article.featuredImageUrl,
        status: article.status,
      });
    }
  }, [article, isOpen, form]);

  const onSubmit = async (values: ArticleFormValues) => {
    if (!article) return;

    toast.promise(
      fetch(`/api/articles/${article.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }).then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Gagal memperbarui artikel");
        }
        return res.json();
      }),
      {
        loading: "Menyimpan perubahan...",
        success: () => {
          onSuccess();
          onClose();
          return "Artikel berhasil diperbarui!";
        },
        error: (err: Error) => err.message,
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Artikel</DialogTitle>
          <DialogDescription>
            Ubah detail artikel di bawah ini. Klik simpan jika sudah selesai.
          </DialogDescription>
        </DialogHeader>
        <ArticleForm form={form} onSubmit={onSubmit} formId="article-edit-form" />
        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
          <Button type="submit" form="article-edit-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
