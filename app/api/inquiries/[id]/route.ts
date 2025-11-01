import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as inquiryService from "@/lib/services/inquiry.service";
import { InquiryStatus, Prisma } from "@prisma/client";

export async function PATCH(
  request: Request,
  context: { params: { id: string } } 
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { id } = context.params;
    const body = await request.json();
    const { status } = body;

    if (!status || !Object.values(InquiryStatus).includes(status)) {
      return NextResponse.json(
        { error: `Status tidak valid. Gunakan: NEW, READ, atau REPLIED.` },
        { status: 400 }
      );
    }

    const updatedInquiry = await inquiryService.updateInquiryStatus(id, status);

    return NextResponse.json(updatedInquiry);

} catch (error: any) {
    console.error("Error updating inquiry status:", error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
         return NextResponse.json(
          { error: "Inquiry tidak ditemukan." },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
