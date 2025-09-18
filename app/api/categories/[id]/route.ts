import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// === UPDATE (Mengubah Kategori) ===
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
    const body = await request.json();
    const { name, description } = body;

    const updatedCategory = await prisma.category.update({
      where: { id: id },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

// === DELETE (Menghapus Kategori) ===
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
    await prisma.category.update({
      where: { id: id },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({ message: "Kategori berhasil dipindahkan ke sampah" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting category:", error);
    // Handle kasus jika kategori masih memiliki produk terkait
    if (error.code === 'P2003') { 
      return NextResponse.json({ error: "Kategori tidak bisa dihapus karena masih memiliki produk terkait." }, { status: 409 });
    }
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}