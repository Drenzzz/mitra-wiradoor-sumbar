import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as articleService from "@/lib/services/article.service";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) { // Changed from `context: { params: Promise<{ id: string }> }` to `context: { params: { id: string } }`
    try {
        const article = await articleService.getArticleById((await context.params).id);
        if (!article) {
            return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
        }
        return NextResponse.json(article);
    } catch (error) {
        return NextResponse.json({ error: "Gagal mengambil data artikel" }, { status: 500 });
    }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    const { id } = await context.params;
    const body = await request.json();
    if (body.action === 'restore') {
      await articleService.restoreArticleById(id);
      return NextResponse.json({ message: "Artikel berhasil dipulihkan" });
    }
    const updatedArticle = await articleService.updateArticleById(id, body);
    return NextResponse.json(updatedArticle);
  } catch (error) {
    return NextResponse.json({ error: "Gagal memperbarui artikel" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';

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
