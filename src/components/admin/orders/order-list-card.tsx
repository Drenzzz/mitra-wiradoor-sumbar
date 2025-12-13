"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/admin/date-range-picker";
import { OrderTable } from "@/components/admin/orders/order-table";
import type { Order } from "@/types";
import type { OrderStatus } from "@/db/schema";
import type { DateRange } from "react-day-picker";

interface OrderListCardProps {
  status: OrderStatus;
  orders: Order[];
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  selectedRowKeys: string[];
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<string[]>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  rowsPerPage: number;
  totalCount: number;
  isProcessLoading: boolean;
  onViewClick: (order: Order) => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
  onProcessClick: (order: Order) => void;
  onBulkAction: (action: "updateStatus" | "delete", targetStatus?: OrderStatus) => void;
}

const STATUS_CONFIG = {
  PENDING: {
    title: "Pesanan Baru",
    description: "Menunggu konfirmasi harga dan proses dari Admin.",
  },
  PROCESSED: {
    title: "Pesanan Diproses",
    description: "Harga sudah disepakati, barang sedang disiapkan.",
  },
  SHIPPED: {
    title: "Dalam Pengiriman",
    description: "Barang sedang dalam perjalanan ke pelanggan.",
  },
  COMPLETED: {
    title: "Pesanan Selesai",
    description: "Transaksi selesai dan sukses.",
  },
  CANCELLED: {
    title: "Pesanan Dibatalkan",
    description: "Riwayat pesanan yang tidak jadi atau dibatalkan.",
  },
};

export function OrderListCard({
  status,
  orders,
  isLoading,
  searchTerm,
  setSearchTerm,
  dateRange,
  setDateRange,
  sortBy,
  setSortBy,
  selectedRowKeys,
  setSelectedRowKeys,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  totalCount,
  isProcessLoading,
  onViewClick,
  onStatusChange,
  onProcessClick,
  onBulkAction,
}: OrderListCardProps) {
  const totalPages = Math.ceil(totalCount / rowsPerPage);
  const config = STATUS_CONFIG[status];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{config.title}</CardTitle>
        <CardDescription>{config.description}</CardDescription>
        <div className="flex flex-col md:flex-row items-center gap-2 pt-4">
          <Input placeholder="Cari nama, email, atau invoice..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full" />
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Urutkan berdasarkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-desc">Terbaru</SelectItem>
              <SelectItem value="createdAt-asc">Terlama</SelectItem>
              <SelectItem value="customerName-asc">Nama (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {selectedRowKeys.length > 0 && (
          <div className="flex items-center gap-2 pt-2 animate-in fade-in slide-in-from-top-2">
            <span className="text-sm text-muted-foreground">{selectedRowKeys.length} dipilih</span>
            <div className="h-4 w-px bg-border mx-2" />
            {status === "PENDING" && (
              <Button size="sm" variant="outline" onClick={() => onBulkAction("updateStatus", "CANCELLED")} disabled={isProcessLoading}>
                Batalkan Terpilih
              </Button>
            )}
            {status === "PROCESSED" && (
              <Button size="sm" variant="default" onClick={() => onBulkAction("updateStatus", "SHIPPED")} disabled={isProcessLoading}>
                Kirim Terpilih
              </Button>
            )}
            {status === "SHIPPED" && (
              <Button size="sm" variant="default" onClick={() => onBulkAction("updateStatus", "COMPLETED")} disabled={isProcessLoading}>
                Selesaikan Terpilih
              </Button>
            )}
            <Button size="sm" variant="destructive" onClick={() => onBulkAction("delete")} disabled={isProcessLoading}>
              Hapus Terpilih
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <OrderTable orders={orders} isLoading={isLoading} onViewClick={onViewClick} onStatusChange={onStatusChange} onProcessClick={onProcessClick} selectedRowKeys={selectedRowKeys} setSelectedRowKeys={setSelectedRowKeys} />
      </CardContent>
      {totalPages > 1 && (
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong>
          </div>
          <div className="flex items-center space-x-2 ml-auto">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage <= 1 || isLoading}>
              Sebelumnya
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage >= totalPages || isLoading}>
              Selanjutnya
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
