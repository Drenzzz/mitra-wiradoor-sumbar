"use client";

import { Order } from "@/types";
import { OrderStatus } from "@prisma/client";
import { motion } from "framer-motion";
import { MoreHorizontal, Eye, CheckCircle, XCircle, Truck, PackageCheck, Banknote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const formatDate = (dateString: Date) =>
  new Date(dateString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatCurrency = (amount: number | null) => {
  if (amount === null || amount === undefined) return "-";
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
};

const statusVariantMap: Record<OrderStatus, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "outline",
  PROCESSED: "default",
  SHIPPED: "secondary",
  COMPLETED: "default",
  CANCELLED: "destructive",
};

const statusLabelMap: Record<OrderStatus, string> = {
  PENDING: "Menunggu",
  PROCESSED: "Diproses",
  SHIPPED: "Dikirim",
  COMPLETED: "Selesai",
  CANCELLED: "Batal",
};

interface OrderTableProps {
  orders: Order[];
  isLoading: boolean;
  onViewClick: (order: Order) => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
  onProcessClick: (order: Order) => void;
}

export function OrderTable({ orders, isLoading, onViewClick, onStatusChange, onProcessClick }: OrderTableProps) {
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
          <TableHead>Item</TableHead>
          <TableHead>Harga Deal</TableHead>
          <TableHead className="w-[100px]">Status</TableHead>
          <TableHead className="w-[120px]">Tanggal</TableHead>
          <TableHead className="text-right w-[80px]">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <motion.tr key={order.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-muted/50">
            <TableCell className="font-medium">{order.invoiceNumber}</TableCell>

            <TableCell>
              <div className="font-medium">{order.customerName}</div>
              <div className="text-xs text-muted-foreground">{order.customerPhone}</div>
            </TableCell>

            <TableCell className="text-sm text-muted-foreground">
              {order.items?.[0]?.productName || "N/A"}
              {order.items?.length > 1 && ` (+${order.items.length - 1})`}
            </TableCell>

            <TableCell className="text-sm font-medium">{formatCurrency(order.dealPrice)}</TableCell>

            <TableCell>
              <Badge
                variant={statusVariantMap[order.status]}
                className={cn(
                  order.status === "PENDING" && "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
                  order.status === "PROCESSED" && "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
                  order.status === "SHIPPED" && "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200",
                  order.status === "COMPLETED" && "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                )}
              >
                {statusLabelMap[order.status]}
              </Badge>
            </TableCell>

            <TableCell className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</TableCell>

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

                  {order.status === "PENDING" && (
                    <DropdownMenuItem onSelect={() => onProcessClick(order)}>
                      <Banknote className="mr-2 h-4 w-4 text-blue-600" />
                      Proses Pesanan
                    </DropdownMenuItem>
                  )}

                  {order.status === "PROCESSED" && (
                    <DropdownMenuItem onSelect={() => onStatusChange(order.id, "SHIPPED")}>
                      <Truck className="mr-2 h-4 w-4 text-purple-600" />
                      Kirim Pesanan
                    </DropdownMenuItem>
                  )}

                  {order.status === "SHIPPED" && (
                    <DropdownMenuItem onSelect={() => onStatusChange(order.id, "COMPLETED")}>
                      <PackageCheck className="mr-2 h-4 w-4 text-green-600" />
                      Selesaikan Pesanan
                    </DropdownMenuItem>
                  )}

                  {(order.status === "PENDING" || order.status === "PROCESSED") && (
                    <DropdownMenuItem className="text-red-500 focus:text-red-500" onSelect={() => onStatusChange(order.id, "CANCELLED")}>
                      <XCircle className="mr-2 h-4 w-4" />
                      Batalkan Pesanan
                    </DropdownMenuItem>
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
