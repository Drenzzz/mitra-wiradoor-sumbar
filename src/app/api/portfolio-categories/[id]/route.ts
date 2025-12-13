import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as service from "@/lib/services/portfolio-category.service";
import { ZodError } from "zod";
import { portfolioCategorySchema } from "@/lib/validations/portfolio.schema";

async function isAdminSession() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await isAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Hanya Admin yang diizinkan." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    if (body.action === "restore") {
      await service.restorePortfolioCategoryById(id);
      return NextResponse.json({ message: "Kategori portofolio berhasil dipulihkan" });
    }

    const validatedData = portfolioCategorySchema.parse(body);
    const updatedCategory = await service.updatePortfolioCategoryById(id, validatedData);
    return NextResponse.json(updatedCategory);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Data tidak valid.", details: error.issues }, { status: 400 });
    }
    if (error instanceof Error && error.message.includes("unique constraint")) {
      return NextResponse.json({ error: "Nama kategori ini sudah ada." }, { status: 409 });
    }
    return NextResponse.json({ error: "Gagal memperbarui kategori portofolio" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await isAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Hanya Admin yang diizinkan." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true";

    if (force) {
      await service.permanentDeletePortfolioCategoryById(id);
      return NextResponse.json({ message: "Kategori portofolio berhasil dihapus permanen" });
    } else {
      await service.softDeletePortfolioCategoryById(id);
      return NextResponse.json({ message: "Kategori portofolio berhasil dipindahkan ke sampah" });
    }
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus kategori portofolio" }, { status: 500 });
  }
}
