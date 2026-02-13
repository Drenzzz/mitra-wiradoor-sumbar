import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import type { OrderStatus } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { requirePermission } from "@/lib/authz";

const VALID_ORDER_STATUSES: OrderStatus[] = ["PENDING", "PROCESSED", "SHIPPED", "COMPLETED", "CANCELLED"];

export async function POST(request: Request) {
  const auth = await requirePermission("order:process");
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const { orderIds, action, status } = body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json({ error: "No orders selected" }, { status: 400 });
    }

    if (action === "updateStatus") {
      if (!status || !VALID_ORDER_STATUSES.includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }

      await db
        .update(orders)
        .set({
          status: status as OrderStatus,
          updatedAt: new Date(),
        })
        .where(inArray(orders.id, orderIds));

      return NextResponse.json({ message: "Orders updated successfully" });
    }

    if (action === "delete") {
      const deleteGuard = await requirePermission("order:delete", "Forbidden: Only Admin can delete orders.");
      if (!deleteGuard.ok) return deleteGuard.response;

      await db.delete(orders).where(inArray(orders.id, orderIds));

      return NextResponse.json({ message: "Orders deleted successfully" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Bulk action error:", error);
    return NextResponse.json({ error: "Failed to perform bulk action" }, { status: 500 });
  }
}
