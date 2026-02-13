import { NextResponse, NextRequest } from "next/server";
import * as categoryService from "@/lib/services/category.service";
import { requirePermission } from "@/lib/authz";

export async function POST(request: Request) {
  const auth = await requirePermission("category:create");
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: "Nama kategori wajib diisi" }, { status: 400 });
    }
    const newCategory = await categoryService.createCategory(body);
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const auth = await requirePermission("category:view");
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const options = {
      status: searchParams.get("status") as "active" | "trashed" | undefined,
      search: searchParams.get("search") || undefined,
      sort: searchParams.get("sort") || undefined,
      page: parseInt(searchParams.get("page") || "1", 10),
      limit: parseInt(searchParams.get("limit") || "10", 10),
    };
    const result = await categoryService.getCategories(options);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
