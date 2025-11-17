import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { OrderStatus } from "@prisma/client";
import * as orderService from "@/lib/services/order.service"; 

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const order = await orderService.getOrderById(id);

    if (!order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json(order);

  } catch (error: any) {
    console.error("Error fetching order detail:", error);
    if (error.message.includes("Format Order ID tidak valid")) {
       return NextResponse.json(
        { error: "Format ID Pesanan tidak valid." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !Object.values(OrderStatus).includes(status)) {
      return NextResponse.json(
        { error: `Status tidak valid. Gunakan: PENDING, COMPLETED, atau CANCELLED.` },
        { status: 400 }
      );
    }

    const updatedOrder = await orderService.updateOrderStatus(id, status);

    return NextResponse.json(updatedOrder);

  } catch (error: any) {
    console.error("Error updating order status:", error);
    
    if (error.code === 'P2025' || error.message.includes("Format Order ID tidak valid")) {
       return NextResponse.json(
        { error: "Pesanan tidak ditemukan atau ID tidak valid." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
