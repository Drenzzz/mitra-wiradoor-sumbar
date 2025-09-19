import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as productService from "@/lib/services/product.service";

// GET
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const product = await productService.getProductById(id);
    if (!product) {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data produk" }, { status: 500 });
  }
}

// PATCH
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    const { id } = params; 
    const body = await request.json();

    if (body.action === 'restore') {
      await productService.restoreProductById(id);
      return NextResponse.json({ message: "Produk berhasil dipulihkan" });
    }
    
    const updatedProduct = await productService.updateProductById(id, body);
    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: "Gagal memperbarui produk" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';

    if (force) {
      await productService.permanentDeleteProductById(id);
      return NextResponse.json({ message: "Produk berhasil dihapus permanen" });
    } else {
      await productService.softDeleteProductById(id);
      return NextResponse.json({ message: "Produk berhasil dipindahkan ke sampah" });
    }
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus produk" }, { status: 500 });
  }
}
