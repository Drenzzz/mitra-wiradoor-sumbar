'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { portfolioCategorySchema, PortfolioCategoryFormValues } from '@/lib/validations/portfolio.schema';
import { PortfolioCategory } from '@/types';

interface EditProps {
  category: PortfolioCategory | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditPortfolioCategoryDialog({ category, isOpen, onClose, onSuccess }: EditProps) {
  const form = useForm({
    resolver: zodResolver(portfolioCategorySchema),
  });

  useEffect(() => {
    if (category && isOpen) {
      form.reset({ name: category.name, description: category.description || '' });
    }
  }, [category, isOpen, form]);

  const onSubmit = async (values: PortfolioCategoryFormValues) => {
    if (!category) return;
    toast.promise(
      fetch(`/api/portfolio-categories/${category.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      }).then(async res => { if (!res.ok) throw new Error((await res.json()).error); return res.json(); }),
      {
        loading: 'Menyimpan...',
        success: () => { onSuccess(); onClose(); return 'Kategori diupdate!'; },
        error: (err: Error) => err.message,
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader><DialogTitle>Edit Kategori</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Nama</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Deskripsi</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>Simpan</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
