"use client";

import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SalesTrend } from "@/types";

interface SalesChartProps {
  data: SalesTrend[];
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Tren Penjualan & Transaksi</CardTitle>
        <CardDescription>Perbandingan pendapatan kotor dan jumlah pesanan dalam periode ini.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rp${value / 1000}k`} />
              <YAxis yAxisId="right" orientation="right" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value} order`} />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === "Pendapatan")
                    return new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(value);
                  return value;
                }}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                itemStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="revenue" name="Pendapatan" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40} />
              <Line yAxisId="right" type="monotone" dataKey="orderCount" name="Jumlah Pesanan" stroke="#ea580c" strokeWidth={2} dot={{ r: 4, fill: "#ea580c" }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
