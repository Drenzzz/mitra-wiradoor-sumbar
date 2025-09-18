import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// Handler untuk memulihkan kategori (restore)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const id = params.id;
    await prisma.category.update({
      where: { id: id },
      data: {
        deletedAt: null, // Set deletedAt kembali menjadi null
      },
    });
    return NextResponse.json({ message: "Kategori berhasil dipulihkan" });
  } catch (error) {
    console.error("Error restoring category:", error);
    return NextResponse.json({ error: "Gagal memulihkan kategori" }, { status: 500 });
  }
}