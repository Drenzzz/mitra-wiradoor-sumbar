import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as service from "@/lib/services/portfolio.service";
import { ZodError } from "zod";
import { portfolioItemSchema } from "@/lib/validations/portfolio.schema";

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
      search: searchParams.get('search') || undefined,
      sort: searchParams.get('sort') || undefined,
      page: parseInt(searchParams.get('page') || '1', 10),
      limit: parseInt(searchParams.get('limit') || '10', 10),
      categoryId: searchParams.get('categoryId') || undefined,
    };
    
    const result = await service.getPortfolioItems(options);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching portfolio items:", error);
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
    const validatedData = portfolioItemSchema.parse(body);
    const newItem = await service.createPortfolioItem(validatedData);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Data tidak valid.", details: error.issues }, { status: 400 });
    }
    console.error("Error creating portfolio item:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
