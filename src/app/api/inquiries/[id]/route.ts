import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as inquiryService from "@/lib/services/inquiry.service";
import type { InquiryStatus } from "@/db/schema";

const VALID_INQUIRY_STATUSES: InquiryStatus[] = ["NEW", "READ", "REPLIED"];

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

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
