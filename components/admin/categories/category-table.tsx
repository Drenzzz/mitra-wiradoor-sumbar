'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Category } from '@/types';
import { MoreHorizontal, Trash2, Undo, Pencil } from 'lucide-react';
import { toast } from 'sonner';
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

const itemVariants: any = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

interface CategoryTableProps {
  variant: 'active' | 'trashed';
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  onRefresh: () => void;
  onEditClick: (category: Category) => void;
  selectedRowKeys: string[];
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<string[]>>;
  onDeleteClick: (category: Category) => void;
  onRestoreClick: (category: Category) => void;
  onForceDeleteClick: (category: Category) => void;
}

export function CategoryTable({
  variant,
  categories,
  isLoading,
  error,
  searchTerm,
  onRefresh,
  onEditClick,
  selectedRowKeys,
  setSelectedRowKeys,
  onDeleteClick,
  onRestoreClick,
  onForceDeleteClick,

}: CategoryTableProps) {
  
  const handleSelectAll = (checked: boolean) => {
    setSelectedRowKeys(checked ? categories.map(cat => cat.id) : []);
  };

  const handleRowSelect = (id: string, checked: boolean) => {
    setSelectedRowKeys(prev => checked ? [...prev, id] : prev.filter(key => key !== id));
  };

  if (isLoading) {
    return <div className="text-center p-8 text-muted-foreground">Memuat data...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-destructive">Error: {error}</div>;
  }

  const headerCheckboxRef = useRef<HTMLButtonElement>(null); // Buat ref untuk checkbox header

  const numSelected = selectedRowKeys.length;
  const rowCount = categories.length;
  const isIndeterminate = numSelected > 0 && numSelected < rowCount;

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.dataset.state = isIndeterminate ? 'indeterminate' : (numSelected === rowCount && rowCount > 0 ? 'checked' : 'unchecked');
    }
  }, [isIndeterminate, numSelected, rowCount]);

  return (
      <Table>
        <TableHeader>
          {/* PERUBAHAN: Style header diubah agar lebih profesional */}
          <TableRow className="border-b-0">
            <TableHead className="w-12">
              <Checkbox
                ref={headerCheckboxRef} // Pasang ref di sini
                checked={numSelected === rowCount && rowCount > 0}
                onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
              />
            </TableHead>
            <TableHead className="w-[40%] text-xs uppercase tracking-wider text-muted-foreground">Nama Kategori</TableHead>
            <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Deskripsi</TableHead>
            {variant === 'trashed' && <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Dihapus Pada</TableHead>}
            <TableHead className="text-right text-xs uppercase tracking-wider text-muted-foreground">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length > 0 ? (
            categories.map((category) => (
              <motion.tr
                key={category.id}
                variants={itemVariants}
                layout
                className="hover:bg-muted/50"
              >
                <TableCell className="py-4">
                   <Checkbox
                    checked={selectedRowKeys.includes(category.id)}
                    onCheckedChange={(checked) => handleRowSelect(category.id, Boolean(checked))}
                  />
                </TableCell>
                <TableCell className="font-semibold text-foreground py-4">{category.name}</TableCell>
                <TableCell className="text-muted-foreground py-4">{category.description || '–'}</TableCell>
                {variant === 'trashed' && (
                   <TableCell className="text-muted-foreground py-4">
                    {category.deletedAt ? new Date(category.deletedAt).toLocaleDateString('id-ID') : '–'}
                  </TableCell>
                )}
                <TableCell className="text-right py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-background/80 backdrop-blur-sm">
                      <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {variant === 'active' ? (
                        <>
                          <DropdownMenuItem onSelect={() => onEditClick(category)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600 focus:bg-red-500/10"
                            onSelect={() => onDeleteClick(category)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          <DropdownMenuItem onSelect={() => onRestoreClick(category)}>
                            <Undo className="mr-2 h-4 w-4" />
                            Pulihkan
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600 focus:bg-red-500/10"
                            onSelect={() => onForceDeleteClick(category)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus Permanen
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={variant === 'active' ? 3 : 4} className="h-24 text-center text-muted-foreground">
                {searchTerm ? `Tidak ditemukan kategori dengan nama "${searchTerm}".` : 
                 (variant === 'active' ? 'Belum ada kategori.' : 'Tidak ada kategori di sampah.')
                }
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
  );
}
