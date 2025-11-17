'use client';

import { Order } from '@/types';
import { OrderStatus } from '@prisma/client';
import { motion } from 'framer-motion';
import { MoreHorizontal, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
import { cn } from '@/lib/utils';

const formatDate = (dateString: Date) => 
  new Date(dateString).toLocaleDateString('id-ID', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });

const statusVariantMap: Record<OrderStatus, "default" | "secondary" | "destructive"> = {
  PENDING: "default",
  COMPLETED: "secondary",
  CANCELLED: "destructive",
};

interface OrderTableProps {
  orders: Order[];
  isLoading: boolean;
  onViewClick: (order: Order) => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
}

export function OrderTable({ 
  orders, 
  isLoading, 
  onViewClick,
  onStatusChange 
}: OrderTableProps) {
  
  if (isLoading) {
    return <div className="text-center p-8 text-muted-foreground">Memuat data pesanan...</div>;
  }
  
  if (orders.length === 0) {
    return <div className="text-center p-8 text-muted-foreground">Tidak ada pesanan yang cocok dengan filter ini.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[120px]">Invoice</TableHead>
          <TableHead>Pelanggan</TableHead>
          <TableHead>Ringkasan Produk</TableHead>
          <TableHead className="w-[100px]">Status</TableHead>
          <TableHead className="w-[150px]">Tanggal Pesan</TableHead>
          <TableHead className="text-right w-[80px]">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <motion.tr 
            key={order.id} 
            layout 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="hover:bg-muted/50"
          >
            <TableCell className="font-medium">{order.invoiceNumber}</TableCell>
            
            <TableCell>
              <div className="font-medium">{order.customerName}</div>
              <div className="text-xs text-muted-foreground">{order.customerPhone}</div>
            </TableCell>

            <TableCell className="text-sm text-muted-foreground">
              {order.items[0]?.productName || 'N/A'}
              {order.items.length > 1 && ` (+${order.items.length - 1} lainnya)`}
            </TableCell>

            <TableCell>
              <Badge 
                variant={statusVariantMap[order.status]}
                className={cn(order.status === 'PENDING' && 'animate-pulse')}
              >
                {order.status}
              </Badge>
            </TableCell>

            <TableCell className="text-sm text-muted-foreground">
              {formatDate(order.createdAt)}
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
                  <DropdownMenuItem onSelect={() => onViewClick(order)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Lihat Detail
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    disabled={order.status === 'COMPLETED'}
                    onSelect={() => onStatusChange(order.id, 'COMPLETED')}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Tandai Selesai
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-500"
                    disabled={order.status === 'CANCELLED'}
                    onSelect={() => onStatusChange(order.id, 'CANCELLED')}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Batalkan Pesanan
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
