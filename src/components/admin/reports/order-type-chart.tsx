"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { OrderTypeStat } from "@/types";

interface OrderTypeChartProps {
  data: OrderTypeStat[];
}

const COLORS = ["#22c55e", "#f59e0b"];

export function OrderTypeChart({ data }: OrderTypeChartProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Distribusi Tipe Produk</CardTitle>
        <CardDescription>Perbandingan penjualan Ready Stock vs Custom Order.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full flex justify-center items-center">
          {data.every((item) => item.count === 0) ? (
            <div className="text-muted-foreground text-sm">Belum ada data penjualan.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="count">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [value + " item", "Terjual"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                  }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
