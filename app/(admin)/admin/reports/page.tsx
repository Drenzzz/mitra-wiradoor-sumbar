"use client";

import { useState } from "react";
import { format, subDays } from "date-fns";
import { PageWrapper } from "@/components/admin/page-wrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useReportData } from "@/hooks/use-report-data";

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

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Laporan & Analitik</h1>
          <p className="text-muted-foreground">Pantau performa penjualan dan statistik toko Anda.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filter Laporan</CardTitle>
            <CardDescription>Pilih rentang waktu untuk menampilkan data.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="w-full md:w-1/3 space-y-2">
                <label className="text-sm font-medium">Dari Tanggal</label>
                <Input type="date" value={dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : ""} onChange={(e) => handleDateChange("from", e.target.value)} />
              </div>
              <div className="w-full md:w-1/3 space-y-2">
                <label className="text-sm font-medium">Sampai Tanggal</label>
                <Input type="date" value={dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : ""} onChange={(e) => handleDateChange("to", e.target.value)} />
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setDateRange({ from: subDays(new Date(), 30), to: new Date() });
                }}
              >
                Reset Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {isLoading && <div className="p-8 text-center text-muted-foreground">Memuat data laporan...</div>}

        {error && <div className="p-8 text-center text-destructive">Gagal memuat data laporan.</div>}

        {data && !isLoading && (
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Debug Data</CardTitle>
                <CardDescription>Preview data mentah sebelum dibuat grafik.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-md font-mono text-xs overflow-auto max-h-60">
                  <pre>{JSON.stringify(data.summary, null, 2)}</pre>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
    