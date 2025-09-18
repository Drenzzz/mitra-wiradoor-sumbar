'use client';

import { Category } from '@/types';
import { MoreHorizontal, Trash2, Undo } from 'lucide-react';
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

interface CategoryTableProps {
  variant: 'active' | 'trashed';
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function CategoryTable({
  variant,
  categories,
  isLoading,
  error,
  onRefresh,
}: CategoryTableProps) {
  
  // Fungsi untuk melakukan soft delete
  const handleSoftDelete = (categoryId: string) => {
    toast.promise(
      fetch(`/api/categories/${categoryId}`, { method: 'DELETE' }),
      {
        loading: 'Memindahkan ke sampah...',
        success: () => {
          onRefresh(); // Panggil onRefresh untuk memuat ulang data
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
    return <div>Memuat data...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Kategori</TableHead>
            <TableHead>Deskripsi</TableHead>
            {variant === 'trashed' && <TableHead>Dihapus Pada</TableHead>}
            <TableHead>
              <span className="sr-only">Aksi</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length > 0 ? (
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.description || '-'}</TableCell>
                {variant === 'trashed' && (
                   <TableCell>
                    {category.deletedAt ? new Date(category.deletedAt).toLocaleDateString('id-ID') : '-'}
                  </TableCell>
                )}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {variant === 'active' ? (
                        <>
                          <DropdownMenuItem>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
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
                            className="text-red-600"
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
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={variant === 'active' ? 3 : 4} className="h-24 text-center">
                {variant === 'active' ? 'Belum ada kategori.' : 'Tidak ada kategori di sampah.'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
