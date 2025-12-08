import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { hasPermission } from "@/lib/config/permissions";
import { OrderStatus } from "@prisma/client";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Check generic permission, specific logic can be refined
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
      if (!status || !Object.values(OrderStatus).includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }

      await prisma.order.updateMany({
        where: {
          id: {
            in: orderIds,
          },
        },
        data: {
          status: status as OrderStatus,
        },
      });

      return NextResponse.json({ message: "Orders updated successfully" });
    }

    if (action === "delete") {
      if (!hasPermission(session.user.role, "order:delete")) {
        return NextResponse.json({ error: "Forbidden: Only Admin can delete orders." }, { status: 403 });
      }

      await prisma.order.deleteMany({
        where: {
          id: {
            in: orderIds,
          },
        },
      });
      return NextResponse.json({ message: "Orders deleted successfully" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Bulk action error:", error);
    return NextResponse.json({ error: "Failed to perform bulk action" }, { status: 500 });
  }
}
