"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { format, subDays } from "date-fns";
import { PageWrapper } from "@/components/admin/page-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useReportData } from "@/hooks/use-report-data";
import { TransactionTable } from "@/components/admin/reports/transaction-table";
import { ReportsSkeleton } from "@/components/admin/reports/reports-skeleton";
import { DollarSign, ShoppingBag, XCircle, TrendingUp, FileSpreadsheet, FileText } from "lucide-react";
import { exportToExcel, exportToPDF } from "@/lib/export-utils";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const SalesChart = dynamic(() => import("@/components/admin/reports/sales-chart").then((mod) => mod.SalesChart), {
  loading: () => <Skeleton className="h-[350px] w-full rounded-xl" />,
  ssr: false,
});
const OrderTypeChart = dynamic(() => import("@/components/admin/reports/order-type-chart").then((mod) => mod.OrderTypeChart), {
  loading: () => <Skeleton className="h-[350px] w-full rounded-xl" />,
  ssr: false,
});

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const { data, isLoading, error } = useReportData(dateRange);

  const handleDateChange = (field: "from" | "to", value: string) => {
    if (!value) return;
    setDateRange((prev) => ({
      ...prev,
      [field]: new Date(value),
    }));
  };

  const handleExport = async (type: "excel" | "pdf") => {
    if (!data || !dateRange.from || !dateRange.to) {
      toast.error("Data belum siap untuk diekspor.");
      return;
    }

    try {
      if (type === "excel") {
        await exportToExcel(data, dateRange.from, dateRange.to);
        toast.success("Laporan Excel berhasil diunduh.");
      } else {
        await exportToPDF(data, dateRange.from, dateRange.to);
        toast.success("Laporan PDF berhasil diunduh.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengunduh laporan.");
    }
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Laporan & Analitik</h1>
            <p className="text-muted-foreground">Pantau performa penjualan dan tren pasar.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport("excel")} disabled={isLoading || !data}>
              <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
              Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("pdf")} disabled={isLoading || !data}>
              <FileText className="mr-2 h-4 w-4 text-red-600" />
              PDF
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-4 pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="w-full md:w-auto space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Dari Tanggal</label>
                <Input type="date" value={dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : ""} onChange={(e) => handleDateChange("from", e.target.value)} className="w-full md:w-[180px]" />
              </div>
              <div className="w-full md:w-auto space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Sampai Tanggal</label>
                <Input type="date" value={dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : ""} onChange={(e) => handleDateChange("to", e.target.value)} className="w-full md:w-[180px]" />
              </div>
              <Button
                variant="secondary"
                onClick={() => {
                  setDateRange({ from: subDays(new Date(), 30), to: new Date() });
                }}
              >
                Reset Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <ReportsSkeleton />
        ) : error ? (
          <div className="py-12 text-center text-destructive border border-dashed border-destructive/50 rounded-lg bg-destructive/5">
            <p className="font-medium">Gagal memuat data laporan.</p>
            <p className="text-sm mt-1 text-muted-foreground">Silakan periksa koneksi internet atau coba lagi nanti.</p>
          </div>
        ) : data ? (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(data.summary.totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground">Dalam periode yang dipilih</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.summary.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">Transaksi masuk</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rata-rata Transaksi</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(data.summary.averageOrderValue)}</div>
                  <p className="text-xs text-muted-foreground">Per pesanan sukses</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Dibatalkan</CardTitle>
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">{data.summary.cancelledOrders}</div>
                  <p className="text-xs text-muted-foreground">Pesanan gagal/batal</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
              <SalesChart data={data.salesTrend} />
              <OrderTypeChart data={data.orderTypeStats} />
            </div>

            <TransactionTable data={data.recentTransactions} />
          </div>
        ) : null}
      </div>
    </PageWrapper>
  );
}
