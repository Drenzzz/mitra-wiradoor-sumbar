import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ZodError } from "zod";
import { customerInfoSchema } from "@/lib/validations/order.schema";
import { getProductById } from "@/lib/services/product.service";

function generateInvoiceNumber(): string {
  const timestamp = new Date().getTime().toString().slice(-8);
  const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `WIR-${timestamp}-${randomSuffix}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { productId, ...customerData } = body;
    const validatedCustomerData = customerInfoSchema.parse(customerData);

    if (!productId || typeof productId !== 'string') {
      return NextResponse.json(
        { error: "Product ID tidak valid." },
        { status: 400 }
      );
    }

    const product = await getProductById(productId);
    
    if (!product) {
       return NextResponse.json(
        { error: "Produk tidak ditemukan atau tidak valid." },
        { status: 404 }
      );
    }

    if (product.isReadyStock !== true) {
      return NextResponse.json(
        { error: "Produk ini tidak dapat dipesan (bukan ready stock)." },
        { status: 400 }
      );
    }

    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          invoiceNumber: generateInvoiceNumber(),
          customerName: validatedCustomerData.customerName,
          customerEmail: validatedCustomerData.customerEmail,
          customerPhone: validatedCustomerData.customerPhone,
          customerAddress: validatedCustomerData.customerAddress,
          status: 'PENDING', 
        },
      });

      await tx.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          productName: product.name,
          isReadyStock: product.isReadyStock || false,
          quantity: 1,
        },
      });

      return order;
    });

    return NextResponse.json(newOrder, { status: 201 });

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Data formulir tidak valid.", details: error.issues },
        { status: 400 }
      );
    }
    
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
