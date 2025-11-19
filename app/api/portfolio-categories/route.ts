import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as service from "@/lib/services/portfolio-category.service";
import { ZodError } from "zod";
import { portfolioCategorySchema } from "@/lib/validations/portfolio.schema";
import { Prisma } from "@prisma/client";

async function isAdminSession() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return null;
  }
  return session;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const options = {
      status: searchParams.get('status') as 'active' | 'trashed' | undefined,
      search: searchParams.get('search') || undefined,
      sort: searchParams.get('sort') || undefined,
      page: parseInt(searchParams.get('page') || '1', 10),
      limit: parseInt(searchParams.get('limit') || '100', 10),
    };
    
    if (options.status === 'trashed') {
      const session = await isAdminSession();
      if (!session) {
        return NextResponse.json({ error: "Hanya Admin yang diizinkan." }, { status: 403 });
      }
    }

    const result = await service.getPortfolioCategories(options);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await isAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Hanya Admin yang diizinkan." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validatedData = portfolioCategorySchema.parse(body);
    const newCategory = await service.createPortfolioCategory(validatedData);
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Data tidak valid.", details: error.issues }, { status: 400 });
    }
     if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: "Nama kategori ini sudah ada." }, { status: 409 });
    }
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
