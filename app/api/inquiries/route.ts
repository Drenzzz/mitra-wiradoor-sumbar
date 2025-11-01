import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { inquirySchema } from "@/lib/validations/inquiry.schema";
import * as inquiryService from "@/lib/services/inquiry.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = inquirySchema.parse(body);
    const newInquiry = await inquiryService.createInquiry(validatedData);
    return NextResponse.json(newInquiry, { status: 201 });

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Data tidak valid.", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating inquiry:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
