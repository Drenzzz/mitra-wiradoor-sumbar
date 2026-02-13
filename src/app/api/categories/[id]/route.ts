import { NextResponse, NextRequest } from "next/server";
import * as categoryService from "@/lib/services/category.service";
import { requirePermission } from "@/lib/authz";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission("category:edit");
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const body = await request.json();

    if (body.action === "restore") {
      await categoryService.restoreCategoryById(id);
      return NextResponse.json({ message: "Kategori berhasil dipulihkan" });
    }

    const updatedCategory = await categoryService.updateCategoryById(id, body);
    return NextResponse.json(updatedCategory);
  } catch (error) {
    return NextResponse.json({ error: "Gagal memperbarui kategori" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission("category:delete");
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true";

    if (force) {
      await categoryService.permanentDeleteCategoryById(id);
      return NextResponse.json({ message: "Kategori berhasil dihapus permanen" });
    } else {
      await categoryService.softDeleteCategoryById(id);
      return NextResponse.json({ message: "Kategori berhasil dipindahkan ke sampah" });
    }
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus kategori" }, { status: 500 });
  }
}
