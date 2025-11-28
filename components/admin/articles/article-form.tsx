'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { ArticleCategory } from '@/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUploader } from '@/components/admin/products/image-uploader';
import { usePermission } from '@/hooks/use-permission';

export const formSchema = z.object({
  title: z.string().min(5, { message: 'Judul artikel minimal 5 karakter.' }),
  content: z.string().min(20, { message: 'Konten artikel minimal 20 karakter.' }),
  categoryId: z.string().min(1, { message: "Kategori wajib dipilih." }),
  featuredImageUrl: z.string().min(1, { message: "Gambar utama wajib diunggah." }).url(),
  status: z.enum(['DRAFT', 'PUBLISHED']),
});

export type ArticleFormValues = z.infer<typeof formSchema>;

interface ArticleFormProps {
  formId: string;
  form: ReturnType<typeof useForm<ArticleFormValues>>;
  onSubmit: (values: ArticleFormValues) => void;
}

export function ArticleForm({ form, onSubmit, formId }: ArticleFormProps) {
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const { can } = usePermission();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/article-categories?status=active');
        const data = await response.json();
        setCategories(data.data);
      } catch (error) {
        toast.error('Gagal memuat daftar kategori artikel.');
      }
    };
    fetchCategories();
  }, []);

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Judul Artikel</FormLabel>
                <FormControl><Input placeholder="Panduan Memilih Pintu Terbaik..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="content" render={({ field }) => (
              <FormItem>
                <FormLabel>Konten Artikel</FormLabel>
                <FormControl><Textarea placeholder="Tulis konten artikel Anda di sini..." className="resize-y min-h-[300px]" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <div className="space-y-4">
            <FormField control={form.control} name="featuredImageUrl" render={({ field }) => (
              <FormItem>
                <FormLabel>Gambar Utama</FormLabel>
                <FormControl>
                  <ImageUploader onUploadSuccess={(url) => form.setValue('featuredImageUrl', url, { shouldValidate: true })} initialImageUrl={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="categoryId" render={({ field }) => (
              <FormItem>
                <FormLabel>Kategori Artikel</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((cat) => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
             
             {can('article:publish') ? (
               <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Pilih status publikasi" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )} />
             ) : (
               <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
                  Status artikel otomatis diset ke <strong>Draft</strong>. Hubungi Admin untuk publikasi.
               </div>
             )}
          </div>
        </div>
      </form>
    </Form>
  );
}
