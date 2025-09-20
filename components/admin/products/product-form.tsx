'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Category } from '@/types';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUploader } from './image-uploader';

// Definisikan tipe FormValues agar bisa di-re-use
export const formSchema = z.object({
  name: z.string().min(3, { message: 'Nama produk minimal 3 karakter.' }),
  description: z.string().min(10, { message: 'Deskripsi minimal 10 karakter.' }),
  specifications: z.string().min(10, { message: 'Spesifikasi minimal 10 karakter.' }),
  categoryId: z.string().min(1, { message: "Kategori wajib dipilih." }),
  imageUrl: z.string().min(1, { message: "Gambar produk wajib diunggah." }).url({ message: "URL gambar tidak valid." }),
});
export type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  formId: string;
  form: ReturnType<typeof useForm<ProductFormValues>>;
  onSubmit: (values: ProductFormValues) => void;
}

export function ProductForm({ form, onSubmit, formId }: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories?status=active');
        const data = await response.json();
        setCategories(data.data);
      } catch (error) {
        toast.error('Gagal memuat daftar kategori.');
      }
    };
    fetchCategories();
  }, []);

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-6">
        
        <FormField 
            control={form.control} 
            name="imageUrl" 
            render={({ field }) => (
                <FormItem>
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
        
        {/* ✅ KODE JSX YANG DIPERBAIKI FORMATNYA */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Produk</FormLabel>
              <FormControl>
                <Input placeholder="cth: Pintu Solid Merbau" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori Produk</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori untuk produk ini" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <FormControl>
                <Textarea placeholder="Jelaskan produk ini..." className="resize-y min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="specifications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Spesifikasi Teknis</FormLabel>
              <FormControl>
                <Textarea placeholder="cth: Ukuran: 90x210cm..." className="resize-y min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

      </form>
    </Form>
  );
}
