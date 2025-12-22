"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, LineChart, Mail, DollarSign, TrendingUp, Activity } from "lucide-react";

// Lazy load Recharts components
const BarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then((mod) => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false });
const PieChart = dynamic(() => import("recharts").then((mod) => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import("recharts").then((mod) => mod.Pie), { ssr: false });
const Cell = dynamic(() => import("recharts").then((mod) => mod.Cell), { ssr: false });
const Legend = dynamic(() => import("recharts").then((mod) => mod.Legend), { ssr: false });

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b", // amber/orange - menunggu
  PROCESSED: "#3b82f6", // blue - diproses
  SHIPPED: "#8b5cf6", // purple - dikirim
  COMPLETED: "#22c55e", // green - selesai
  CANCELLED: "#ef4444", // red - batal
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Menunggu",
  PROCESSED: "Diproses",
  SHIPPED: "Dikirim",
  COMPLETED: "Selesai",
  CANCELLED: "Batal",
};

type DashboardData = {
  counts: {
    products: number;
    categories: number;
    articles: number;
    inquiries: number;
  };
  revenue: {
    total: number;
  };
  charts: {
    orderStatus: { status: string; count: number }[];
    salesTrend: { name: string; total: number }[];
  };
};

interface DashboardViewProps {
  data: DashboardData;
  userName?: string | null;
}

export function DashboardView({ data, userName }: DashboardViewProps) {
  const statCards = [
    {
      title: "Total Pendapatan",
      value: formatCurrency(data.revenue.total),
      description: "Dari semua pesanan selesai",
      icon: <DollarSign className="h-4 w-4 text-green-600" />,
    },
    {
      title: "Produk Aktif",
      value: data.counts.products,
      description: "Total produk di katalog",
      icon: <Package className="h-4 w-4 text-blue-600" />,
    },
    {
      title: "Pesan Masuk",
      value: data.counts.inquiries,
      description: "Inquiry baru belum dibaca",
      icon: <Mail className="h-4 w-4 text-orange-600" />,
    },
    {
      title: "Artikel Terbit",
      value: data.counts.articles,
      description: "Konten blog aktif",
      icon: <LineChart className="h-4 w-4 text-purple-600" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Selamat datang kembali, {userName || "Admin"}! Berikut ringkasan performa bisnis Anda.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              {item.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tren Penjualan
            </CardTitle>
            <CardDescription>Pendapatan kotor selama 6 bulan terakhir.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.charts.salesTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rp${value / 1000}k`} />
                  <Tooltip formatter={(value: any) => formatCurrency(value as number)} contentStyle={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }} itemStyle={{ color: "var(--foreground)" }} />
                  <Bar dataKey="total" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Pendapatan" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Status Pesanan
            </CardTitle>
            <CardDescription>Distribusi pesanan berdasarkan status saat ini.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
              {data.charts.orderStatus.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.charts.orderStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="count" nameKey="status">
                      {data.charts.orderStatus.map((entry) => (
                        <Cell key={`cell-${entry.status}`} fill={STATUS_COLORS[entry.status] || "#888888"} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any, name: any) => [value, STATUS_LABELS[name] || name]} contentStyle={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }} itemStyle={{ color: "var(--foreground)" }} />
                    <Legend formatter={(value) => STATUS_LABELS[value] || value} layout="horizontal" verticalAlign="bottom" align="center" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-muted-foreground text-sm text-center">Belum ada data pesanan.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
