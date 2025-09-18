import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// Handler untuk menghapus kategori secara permanen
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  
  try {
    const id = params.id;
    // Gunakan prisma.category.delete untuk menghapus permanen
    await prisma.category.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Kategori berhasil dihapus permanen" });
  } catch (error) {
    console.error("Error permanently deleting category:", error);
    return NextResponse.json({ error: "Gagal menghapus kategori" }, { status: 500 });
  }
}