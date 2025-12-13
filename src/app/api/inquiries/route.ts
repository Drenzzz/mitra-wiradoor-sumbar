import { NextResponse, NextRequest } from "next/server";
import { ZodError } from "zod";
import { inquirySchema } from "@/lib/validations/inquiry.schema";
import * as inquiryService from "@/lib/services/inquiry.service";
import { globalLimiter } from "@/lib/rate-limit";
import type { InquiryStatus } from "@/db/schema";

export const dynamic = "force-dynamic";

const VALID_INQUIRY_STATUSES: InquiryStatus[] = ["NEW", "READ", "REPLIED"];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || undefined;
    const sort = searchParams.get("sort") || undefined;
    const statusParam = searchParams.get("status");

    let status: InquiryStatus | undefined = undefined;
    if (statusParam && statusParam !== "ALL") {
      if (VALID_INQUIRY_STATUSES.includes(statusParam as InquiryStatus)) {
        status = statusParam as InquiryStatus;
      }
    }

    const result = await inquiryService.getInquiries({
      page,
      limit,
      search,
      sort,
      status,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json({ error: "Gagal memuat data inquiry." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const isAllowed = globalLimiter.check(ip, 3);

    if (!isAllowed) {
      return NextResponse.json({ error: "Terlalu banyak permintaan. Silakan coba lagi nanti." }, { status: 429 });
    }

    const body = await request.json();
    const validatedData = inquirySchema.parse(body);
    const newInquiry = await inquiryService.createInquiry(validatedData);

    return NextResponse.json(newInquiry, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Data tidak valid.", details: error.issues }, { status: 400 });
    }
    console.error("Error creating inquiry:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
