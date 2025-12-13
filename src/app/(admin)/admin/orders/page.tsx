"use client";

import { useState, useCallback } from "react";
import { PageWrapper } from "@/components/admin/page-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { OrderStatus } from "@/db/schema";
import { toast } from "sonner";

import { useOrderManagement } from "@/hooks/use-order-management";
import { OrderDetailDialog } from "@/components/admin/orders/order-detail-dialog";
import { ProcessOrderDialog } from "@/components/admin/orders/process-order-dialog";
import { OrderListCard } from "@/components/admin/orders/order-list-card";
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

  const commonProps = {
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
    onViewClick: handleViewClick,
    onStatusChange: handleStatusChange,
    onProcessClick: handleProcessClick,
    onBulkAction: handleBulkAction,
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
          <OrderListCard status="PENDING" {...commonProps} />
        </TabsContent>
        <TabsContent value="PROCESSED" className="mt-4">
          <OrderListCard status="PROCESSED" {...commonProps} />
        </TabsContent>
        <TabsContent value="SHIPPED" className="mt-4">
          <OrderListCard status="SHIPPED" {...commonProps} />
        </TabsContent>
        <TabsContent value="COMPLETED" className="mt-4">
          <OrderListCard status="COMPLETED" {...commonProps} />
        </TabsContent>
        <TabsContent value="CANCELLED" className="mt-4">
          <OrderListCard status="CANCELLED" {...commonProps} />
        </TabsContent>
      </Tabs>

      <OrderDetailDialog isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} order={selectedOrder} isLoading={isDialogLoading} />

      <ProcessOrderDialog isOpen={isProcessDialogOpen} onClose={() => setIsProcessDialogOpen(false)} onConfirm={confirmProcessOrder} order={selectedOrderToProcess} isLoading={isProcessLoading} />
    </PageWrapper>
  );
}
