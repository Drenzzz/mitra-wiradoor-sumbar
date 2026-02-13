import { NextResponse, NextRequest } from "next/server";
import * as articleCategoryService from "@/lib/services/article-category.service";
import { requirePermission } from "@/lib/authz";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission("article:edit");
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const body = await request.json();

    if (body.action === "restore") {
      await articleCategoryService.restoreArticleCategoryById(id);
      return NextResponse.json({ message: "Kategori artikel berhasil dipulihkan" });
    }

    const updatedCategory = await articleCategoryService.updateArticleCategoryById(id, body);
    return NextResponse.json(updatedCategory);
  } catch (error) {
    return NextResponse.json({ error: "Gagal memperbarui kategori artikel" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission("article:delete");
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true";

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
