import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as service from "@/lib/services/portfolio.service";
import { ZodError } from "zod";
import { portfolioApiSchema } from "@/lib/validations/portfolio.schema";

async function isAdminSession() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const item = await service.getPortfolioItemById(id);
    if (!item) {
      return NextResponse.json({ error: "Item portofolio tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    console.error("Error fetching portfolio item:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await isAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Hanya Admin yang diizinkan." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = portfolioApiSchema.partial().parse(body);

    const updatedItem = await service.updatePortfolioItem(id, validatedData);
    return NextResponse.json(updatedItem);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Data tidak valid.", details: error.issues }, { status: 400 });
    }
    console.error("Error updating portfolio item:", error);
    return NextResponse.json({ error: "Gagal memperbarui item portofolio." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await isAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Hanya Admin yang diizinkan." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const deleted = await service.deletePortfolioItem(id);
    if (!deleted) {
      return NextResponse.json({ error: "Item portofolio tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ message: "Item portofolio berhasil dihapus." }, { status: 200 });
  } catch (error) {
    console.error("Error deleting portfolio item:", error);
    return NextResponse.json({ error: "Gagal menghapus item portofolio." }, { status: 500 });
  }
}
