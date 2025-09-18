import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Nama kategori wajib diisi" },
        { status: 400 }
      );
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        description,
        deletedAt: null, 
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  try {
    let whereClause = {};

    if (status === 'trashed') {
      whereClause = { 
        deletedAt: { 
          not: null 
        } 
      };
    } else {
      whereClause = { 
        deletedAt: null 
      };
    }

    const categories = await prisma.category.findMany({
      where: whereClause,
      orderBy: {
        name: 'asc'
      }
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
