// components/admin/products/product-table.tsx
'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import { MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  products: Product[];
  isLoading: boolean;
  error: string | null;
  onEditClick: (product: Product) => void;
  onViewClick: (product: Product) => void;
}

export function ProductTable({ products, isLoading, error, onEditClick, onViewClick }: ProductTableProps) {
  if (isLoading) return <div className="text-center p-8 text-muted-foreground">Memuat data produk...</div>;
  if (error) return <div className="text-center p-8 text-destructive">Error: {error}</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12"><Checkbox /></TableHead>
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
              <TableCell><Checkbox /></TableCell>
              <TableCell>
                {/* <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={64}
                  height={64}
                  className="rounded-md object-cover"
                /> */}
              </TableCell>
              <TableCell className="font-semibold">{product.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{product.category?.name || 'N/A'}</Badge>
              </TableCell>
              <TableCell className="max-w-xs truncate text-muted-foreground">
                {product.description}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* ✅ Tombol Lihat Detail */}
                    <DropdownMenuItem onSelect={() => onViewClick(product)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Lihat Detail
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onEditClick(product)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </motion.tr>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
              Belum ada produk. Silakan tambahkan produk baru.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
