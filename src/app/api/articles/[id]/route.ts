import { NextResponse, NextRequest } from "next/server";
import * as articleService from "@/lib/services/article.service";
import { getSession, requirePermission } from "@/lib/authz";
import { hasPermission } from "@/lib/config/permissions";

const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const idOrSlug = (await context.params).id;
    const session = await getSession();
    const canViewInternal = !!session?.user && hasPermission(session.user.role, "article:view");
    let article;

    if (canViewInternal && UUID_REGEX.test(idOrSlug)) {
      article = await articleService.getArticleById(idOrSlug);
    }

    if (!article) {
      article = await articleService.getArticleBySlug(idOrSlug);
    }

    if (!article || (!canViewInternal && (article.status !== "PUBLISHED" || !!article.deletedAt))) {
      return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data artikel" }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission("article:edit");
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const body = await request.json();
    if (body.action === "restore") {
      await articleService.restoreArticleById(id);
      return NextResponse.json({ message: "Artikel berhasil dipulihkan" });
    }
    const updatedArticle = await articleService.updateArticleById(id, body);
    return NextResponse.json(updatedArticle);
  } catch (error) {
    return NextResponse.json({ error: "Gagal memperbarui artikel" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission("article:delete");
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true";

    const { id } = await context.params;
    if (force) {
      await articleService.permanentDeleteArticleById(id);
      return NextResponse.json({ message: "Artikel berhasil dihapus permanen" });
    } else {
      await articleService.softDeleteArticleById(id);
      return NextResponse.json({ message: "Artikel berhasil dipindahkan ke sampah" });
    }
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus artikel" }, { status: 500 });
  }
}
