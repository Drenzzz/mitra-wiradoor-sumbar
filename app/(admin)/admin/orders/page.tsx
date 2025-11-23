"use client";

import { useState } from "react";
import { PageWrapper } from "@/components/admin/page-wrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { OrderStatus } from "@prisma/client";
import { toast } from "sonner";

import { useOrderManagement } from "@/hooks/use-order-management";
import { OrderTable } from "@/components/admin/orders/order-table";
import { OrderDetailDialog } from "@/components/admin/orders/order-detail-dialog";
import { ProcessOrderDialog } from "@/components/admin/orders/process-order-dialog";
import type { Order, OrderDetail } from "@/types";

export default function OrderManagementPage() {
  const { orders, totalCount, isLoading, activeTab, setActiveTab, searchTerm, setSearchTerm, sortBy, setSortBy, currentPage, setCurrentPage, rowsPerPage, fetchOrders } = useOrderManagement();

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [selectedOrderToProcess, setSelectedOrderToProcess] = useState<Order | null>(null);

  const [isDialogLoading, setIsDialogLoading] = useState(false);
  const [isProcessLoading, setIsProcessLoading] = useState(false);

  const handleViewClick = async (order: Order) => {
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
  };

  const handleProcessClick = (order: Order) => {
    setSelectedOrderToProcess(order);
    setIsProcessDialogOpen(true);
  };

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

  const handleStatusChange = async (id: string, status: OrderStatus) => {
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
  };

  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const OrderListCard = ({ status }: { status: OrderStatus }) => {
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
        </CardHeader>
        <CardContent>
          <OrderTable orders={orders} isLoading={isLoading} onViewClick={handleViewClick} onStatusChange={handleStatusChange} onProcessClick={handleProcessClick} />
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
          <TabsTrigger value={OrderStatus.PENDING}>Baru</TabsTrigger>
          <TabsTrigger value={OrderStatus.PROCESSED}>Diproses</TabsTrigger>
          <TabsTrigger value={OrderStatus.SHIPPED}>Dikirim</TabsTrigger>
          <TabsTrigger value={OrderStatus.COMPLETED}>Selesai</TabsTrigger>
          <TabsTrigger value={OrderStatus.CANCELLED}>Batal</TabsTrigger>
        </TabsList>

        <TabsContent value={OrderStatus.PENDING} className="mt-4">
          <OrderListCard status={OrderStatus.PENDING} />
        </TabsContent>
        <TabsContent value={OrderStatus.PROCESSED} className="mt-4">
          <OrderListCard status={OrderStatus.PROCESSED} />
        </TabsContent>
        <TabsContent value={OrderStatus.SHIPPED} className="mt-4">
          <OrderListCard status={OrderStatus.SHIPPED} />
        </TabsContent>
        <TabsContent value={OrderStatus.COMPLETED} className="mt-4">
          <OrderListCard status={OrderStatus.COMPLETED} />
        </TabsContent>
        <TabsContent value={OrderStatus.CANCELLED} className="mt-4">
          <OrderListCard status={OrderStatus.CANCELLED} />
        </TabsContent>
      </Tabs>

      <OrderDetailDialog isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} order={selectedOrder} isLoading={isDialogLoading} />

      <ProcessOrderDialog isOpen={isProcessDialogOpen} onClose={() => setIsProcessDialogOpen(false)} onConfirm={confirmProcessOrder} order={selectedOrderToProcess} isLoading={isProcessLoading} />
    </PageWrapper>
  );
}
