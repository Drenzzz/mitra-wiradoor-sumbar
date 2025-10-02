'use client';

import { motion } from 'framer-motion';
import { ArticleCategory } from '@/types';
import { MoreHorizontal, Trash2, Undo, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const itemVariants: any = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

interface ArticleCategoryTableProps {
  variant: 'active' | 'trashed';
  categories: ArticleCategory[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onEditClick: (category: ArticleCategory) => void;
  selectedRowKeys: string[];
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<string[]>>;
  searchTerm: string;
}

export function ArticleCategoryTable({ variant, categories, isLoading, error, onRefresh, onEditClick }: ArticleCategoryTableProps) {
  
  const handleAction = async (promise: Promise<Response>, messages: { loading: string; success: string; error: string; }) => {
    toast.promise(promise, {
        loading: messages.loading,
        success: () => { onRefresh(); return messages.success; },
        error: (err: any) => err.message || messages.error,
    });
  };

  const handleSoftDelete = (categoryId: string) => {
    handleAction(fetch(`/api/article-categories/${categoryId}`, { method: 'DELETE' }), { loading: 'Memindahkan...', success: 'Kategori dipindahkan ke sampah.', error: 'Gagal memindahkan.' });
  };

  const handleRestore = (categoryId: string) => {
    handleAction(fetch(`/api/article-categories/${categoryId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'restore' }) }), { loading: 'Memulihkan...', success: 'Kategori dipulihkan.', error: 'Gagal memulihkan.' });
  };

  const handlePermanentDelete = (categoryId: string) => {
    if (!window.confirm('Anda yakin? Aksi ini tidak dapat dibatalkan.')) return;
    handleAction(fetch(`/api/article-categories/${categoryId}?force=true`, { method: 'DELETE' }), { loading: 'Menghapus permanen...', success: 'Kategori dihapus permanen.', error: 'Gagal menghapus.' });
  };

  if (isLoading) return <div className="text-center p-8">Memuat...</div>;
  if (error) return <div className="text-center p-8 text-destructive">Error: {error}</div>;

  return (
    <Table>
      <TableHeader><TableRow><TableHead>Nama Kategori</TableHead><TableHead>Deskripsi</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
      <TableBody>
        {categories.length > 0 ? (
          categories.map((category) => (
            <motion.tr key={category.id} variants={itemVariants} layout>
              <TableCell className="font-semibold">{category.name}</TableCell>
              <TableCell>{category.description || '–'}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4 ml-2" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                    {variant === 'active' ? (
                      <><DropdownMenuItem onSelect={() => onEditClick(category)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem><DropdownMenuItem className="text-red-500" onSelect={() => handleSoftDelete(category.id)}><Trash2 className="mr-2 h-4 w-4" />Hapus</DropdownMenuItem></>
                    ) : (
                      <><DropdownMenuItem onSelect={() => handleRestore(category.id)}><Undo className="mr-2 h-4 w-4" />Pulihkan</DropdownMenuItem><DropdownMenuItem className="text-red-500" onSelect={() => handlePermanentDelete(category.id)}><Trash2 className="mr-2 h-4 w-4" />Hapus Permanen</DropdownMenuItem></>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </motion.tr>
          ))
        ) : (
          <TableRow><TableCell colSpan={3} className="h-24 text-center">Belum ada kategori.</TableCell></TableRow>
        )}
      </TableBody>
    </Table>
  );
}
