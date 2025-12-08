import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as productService from "@/lib/services/product.service";
import { hasPermission } from "@/lib/config/permissions";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const product = await productService.getProductById(id);
    if (!product) {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data produk" }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  if (!hasPermission(session.user.role, "product:edit")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();

    if (body.action === "restore") {
      await productService.restoreProductById(id);
      return NextResponse.json({ message: "Produk berhasil dipulihkan" });
    }

    const updatedProduct = await productService.updateProductById(id, body);
    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: "Gagal memperbarui produk" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  if (!hasPermission(session.user.role, "product:delete")) {
    return NextResponse.json({ error: "Forbidden: Anda tidak memiliki izin menghapus produk." }, { status: 403 });
  }

  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true";

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
