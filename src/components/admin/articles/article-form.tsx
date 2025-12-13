"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { ArticleCategory } from "@/types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/products/image-uploader";
import { usePermission } from "@/hooks/use-permission";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ArticleCategoryManager } from "@/components/admin/articles/article-category-manager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Settings, ImageIcon } from "lucide-react";

export const formSchema = z.object({
  title: z.string().min(5, { message: "Judul artikel minimal 5 karakter." }),
  slug: z
    .string()
    .min(5, { message: "Slug minimal 5 karakter." })
    .regex(/^[a-z0-9-]+$/, { message: "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung." })
    .optional(),
  content: z.string().min(20, { message: "Konten artikel minimal 20 karakter." }),
  excerpt: z.string().max(160, { message: "Ringkasan maksimal 160 karakter." }).optional(),
  categoryId: z.string().min(1, { message: "Kategori wajib dipilih." }),
  featuredImageUrl: z.string().min(1, { message: "Gambar utama wajib diunggah." }).url(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
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

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/article-categories?status=active");
      const data = await response.json();
      setCategories(data.data);
    } catch (error) {
      toast.error("Gagal memuat daftar kategori artikel.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const excerptValue = form.watch("excerpt") || "";

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="max-h-[75vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Informasi Artikel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Judul Artikel</FormLabel>
                      <FormControl>
                        <Input placeholder="Panduan Memilih Pintu Terbaik..." className="h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug (URL)</FormLabel>
                      <FormControl>
                        <Input placeholder="panduan-memilih-pintu-terbaik" className="font-mono text-sm" {...field} />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">Biarkan kosong untuk generate otomatis dari judul.</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Konten Artikel</FormLabel>
                      <FormControl>
                        <RichTextEditor content={field.value} onChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ringkasan (Meta Description)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Ringkasan singkat artikel untuk SEO dan preview..." className="resize-none h-20" {...field} />
                      </FormControl>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Untuk SEO dan preview di hasil pencarian.</span>
                        <span className={excerptValue.length > 160 ? "text-destructive" : ""}>{excerptValue.length}/160</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  Gambar Utama
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="featuredImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUploader onUploadSuccess={(url) => form.setValue("featuredImageUrl", url, { shouldValidate: true })} initialImageUrl={field.value} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  Pengaturan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Kategori</FormLabel>
                        <ArticleCategoryManager onSuccess={fetchCategories} />
                      </div>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kategori" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {can("article:publish") ? (
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih status publikasi" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="DRAFT">
                              <span className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-yellow-500" />
                                Draft
                              </span>
                            </SelectItem>
                            <SelectItem value="PUBLISHED">
                              <span className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-green-500" />
                                Published
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
                    Status otomatis diset ke <strong>Draft</strong>. Hubungi Admin untuk publikasi.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
