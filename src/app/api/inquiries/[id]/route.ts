import { NextResponse } from "next/server";
import * as inquiryService from "@/lib/services/inquiry.service";
import type { InquiryStatus } from "@/db/schema";
import { requirePermission } from "@/lib/authz";

const VALID_INQUIRY_STATUSES: InquiryStatus[] = ["NEW", "READ", "REPLIED"];

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission("inquiry:reply");
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status } = body;

    if (!status || !VALID_INQUIRY_STATUSES.includes(status)) {
      return NextResponse.json({ error: `Status tidak valid. Gunakan: NEW, READ, atau REPLIED.` }, { status: 400 });
    }

    const updatedInquiry = await inquiryService.updateInquiryStatus(id, status);

    if (!updatedInquiry) {
      return NextResponse.json({ error: "Inquiry tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json(updatedInquiry);
  } catch (error) {
    console.error("Error updating inquiry status:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
