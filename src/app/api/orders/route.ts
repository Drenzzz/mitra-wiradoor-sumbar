import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { ZodError } from "zod";
import { customerInfoSchema } from "@/lib/validations/order.schema";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getOrders } from "@/lib/services/order.service";
import { OrderStatus } from "@prisma/client";
import { globalLimiter } from "@/lib/rate-limit";

function generateInvoiceNumber(): string {
  const timestamp = new Date().getTime().toString().slice(-8);
  const randomSuffix = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `WIR-${timestamp}-${randomSuffix}`;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const isAllowed = globalLimiter.check(ip, 5);

    if (!isAllowed) {
      return NextResponse.json({ error: "Terlalu banyak permintaan transaksi. Tunggu sebentar." }, { status: 429 });
    }

    const body = await request.json();
    const { items, ...customerData } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Keranjang belanja kosong." }, { status: 400 });
    }

    const validatedCustomerData = customerInfoSchema.parse(customerData);

    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          invoiceNumber: generateInvoiceNumber(),
          customerName: validatedCustomerData.customerName,
          customerEmail: validatedCustomerData.customerEmail,
          customerPhone: validatedCustomerData.customerPhone,
          customerAddress: validatedCustomerData.customerAddress,
          status: "PENDING",
        },
      });

      for (const item of items) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.id,
            productName: item.name,
            isReadyStock: true,
            quantity: item.quantity,
          },
        });
      }

      return order;
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Data formulir tidak valid.", details: error.issues }, { status: 400 });
    }
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");

    const options = {
      status: statusParam && Object.values(OrderStatus).includes(statusParam as OrderStatus) ? (statusParam as OrderStatus) : undefined,
      search: searchParams.get("search") || undefined,
      sort: searchParams.get("sort") || undefined,
      page: parseInt(searchParams.get("page") || "1", 10),
      limit: parseInt(searchParams.get("limit") || "10", 10),
      startDate: searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined,
      endDate: searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined,
    };

    const result = await getOrders(options);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
