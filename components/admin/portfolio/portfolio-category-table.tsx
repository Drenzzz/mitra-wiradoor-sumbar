'use client';

import { PortfolioCategory } from '@/types';
import { motion } from 'framer-motion';
import { MoreHorizontal, Pencil, Trash2, Undo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface PortfolioCategoryTableProps {
  variant: 'active' | 'trashed';
  categories: PortfolioCategory[];
  isLoading: boolean;
  onEditClick: (category: PortfolioCategory) => void;
  onDeleteClick: (category: PortfolioCategory) => void;
  onRestoreClick: (category: PortfolioCategory) => void;
  onForceDeleteClick: (category: PortfolioCategory) => void;
}

export function PortfolioCategoryTable({ 
  variant,
  categories, 
  isLoading, 
  onEditClick, 
  onDeleteClick,
  onRestoreClick,
  onForceDeleteClick
}: PortfolioCategoryTableProps) {
  
  if (isLoading) return <div className="text-center p-8 text-muted-foreground">Memuat kategori...</div>;
  if (categories.length === 0) return <div className="text-center p-8 text-muted-foreground">{variant === 'active' ? 'Belum ada kategori.' : 'Sampah kosong.'}</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama Kategori</TableHead>
          <TableHead>Deskripsi</TableHead>
          {variant === 'trashed' && <TableHead>Dihapus Pada</TableHead>}
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((cat) => (
          <motion.tr 
            key={cat.id} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="hover:bg-muted/50"
          >
            <TableCell className="font-medium">{cat.name}</TableCell>
            <TableCell>{cat.description || '-'}</TableCell>
            {variant === 'trashed' && (
              <TableCell className="text-muted-foreground text-sm">
                {cat.deletedAt ? new Date(cat.deletedAt).toLocaleDateString('id-ID') : '-'}
              </TableCell>
            )}
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                  {variant === 'active' ? (
                    <>
                      <DropdownMenuItem onSelect={() => onEditClick(cat)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500" onSelect={() => onDeleteClick(cat)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Hapus
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onSelect={() => onRestoreClick(cat)}>
                        <Undo className="mr-2 h-4 w-4" /> Pulihkan
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500" onSelect={() => onForceDeleteClick(cat)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Hapus Permanen
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </motion.tr>
        ))}
      </TableBody>
    </Table>
  );
}
