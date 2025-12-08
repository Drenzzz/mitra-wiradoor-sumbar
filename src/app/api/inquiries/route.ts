import { NextResponse, NextRequest } from "next/server";
import { ZodError } from "zod";
import { inquirySchema } from "@/lib/validations/inquiry.schema";
import * as inquiryService from "@/lib/services/inquiry.service";
import { globalLimiter } from "@/lib/rate-limit";

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
