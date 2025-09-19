'use client';

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


const itemVariants = {
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

}: CategoryTableProps) {
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowKeys(categories.map(cat => cat.id));
    } else {
      setSelectedRowKeys([]);
    }
  };

  const handleRowSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRowKeys(prev => [...prev, id]);
    } else {
      setSelectedRowKeys(prev => prev.filter(key => key !== id));
    }
  };

  const handleSoftDelete = (categoryId: string) => {
    toast.promise(
      fetch(`/api/categories/${categoryId}`, { method: 'DELETE' }),
      {
        loading: 'Memindahkan ke sampah...',
        success: () => {
          onRefresh();
          return 'Kategori berhasil dipindahkan ke sampah.';
        },
        error: (err) => err.message || 'Gagal memindahkan kategori.',
      }
    );
  };

  const handleRestore = (categoryId: string) => {
    toast.promise(
      fetch(`/api/categories/${categoryId}/restore`, { method: 'PATCH' }),
      {
        loading: 'Memulihkan kategori...',
        success: () => {
          onRefresh();
          return 'Kategori berhasil dipulihkan.';
        },
        error: (err) => err.message || 'Gagal memulihkan kategori.',
      }
    );
  };
  
  const handlePermanentDelete = (categoryId: string) => {
     toast.promise(
      fetch(`/api/categories/${categoryId}/force`, { method: 'DELETE' }),
      {
        loading: 'Menghapus permanen...',
        success: () => {
          onRefresh();
          return 'Kategori berhasil dihapus permanen.';
        },
        error: (err) => err.message || 'Gagal menghapus kategori.',
      }
    );
  };

  if (isLoading) {
    return <div className="text-center p-8 text-muted-foreground">Memuat data...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-destructive">Error: {error}</div>;
  }

  const numSelected = selectedRowKeys.length;
  const rowCount = categories.length;

  return (
      <Table>
        <TableHeader>
          {/* PERUBAHAN: Style header diubah agar lebih profesional */}
          <TableRow className="border-b-0">
            <TableHead className="w-12">
              <Checkbox
                checked={numSelected === rowCount && rowCount > 0}
                indeterminate={numSelected > 0 && numSelected < rowCount}
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
                    {/* PERUBAHAN: Efek glassmorphism/blur ditambahkan di sini */}
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
                            onSelect={() => handleSoftDelete(category.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          <DropdownMenuItem onSelect={() => handleRestore(category.id)}>
                             <Undo className="mr-2 h-4 w-4" />
                            Pulihkan
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600 focus:bg-red-500/10"
                            onSelect={() => handlePermanentDelete(category.id)}
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
