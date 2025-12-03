"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(3, { message: "Nama kategori minimal 3 karakter." }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ArticleCategoryManagerProps {
  onSuccess?: () => void;
}

export function ArticleCategoryManager({ onSuccess }: ArticleCategoryManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/article-categories?status=active");
      const data = await response.json();
      setCategories(data.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await fetch("/api/article-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Gagal membuat kategori");

      toast.success("Kategori berhasil dibuat");
      form.reset();
      fetchCategories();
      onSuccess?.();
    } catch (error) {
      toast.error("Gagal membuat kategori");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus kategori ini?")) return;

    try {
      const response = await fetch(`/api/article-categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Gagal menghapus kategori");

      toast.success("Kategori dihapus");
      fetchCategories();
      onSuccess?.();
    } catch (error) {
      toast.error("Gagal menghapus kategori");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) fetchCategories();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-9">
          <Plus className="mr-2 h-4 w-4" />
          Kelola Kategori
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manajemen Kategori Artikel</DialogTitle>
          <DialogDescription>Tambah atau hapus kategori artikel di sini.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
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
              <Button type="submit" size="sm">
                Tambah
              </Button>
            </form>
          </Form>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Daftar Kategori</h4>
            <div className="border rounded-md divide-y max-h-[200px] overflow-y-auto">
              {categories.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">Belum ada kategori.</div>
              ) : (
                categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-2 text-sm">
                    <span>{category.name}</span>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(category.id)}>
                      <span className="sr-only">Hapus</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
