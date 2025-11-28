"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

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

export function useDashboardStats() {
  const fetchStats = async () => {
    const response = await fetch("/api/admin/stats");
    if (!response.ok) throw new Error("Gagal memuat data dashboard");
    return response.json();
  };

  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["dashboard-stats"],
    queryFn: fetchStats,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  if (error) {
    toast.error((error as Error).message);
  }

  return {
    data,
    isLoading,
  };
}
