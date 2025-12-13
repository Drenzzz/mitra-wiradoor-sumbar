import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { orders } from "@/db/schema";
import type { OrderStatus } from "@/db/schema";
import { hasPermission } from "@/lib/config/permissions";
import { inArray } from "drizzle-orm";

const VALID_ORDER_STATUSES: OrderStatus[] = ["PENDING", "PROCESSED", "SHIPPED", "COMPLETED", "CANCELLED"];

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!hasPermission(session.user.role, "order:process")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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
      if (!hasPermission(session.user.role, "order:delete")) {
        return NextResponse.json({ error: "Forbidden: Only Admin can delete orders." }, { status: 403 });
      }

      await db.delete(orders).where(inArray(orders.id, orderIds));

      return NextResponse.json({ message: "Orders deleted successfully" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Bulk action error:", error);
    return NextResponse.json({ error: "Failed to perform bulk action" }, { status: 500 });
  }
}
