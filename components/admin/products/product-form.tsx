"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Category } from "@/types";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiImageUploader } from "./multi-image-uploader";
import { CategoryManager } from "./category-manager";

export const formSchema = z.object({
  name: z.string().min(3, { message: "Nama produk minimal 3 karakter." }),
  description: z.string().min(10, { message: "Deskripsi minimal 10 karakter." }),
  specifications: z.string().min(10, { message: "Spesifikasi minimal 10 karakter." }),
  categoryId: z.string().min(1, { message: "Kategori wajib dipilih." }),
  images: z.array(z.string()).min(1, { message: "Minimal 1 gambar produk wajib diunggah." }),
  imageUrl: z.string().optional(),
  isReadyStock: z.boolean({ message: "Status produk wajib dipilih." }),
});

export type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  formId: string;
  form: ReturnType<typeof useForm<ProductFormValues>>;
  onSubmit: (values: ProductFormValues) => void;
}

export function ProductForm({ form, onSubmit, formId }: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories?status=active");
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      toast.error("Gagal memuat daftar kategori.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = (values: ProductFormValues) => {
    if (values.images && values.images.length > 0) {
      values.imageUrl = values.images[0];
    }
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-2">
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <MultiImageUploader
                  value={field.value || []}
                  onChange={(urls) => {
                    field.onChange(urls);
                    if (urls.length > 0) {
                      form.setValue("imageUrl", urls[0]);
                    }
                  }}
                  maxFiles={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="flex gap-2">
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Pilih kategori" />
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
                  <CategoryManager onCategoryChange={fetchCategories} />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isReadyStock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status Produk</FormLabel>
              <Select onValueChange={(value) => field.onChange(value === "true")} value={String(field.value)}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status ketersediaan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="false">Kustom (Pre-Order)</SelectItem>
                  <SelectItem value="true">Ready Stock</SelectItem>
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
                <Textarea placeholder="Jelaskan detail produk ini. Mendukung format teks sederhana." className="resize-y min-h-[150px] font-mono text-sm leading-relaxed" {...field} />
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
                <Textarea placeholder="cth: \n- Ukuran: 90x210cm\n- Material: Kayu Merbau\n- Finishing: Melamine" className="resize-y min-h-[150px] font-mono text-sm" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
