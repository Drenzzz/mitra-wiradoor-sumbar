"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { ReportData } from "@/types";

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

export function useReportData(dateRange: DateRange) {
  const fetchReports = async () => {
    const params = new URLSearchParams();

    if (dateRange.from) {
      params.append("from", dateRange.from.toISOString());
    }
    if (dateRange.to) {
      params.append("to", dateRange.to.toISOString());
    }

    const response = await fetch(`/api/reports?${params.toString()}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Gagal memuat data laporan");
    }

    return response.json() as Promise<ReportData>;
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-reports", dateRange.from, dateRange.to],
    queryFn: fetchReports,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  if (error) {
    toast.error((error as Error).message);
  }

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}
