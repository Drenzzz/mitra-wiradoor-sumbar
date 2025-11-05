'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { ProductForm, formSchema, ProductFormValues } from './product-form';

export function CreateProductButton({ onSuccess }: { onSuccess: () => void; }) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      name: '', 
      description: '', 
      specifications: '', 
      categoryId: '', 
      imageUrl: '',
      isReadyStock: false
    },
  });

  const onSubmit = async (values: ProductFormValues) => {
    toast.promise(
        fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) })
        .then(async res => {
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Gagal menambahkan produk');
            }
            return res.json();
        }),
        {
            loading: 'Menyimpan...',
            success: () => { onSuccess(); setIsOpen(false); form.reset(); return 'Produk ditambahkan!'; },
            error: (err: Error) => err.message,
        }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button><PlusCircle className="mr-2 h-4 w-4" />Tambah Produk</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
            <DialogTitle>Tambah Produk Baru</DialogTitle>
        </DialogHeader>
        <ProductForm form={form} onSubmit={onSubmit} formId="product-create-form" />
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
          <Button type="submit" form="product-create-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Menyimpan..." : "Simpan Produk"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
