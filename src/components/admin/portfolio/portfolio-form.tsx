"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ImageUploader } from "@/components/admin/products/image-uploader";
import { portfolioSchema, type PortfolioFormValues } from "@/lib/validations/portfolio.schema";
import { cn } from "@/lib/utils";
import { usePortfolioCategoryManagement } from "@/hooks/use-portfolio-category-management";
import { toast } from "sonner";

import { PortfolioCategory } from "@/types";

interface PortfolioFormProps {
  defaultValues?: Partial<PortfolioFormValues>;
  onSubmit: (data: PortfolioFormValues) => Promise<void>;
  isSubmitting: boolean;
  submitLabel: string;
}

export function PortfolioForm({ defaultValues, onSubmit, isSubmitting, submitLabel }: PortfolioFormProps) {
  const { categories, fetchCategories } = usePortfolioCategoryManagement();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      imageUrl: defaultValues?.imageUrl || "",
      projectDate: defaultValues?.projectDate ? new Date(defaultValues.projectDate) : new Date(),
      portfolioCategoryId: defaultValues?.portfolioCategoryId || "",
    },
  });

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    setIsCreatingCategory(true);
    try {
      const res = await fetch("/api/portfolio-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gagal membuat kategori");
      }

      const newCategory = await res.json();
      await fetchCategories();
      
      form.setValue("portfolioCategoryId", newCategory.id);
      setNewCategoryName("");
      setIsCategoryOpen(false);
      toast.success("Kategori berhasil dibuat");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Gagal membuat kategori baru");
    } finally {
      setIsCreatingCategory(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Foto Proyek</FormLabel>
              <FormControl>
                <ImageUploader initialImageUrl={field.value} onUploadSuccess={(url) => field.onChange(url)} />
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
                <FormLabel>Nama Proyek</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: Pemasangan Pintu Hotel XYZ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="portfolioCategoryId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Kategori</FormLabel>
                <Popover open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" role="combobox" className={cn("w-full justify-between", !field.value && "text-muted-foreground")}>
                        {field.value ? categories.active.find((c: PortfolioCategory) => c.id === field.value)?.name || "Pilih Kategori" : "Pilih Kategori"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Cari atau buat kategori baru..." onValueChange={setNewCategoryName} />
                      <CommandList>
                        <CommandEmpty>
                          <div className="p-2">
                            <p className="text-sm text-muted-foreground mb-2">Kategori tidak ditemukan.</p>
                            <Button size="sm" className="w-full h-8" onClick={handleCreateCategory} disabled={isCreatingCategory}>
                              {isCreatingCategory ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Plus className="h-3 w-3 mr-2" />}
                              Buat &quot;{newCategoryName}&quot;
                            </Button>
                          </div>
                        </CommandEmpty>
                        <CommandGroup heading="Kategori Tersedia">
                          {categories.active.map((category: PortfolioCategory) => (
                            <CommandItem
                              key={category.id}
                              value={category.name}
                              onSelect={() => {
                                form.setValue("portfolioCategoryId", category.id);
                                setIsCategoryOpen(false);
                              }}
                            >
                              <Check className={cn("mr-2 h-4 w-4", category.id === field.value ? "opacity-100" : "opacity-0")} />
                              {category.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="projectDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Tanggal Pengerjaan</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                      {field.value ? format(field.value, "PPP", { locale: idLocale }) : <span>Pilih tanggal</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi Singkat</FormLabel>
              <FormControl>
                <Textarea placeholder="Jelaskan detail proyek ini..." className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
