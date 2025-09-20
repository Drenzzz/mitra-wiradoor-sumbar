'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import { MoreHorizontal, Pencil, Trash2, Eye, Undo } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

interface ProductTableProps {
  variant: 'active' | 'trashed';
  products: Product[];
  isLoading: boolean;
  error: string | null;
  onEditClick: (product: Product) => void;
  onViewClick: (product: Product) => void;
  onRefresh: () => void;
}

export function ProductTable({ variant, products, isLoading, error, onEditClick, onViewClick, onRefresh }: ProductTableProps) {

  const handleAction = async (promise: Promise<Response>, messages: { loading: string; success: string; error: string; }) => {
    toast.promise(promise, {
        loading: messages.loading,
        success: () => {
            onRefresh();
            return messages.success;
        },
        error: messages.error,
    });
  };

  const handleSoftDelete = (id: string) => {
    handleAction(
        fetch(`/api/products/${id}`, { method: 'DELETE' }),
        { loading: 'Memindahkan ke sampah...', success: 'Produk dipindahkan ke sampah.', error: 'Gagal memindahkan produk.' }
    );
  };

  const handleRestore = (id: string) => {
    handleAction(
        fetch(`/api/products/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'restore' }) }),
        { loading: 'Memulihkan produk...', success: 'Produk berhasil dipulihkan.', error: 'Gagal memulihkan produk.' }
    );
  };

  const handlePermanentDelete = (id: string) => {
    if (!window.confirm('Anda yakin ingin menghapus produk ini secara permanen? Aksi ini tidak dapat dibatalkan.')) return;
    handleAction(
        fetch(`/api/products/${id}?force=true`, { method: 'DELETE' }),
        { loading: 'Menghapus permanen...', success: 'Produk dihapus permanen.', error: 'Gagal menghapus produk.' }
    );
  };

  if (isLoading) return <div className="text-center p-8 text-muted-foreground">Memuat data produk...</div>;
  if (error) return <div className="text-center p-8 text-destructive">Error: {error}</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">Gambar</TableHead>
          <TableHead>Nama Produk</TableHead>
          <TableHead>Kategori</TableHead>
          <TableHead>Deskripsi</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.length > 0 ? (
          products.map((product) => (
            <motion.tr key={product.id} variants={itemVariants} layout>
              <TableCell>
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={64}
                  height={64}
                  className="rounded-md object-cover"
                />
              </TableCell>
              <TableCell className="font-semibold">{product.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{product.category?.name || 'N/A'}</Badge>
              </TableCell>
              <TableCell className="max-w-xs truncate text-muted-foreground">{product.description}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                    <DropdownMenuItem onSelect={() => onViewClick(product)}><Eye className="mr-2 h-4 w-4" />Lihat Detail</DropdownMenuItem>
                    {variant === 'active' ? (
                      <>
                        <DropdownMenuItem onSelect={() => onEditClick(product)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500" onSelect={() => handleSoftDelete(product.id)}><Trash2 className="mr-2 h-4 w-4" />Hapus</DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem onSelect={() => handleRestore(product.id)}><Undo className="mr-2 h-4 w-4" />Pulihkan</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500" onSelect={() => handlePermanentDelete(product.id)}><Trash2 className="mr-2 h-4 w-4" />Hapus Permanen</DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </motion.tr>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
              {variant === 'active' ? 'Belum ada produk.' : 'Tidak ada produk di sampah.'}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
