import { NextResponse, NextRequest } from "next/server";
import { ZodError } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { inquirySchema } from "@/lib/validations/inquiry.schema";
import * as inquiryService from "@/lib/services/inquiry.service";
import { InquiryStatus } from "@prisma/client";

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

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const options = {
      status: searchParams.get('status') as InquiryStatus | undefined,
      search: searchParams.get('search') || undefined,
      sort: searchParams.get('sort') || undefined,
      page: parseInt(searchParams.get('page') || '1', 10),
      limit: parseInt(searchParams.get('limit') || '10', 10),
    };

    const result = await inquiryService.getInquiries(options);
    
    return NextResponse.json(result);

  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
