// File: app/api/admin/article-categories/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as articleCategoryService from "@/lib/services/article-category.service";

// Handler untuk PATCH (update atau restore)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    const { id } = params;
    const body = await request.json();

    if (body.action === 'restore') {
      await articleCategoryService.restoreArticleCategoryById(id);
      return NextResponse.json({ message: "Kategori artikel berhasil dipulihkan" });
    }

    const updatedCategory = await articleCategoryService.updateArticleCategoryById(id, body);
    return NextResponse.json(updatedCategory);
  } catch (error) {
    return NextResponse.json({ error: "Gagal memperbarui kategori artikel" }, { status: 500 });
  }
}

// Handler untuk DELETE (soft delete atau permanent delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';

    if (force) {
      await articleCategoryService.permanentDeleteArticleCategoryById(id);
      return NextResponse.json({ message: "Kategori artikel berhasil dihapus permanen" });
    } else {
      await articleCategoryService.softDeleteArticleCategoryById(id);
      return NextResponse.json({ message: "Kategori artikel berhasil dipindahkan ke sampah" });
    }
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus kategori artikel" }, { status: 500 });
  }
}
