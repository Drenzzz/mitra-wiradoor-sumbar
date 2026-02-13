import { NextResponse, NextRequest } from "next/server";
import * as orderService from "@/lib/services/order.service";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requirePermission } from "@/lib/authz";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission("order:view");
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const order = await orderService.getOrderById(id);

    if (!order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data pesanan" }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission("order:process");
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const body = await request.json();

    delete body.id;
    delete body.invoiceNumber;

    const updatedOrder = await orderService.updateOrder(id, body);
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Gagal memperbarui pesanan" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission("order:delete", "Forbidden: Hanya Admin yang bisa menghapus pesanan.");
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;

    await db.delete(orders).where(eq(orders.id, id));

    return NextResponse.json({ message: "Pesanan berhasil dihapus permanen" });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json({ error: "Gagal menghapus pesanan" }, { status: 500 });
  }
}
