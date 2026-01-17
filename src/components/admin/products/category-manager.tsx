"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Plus, Trash2, Loader2, Settings2 } from "lucide-react";
import { Category } from "@/types";
import { getCsrfToken } from "@/lib/csrf";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  name: z.string().min(2, "Nama kategori minimal 2 karakter"),
  description: z.string().optional(),
});

interface CategoryManagerProps {
  onCategoryChange: () => void;
}

export function CategoryManager({ onCategoryChange }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/categories?status=active");
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      toast.error("Gagal memuat kategori");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": getCsrfToken() || "",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Gagal membuat kategori");

      toast.success("Kategori berhasil dibuat");
      form.reset();
      fetchCategories();
      onCategoryChange();
    } catch (error) {
      toast.error("Gagal membuat kategori");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kategori ini?")) return;

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          "X-CSRF-Token": getCsrfToken() || "",
        },
      });

      if (!response.ok) throw new Error("Gagal menghapus kategori");

      toast.success("Kategori dihapus");
      fetchCategories();
      onCategoryChange();
    } catch (error) {
      toast.error("Gagal menghapus kategori");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="Kelola Kategori">
          <Settings2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manajemen Kategori</DialogTitle>
          <DialogDescription>Tambah atau hapus kategori produk di sini.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-end">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="sr-only">Nama Kategori</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama kategori baru..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              </Button>
            </form>
          </Form>

          <Separator />

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Daftar Kategori</h4>
            <div className="h-[200px] overflow-y-auto rounded-md border p-2 custom-scrollbar">
              {isLoading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : categories.length > 0 ? (
                <div className="space-y-1">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted group">
                      <span className="text-sm font-medium">{category.name}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(category.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-muted-foreground p-4">Belum ada kategori.</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
