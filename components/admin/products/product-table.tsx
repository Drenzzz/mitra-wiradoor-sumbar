// components/admin/products/product-table.tsx
'use client';

import { useEffect, useRef } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';

const itemVariants: any = {
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
  selectedRowKeys: string[];
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<string[]>>;
}

export function ProductTable({ variant, products, isLoading, error, onEditClick, onViewClick, onRefresh, selectedRowKeys, setSelectedRowKeys }: ProductTableProps) {

  const handleSelectAll = (checked: boolean) => {
    setSelectedRowKeys(checked ? products.map(p => p.id) : []);
  };

  const handleRowSelect = (id: string, checked: boolean) => {
    setSelectedRowKeys(prev => checked ? [...prev, id] : prev.filter(key => key !== id));
  };

  const handleAction = async (promise: Promise<Response>, messages: { loading: string; success: string; error: string; }) => {
    toast.promise(promise, {
        loading: messages.loading,
        success: () => {
            onRefresh();
            return messages.success;
        },
        error: (err: any) => err.message || messages.error,
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

  const headerCheckboxRef = useRef<HTMLButtonElement>(null); // Buat ref

  const numSelected = selectedRowKeys.length;
  const rowCount = products.length;
  const isIndeterminate = numSelected > 0 && numSelected < rowCount;

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.dataset.state = isIndeterminate ? 'indeterminate' : (numSelected === rowCount && rowCount > 0 ? 'checked' : 'unchecked');
    }
  }, [isIndeterminate, numSelected, rowCount]);

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b-0">
            <TableHead className="w-12 pl-6">
                <Checkbox
                    ref={headerCheckboxRef} // Pasang ref di sini
                    checked={numSelected === rowCount && rowCount > 0}
                    onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                />
            </TableHead>
          <TableHead className="w-[80px]">Gambar</TableHead>
          <TableHead>Nama Produk</TableHead>
          <TableHead>Kategori</TableHead>
          <TableHead>Deskripsi</TableHead>
          {variant === 'trashed' && <TableHead>Dihapus Pada</TableHead>}
          <TableHead className="text-right pr-6">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.length > 0 ? (
          products.map((product) => (
            <motion.tr key={product.id} variants={itemVariants} layout className="hover:bg-muted/50 data-[state=selected]:bg-muted/50">
              <TableCell className="pl-6 py-2">
                <Checkbox
                    checked={selectedRowKeys.includes(product.id)}
                    onCheckedChange={(checked) => handleRowSelect(product.id, Boolean(checked))}
                />
              </TableCell>
              <TableCell className="py-2">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={64}
                  height={64}
                  className="rounded-md object-cover aspect-square"
                />
              </TableCell>
              <TableCell className="font-semibold py-2">{product.name}</TableCell>
              <TableCell className="py-2">
                <Badge variant="outline">{product.category?.name || 'N/A'}</Badge>
              </TableCell>
              <TableCell className="max-w-xs truncate text-muted-foreground py-2">{product.description}</TableCell>
               {variant === 'trashed' && (
                <TableCell className="text-muted-foreground py-2">
                    {product.deletedAt ? new Date(product.deletedAt).toLocaleDateString('id-ID') : '-'}
                </TableCell>
              )}
              <TableCell className="text-right pr-6 py-2">
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
            <TableCell colSpan={variant === 'active' ? 7 : 8} className="h-24 text-center text-muted-foreground">
              {isLoading ? 'Memuat...' : (variant === 'active' ? 'Belum ada produk.' : 'Tidak ada produk di sampah.')}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
