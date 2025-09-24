import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as articleService from "@/lib/services/article.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const options = {
      status: searchParams.get('status') as 'active' | 'trashed' | undefined,
      search: searchParams.get('search') || undefined,
      sort: searchParams.get('sort') || undefined,
      page: parseInt(searchParams.get('page') || '1', 10),
      limit: parseInt(searchParams.get('limit') || '10', 10),
      categoryId: searchParams.get('categoryId') || undefined,
      statusFilter: searchParams.get('statusFilter') || undefined,
    };
    const result = await articleService.getArticles(options);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    const body = await request.json();
    const { title, content, categoryId, featuredImageUrl } = body;
    if (!title || !content || !categoryId || !featuredImageUrl) {
      return NextResponse.json({ error: "Judul, konten, kategori, dan gambar wajib diisi" }, { status: 400 });
    }

    // @ts-ignore
    body.authorId = session.user.id;

    body.slug = title.toLowerCase().replace(/\s+/g, '-').slice(0, 50);

    const newArticle = await articleService.createArticle(body);
    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
