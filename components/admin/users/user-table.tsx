'use client';

import { ClientUser } from '@/types';
import { Role } from '@prisma/client';
import { motion } from 'framer-motion';
import { MoreHorizontal, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

const formatDate = (dateString: Date | null) => 
  dateString ? new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

interface UserTableProps {
  users: ClientUser[];
  isLoading: boolean;
  onEditClick: (user: ClientUser) => void;
  onDeleteClick: (user: ClientUser) => void;
}

export function UserTable({ 
  users, 
  isLoading, 
  onEditClick,
  onDeleteClick 
}: UserTableProps) {
  
  if (isLoading) {
    return <div className="text-center p-8 text-muted-foreground">Memuat data pengguna...</div>;
  }
  
  if (users.length === 0) {
    return <div className="text-center p-8 text-muted-foreground">Tidak ada pengguna STAF yang ditemukan.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Email Terverifikasi</TableHead>
          <TableHead className="text-right w-[80px]">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <motion.tr 
            key={user.id} 
            layout 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="hover:bg-muted/50"
          >
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell className="text-muted-foreground">{user.email}</TableCell>
            <TableCell>
              <Badge variant={user.role === 'ADMIN' ? 'destructive' : 'secondary'}>
                {user.role}
              </Badge>
            </TableCell>
            <TableCell className={cn("text-sm", user.emailVerified ? "text-green-600" : "text-muted-foreground")}>
              <div className="flex items-center gap-2">
                {user.emailVerified ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                {formatDate(user.emailVerified)}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                  <DropdownMenuItem onSelect={() => onEditClick(user)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Pengguna
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-500"
                    onSelect={() => onDeleteClick(user)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus Pengguna
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </motion.tr>
        ))}
      </TableBody>
    </Table>
  );
}
