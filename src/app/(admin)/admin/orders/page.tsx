"use client";

import { useState, useCallback } from "react";
import { PageWrapper } from "@/components/admin/page-wrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { OrderStatus } from "@/db/schema";
import { toast } from "sonner";

import { useOrderManagement } from "@/hooks/use-order-management";
import { OrderTable } from "@/components/admin/orders/order-table";
import { OrderDetailDialog } from "@/components/admin/orders/order-detail-dialog";
import { ProcessOrderDialog } from "@/components/admin/orders/process-order-dialog";
import { DatePickerWithRange } from "@/components/admin/date-range-picker";
import type { Order, OrderDetail } from "@/types";

export default function OrderManagementPage() {
  const {
    orders,
    totalCount,
    isLoading,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    fetchOrders,
    dateRange,
    setDateRange,
    selectedRowKeys,
    setSelectedRowKeys,
    handleBulkAction,
  } = useOrderManagement();

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [selectedOrderToProcess, setSelectedOrderToProcess] = useState<Order | null>(null);

  const [isDialogLoading, setIsDialogLoading] = useState(false);
  const [isProcessLoading, setIsProcessLoading] = useState(false);

  const handleViewClick = useCallback(async (order: Order) => {
    setIsDialogLoading(true);
    setIsDetailOpen(true);
    setSelectedOrder(null);

    try {
      const response = await fetch(`/api/orders/${order.id}`);
      if (!response.ok) {
        throw new Error("Gagal memuat detail pesanan.");
      }
      const detailedOrderData = await response.json();
      setSelectedOrder(detailedOrderData);
    } catch (error: any) {
      toast.error(error.message);
      setIsDetailOpen(false);
    } finally {
      setIsDialogLoading(false);
    }
  }, []);

  const handleProcessClick = useCallback((order: Order) => {
    setSelectedOrderToProcess(order);
    setIsProcessDialogOpen(true);
  }, []);

  const confirmProcessOrder = async (dealPrice: number) => {
    if (!selectedOrderToProcess) return;

    setIsProcessLoading(true);
    try {
      const response = await fetch(`/api/orders/${selectedOrderToProcess.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "PROCESSED",
          dealPrice: dealPrice,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Gagal memproses pesanan");
      }

      toast.success("Pesanan berhasil diproses dengan harga kesepakatan!");
      fetchOrders();
      setIsProcessDialogOpen(false);
      setSelectedOrderToProcess(null);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsProcessLoading(false);
    }
  };

  const handleStatusChange = useCallback(
    async (id: string, status: OrderStatus) => {
      toast.promise(
        fetch(`/api/orders/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }).then(async (res) => {
          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Gagal mengubah status");
          }
          return res.json();
        }),
        {
          loading: "Memperbarui status...",
          success: () => {
            fetchOrders();
            return "Status pesanan berhasil diperbarui!";
          },
          error: (err) => err.message,
        }
      );
    },
    [fetchOrders]
  );

  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const renderOrderListCard = (status: OrderStatus) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {status === "PENDING" && "Pesanan Baru"}
            {status === "PROCESSED" && "Pesanan Diproses"}
            {status === "SHIPPED" && "Dalam Pengiriman"}
            {status === "COMPLETED" && "Pesanan Selesai"}
            {status === "CANCELLED" && "Pesanan Dibatalkan"}
          </CardTitle>
          <CardDescription>
            {status === "PENDING" && "Menunggu konfirmasi harga dan proses dari Admin."}
            {status === "PROCESSED" && "Harga sudah disepakati, barang sedang disiapkan."}
            {status === "SHIPPED" && "Barang sedang dalam perjalanan ke pelanggan."}
            {status === "COMPLETED" && "Transaksi selesai dan sukses."}
            {status === "CANCELLED" && "Riwayat pesanan yang tidak jadi atau dibatalkan."}
          </CardDescription>
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
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("updateStatus", "CANCELLED")} disabled={isProcessLoading}>
                  Batalkan Terpilih
                </Button>
              )}
              {status === "PROCESSED" && (
                <Button size="sm" variant="default" onClick={() => handleBulkAction("updateStatus", "SHIPPED")} disabled={isProcessLoading}>
                  Kirim Terpilih
                </Button>
              )}
              {status === "SHIPPED" && (
                <Button size="sm" variant="default" onClick={() => handleBulkAction("updateStatus", "COMPLETED")} disabled={isProcessLoading}>
                  Selesaikan Terpilih
                </Button>
              )}
              <Button size="sm" variant="destructive" onClick={() => handleBulkAction("delete")} disabled={isProcessLoading}>
                Hapus Terpilih
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <OrderTable orders={orders} isLoading={isLoading} onViewClick={handleViewClick} onStatusChange={handleStatusChange} onProcessClick={handleProcessClick} selectedRowKeys={selectedRowKeys} setSelectedRowKeys={setSelectedRowKeys} />
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
  };

  return (
    <PageWrapper>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Pesanan</h1>
          <p className="text-muted-foreground">Kelola siklus hidup pesanan dari masuk hingga selesai.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as OrderStatus)} className="mt-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
          <TabsTrigger value="PENDING">Baru</TabsTrigger>
          <TabsTrigger value="PROCESSED">Diproses</TabsTrigger>
          <TabsTrigger value="SHIPPED">Dikirim</TabsTrigger>
          <TabsTrigger value="COMPLETED">Selesai</TabsTrigger>
          <TabsTrigger value="CANCELLED">Batal</TabsTrigger>
        </TabsList>

        <TabsContent value="PENDING" className="mt-4">
          {renderOrderListCard("PENDING")}
        </TabsContent>
        <TabsContent value="PROCESSED" className="mt-4">
          {renderOrderListCard("PROCESSED")}
        </TabsContent>
        <TabsContent value="SHIPPED" className="mt-4">
          {renderOrderListCard("SHIPPED")}
        </TabsContent>
        <TabsContent value="COMPLETED" className="mt-4">
          {renderOrderListCard("COMPLETED")}
        </TabsContent>
        <TabsContent value="CANCELLED" className="mt-4">
          {renderOrderListCard("CANCELLED")}
        </TabsContent>
      </Tabs>

      <OrderDetailDialog isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} order={selectedOrder} isLoading={isDialogLoading} />

      <ProcessOrderDialog isOpen={isProcessDialogOpen} onClose={() => setIsProcessDialogOpen(false)} onConfirm={confirmProcessOrder} order={selectedOrderToProcess} isLoading={isProcessLoading} />
    </PageWrapper>
  );
}
