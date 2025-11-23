"use client";

import { OrderDetail } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const formatDate = (dateString: Date) =>
  new Date(dateString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

interface OrderDetailDialogProps {
  order: OrderDetail | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
}

export function OrderDetailDialog({ order, isOpen, onClose, isLoading }: OrderDetailDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detail Pesanan</DialogTitle>
          {order && (
            <DialogDescription>
              Invoice: <span className="font-medium text-foreground">{order.invoiceNumber}</span>
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="py-4 space-y-6 max-h-[70vh] overflow-y-auto pr-4">
          {isLoading || !order ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Memuat detail pesanan...</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <Badge variant={statusVariantMap[order.status as OrderStatus]} className={cn("text-base px-3 py-1", order.status === "PENDING" && "animate-pulse")}>
                    {order.status}
                  </Badge>
                  <span className="text-muted-foreground">{formatDate(order.createdAt)}</span>
                </div>

                {order.dealPrice && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Harga Kesepakatan</p>
                    <p className="text-lg font-bold text-green-600">{formatCurrency(order.dealPrice)}</p>
                  </div>
                )}
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-muted-foreground">Pelanggan</h3>
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                  <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-muted-foreground">Alamat Pengiriman</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{order.customerAddress || "Tidak ada alamat"}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="font-semibold text-muted-foreground">Item Pesanan</h3>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start p-3 bg-muted/50 rounded-md">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">Kuantitas: {item.quantity}</p>
                      </div>
                      <Badge variant={item.isReadyStock ? "default" : "secondary"}>{item.isReadyStock ? "Ready Stock" : "Kustom"}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
