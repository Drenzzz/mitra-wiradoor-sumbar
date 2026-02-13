import { NextResponse, NextRequest } from "next/server";
import * as articleService from "@/lib/services/article.service";
import { hasPermission } from "@/lib/config/permissions";
import { getSession, requirePermission } from "@/lib/authz";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const canViewInternal = !!session?.user && hasPermission(session.user.role, "article:view");
    const { searchParams } = new URL(request.url);
    const requestedLimit = parseInt(searchParams.get("limit") || "10", 10);
    const safeLimit = Number.isNaN(requestedLimit) ? 10 : requestedLimit;

    const options = {
      status: canViewInternal ? (searchParams.get("status") as "active" | "trashed" | undefined) : "active",
      search: searchParams.get("search") || undefined,
      sort: searchParams.get("sort") || undefined,
      page: parseInt(searchParams.get("page") || "1", 10),
      limit: canViewInternal ? safeLimit : Math.min(Math.max(safeLimit, 1), 50),
      categoryId: searchParams.get("categoryId") || undefined,
      statusFilter: canViewInternal ? searchParams.get("statusFilter") || undefined : "PUBLISHED",
    };
    const result = await articleService.getArticles(options);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requirePermission("article:create");
  if (!auth.ok) return auth.response;
  const session = auth.session;

  try {
    const body = await request.json();
    const { title, content, categoryId, featuredImageUrl, status } = body;

    if (!title || !content || !categoryId || !featuredImageUrl) {
      return NextResponse.json({ error: "Judul, konten, kategori, dan gambar wajib diisi" }, { status: 400 });
    }

    if (status === "PUBLISHED" && !hasPermission(session.user.role, "article:publish")) {
      return NextResponse.json({ error: "Anda tidak memiliki izin untuk mempublikasikan artikel." }, { status: 403 });
    }

    const payload = {
      ...body,
      authorId: session.user.id,
      slug: body.slug || title.toLowerCase().replace(/\s+/g, "-").slice(0, 50),
      status: hasPermission(session.user.role, "article:publish") ? status : "DRAFT",
    };

    const newArticle = await articleService.createArticle(payload);
    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
