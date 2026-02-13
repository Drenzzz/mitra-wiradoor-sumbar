import { NextResponse, NextRequest } from "next/server";
import { getReportData } from "@/lib/services/report.service";
import { requirePermission } from "@/lib/authz";

export async function GET(request: NextRequest) {
  const auth = await requirePermission("report:view");
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");

    const now = new Date();
    let startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    let endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    if (fromParam) {
      const parsedFrom = new Date(fromParam);
      if (!isNaN(parsedFrom.getTime())) {
        startDate = parsedFrom;
      }
    }

    if (toParam) {
      const parsedTo = new Date(toParam);
      if (!isNaN(parsedTo.getTime())) {
        endDate = parsedTo;
        endDate.setHours(23, 59, 59, 999);
      }
    }

    const reportData = await getReportData(startDate, endDate);

    return NextResponse.json(reportData);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Terjadi kesalahan saat memuat laporan." }, { status: 500 });
  }
}
