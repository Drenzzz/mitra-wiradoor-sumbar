import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as productService from "@/lib/services/product.service";

// POST
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    const body = await request.json();
    if (!body.name || !body.categoryId || !body.imageUrl) {
      return NextResponse.json({ error: "Data wajib (nama, kategori, gambar) tidak boleh kosong" }, { status: 400 });
    }
    const newProduct = await productService.createProduct(body);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}

// GET
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const options = {
      status: searchParams.get('status') as 'active' | 'trashed' | undefined,
      search: searchParams.get('search') || undefined,
      sort: searchParams.get('sort') || undefined,
      page: parseInt(searchParams.get('page') || '1', 10),
      limit: parseInt(searchParams.get('limit') || '10', 10),
    };
    const result = await productService.getProducts(options);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
