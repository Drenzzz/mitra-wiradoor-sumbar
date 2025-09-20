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
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}

// GET
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');
    let status: 'active' | 'trashed' | undefined = 'active';
    if (session?.user && ['active', 'trashed'].includes(statusParam || '')) {
        status = statusParam as 'active' | 'trashed';
    }

    const options = {
      status,
      search: searchParams.get('search') || undefined,
      sort: searchParams.get('sort') || undefined,
      page: parseInt(searchParams.get('page') || '1', 10),
      limit: parseInt(searchParams.get('limit') || '10', 10),
      categoryId: searchParams.get('categoryId') || undefined, // ✅ Teruskan categoryId ke service
    };
    
    const result = await productService.getProducts(options);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
