import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ZodError } from "zod";
import * as userService from "@/lib/services/user.service";
import { userCreateSchema } from "@/lib/validations/user.schema";

async function isAdminSession() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function GET(request: NextRequest) {
  const session = await isAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Hanya Admin yang diizinkan." }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const options = {
      search: searchParams.get("search") || undefined,
      page: parseInt(searchParams.get("page") || "1", 10),
      limit: parseInt(searchParams.get("limit") || "10", 10),
    };

    const result = await userService.getUsers(options);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await isAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Hanya Admin yang diizinkan." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validatedData = userCreateSchema.parse(body);

    const newUser = await userService.createUser(validatedData);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Data tidak valid.", details: error.issues }, { status: 400 });
    }
    if (error instanceof Error && error.message.includes("unique constraint")) {
      return NextResponse.json({ error: "Email ini sudah terdaftar." }, { status: 409 });
    }
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
