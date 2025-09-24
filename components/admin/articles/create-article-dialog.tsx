'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { ArticleForm, formSchema, ArticleFormValues } from './article-form';

export function CreateArticleDialog({ onSuccess }: { onSuccess: () => void; }) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '', content: '', categoryId: '', featuredImageUrl: '', status: 'DRAFT' },
  });

  const onSubmit = async (values: ArticleFormValues) => {
    toast.promise(
      fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      }).then(async res => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Gagal menambahkan artikel');
        }
        return res.json();
      }),
      {
        loading: 'Menyimpan artikel...',
        success: () => {
          onSuccess();
          setIsOpen(false);
          form.reset();
          return 'Artikel berhasil ditambahkan!';
        },
        error: (err: Error) => err.message,
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tulis Artikel
        </Button>
      </DialogTrigger>
      {/* Buat dialog lebih lebar untuk form yang kompleks */}
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
            <DialogTitle>Tulis Artikel Baru</DialogTitle>
        </DialogHeader>
        <ArticleForm form={form} onSubmit={onSubmit} formId="article-create-form" />
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
          <Button type="submit" form="article-create-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Menyimpan..." : "Simpan Artikel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
