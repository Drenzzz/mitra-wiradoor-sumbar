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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Package, ImageIcon, Settings, FileText, CheckCircle, Clock } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const formSchema = z.object({
  name: z.string().min(3, { message: "Nama produk minimal 3 karakter." }),
  description: z.string().min(10, { message: "Deskripsi minimal 10 karakter." }),
  specifications: z.string().optional(),
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
      <form id={formId} onSubmit={form.handleSubmit(handleSubmit)} className="max-h-[75vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  Informasi Produk
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Produk</FormLabel>
                      <FormControl>
                        <Input placeholder="cth: Pintu Solid Merbau" className="h-11" {...field} />
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
                      <FormLabel>Deskripsi Produk</FormLabel>
                      <FormControl>
                        <RichTextEditor content={field.value} onChange={field.onChange} />
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
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Spesifikasi Teknis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="specifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea placeholder={"- Ukuran: 90x210cm\n- Material: Kayu Merbau\n- Finishing: Melamine\n- Ketebalan: 4cm"} className="resize-y min-h-[150px] font-mono text-sm leading-relaxed" {...field} />
                      </FormControl>
                      <p className="text-xs text-muted-foreground mt-2">Opsional. Tulis spesifikasi dalam format list dengan tanda strip (-) di awal baris.</p>
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
                  Galeri Produk
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                        <CategoryManager onCategoryChange={fetchCategories} />
                      </div>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isReadyStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status Ketersediaan</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={(value) => field.onChange(value === "true")} value={String(field.value)} className="grid grid-cols-1 gap-3 pt-2">
                          <div className="flex items-center">
                            <RadioGroupItem value="true" id="ready-stock" className="peer sr-only" />
                            <Label
                              htmlFor="ready-stock"
                              className="flex items-center gap-3 w-full cursor-pointer rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-green-500 peer-data-[state=checked]:bg-green-50 dark:peer-data-[state=checked]:bg-green-950"
                            >
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <div>
                                <div className="font-medium">Ready Stock</div>
                                <div className="text-xs text-muted-foreground">Produk tersedia dan siap kirim</div>
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="false" id="pre-order" className="peer sr-only" />
                            <Label
                              htmlFor="pre-order"
                              className="flex items-center gap-3 w-full cursor-pointer rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-yellow-500 peer-data-[state=checked]:bg-yellow-50 dark:peer-data-[state=checked]:bg-yellow-950"
                            >
                              <Clock className="h-5 w-5 text-yellow-600" />
                              <div>
                                <div className="font-medium">Kustom (Pre-Order)</div>
                                <div className="text-xs text-muted-foreground">Produk dibuat sesuai pesanan</div>
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
