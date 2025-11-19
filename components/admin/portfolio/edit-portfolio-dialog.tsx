'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUploader } from '@/components/admin/products/image-uploader';
import { portfolioItemSchema, PortfolioItemFormValues } from '@/lib/validations/portfolio.schema';
import { PortfolioItem, PortfolioCategory } from '@/types';

interface EditPortfolioDialogProps {
  item: PortfolioItem | null;
  categories: PortfolioCategory[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditPortfolioDialog({ item, categories, isOpen, onClose, onSuccess }: EditPortfolioDialogProps) {
  const form = useForm({
    resolver: zodResolver(portfolioItemSchema),
  });

  useEffect(() => {
    if (item && isOpen) {
      form.reset({
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl,
        projectDate: new Date(item.projectDate),
        portfolioCategoryId: item.portfolioCategoryId || '',
      });
    }
  }, [item, isOpen, form]);

  const onSubmit = async (values: PortfolioItemFormValues) => {
    if (!item) return;

    toast.promise(
      fetch(`/api/portfolio/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      }).then(async res => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Gagal memperbarui portofolio');
        }
        return res.json();
      }),
      {
        loading: 'Memperbarui...',
        success: () => {
          onSuccess();
          onClose();
          return 'Portofolio berhasil diperbarui!';
        },
        error: (err: Error) => err.message,
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Proyek Portofolio</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Foto Proyek</FormLabel>
                  <FormControl>
                    <ImageUploader 
                      onUploadSuccess={(url) => form.setValue('imageUrl', url, { shouldValidate: true })}
                      initialImageUrl={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Judul Proyek</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="portfolioCategoryId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger></FormControl>
                        <SelectContent>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <FormField
              control={form.control}
              name="projectDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Pengerjaan</FormLabel>
                  <FormControl>
                      <Input 
                        type="date" 
                        value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                      />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>Simpan Perubahan</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
