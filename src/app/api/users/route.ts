import { NextResponse, NextRequest } from "next/server";
import { ZodError } from "zod";
import * as userService from "@/lib/services/user.service";
import { userCreateSchema } from "@/lib/validations/user.schema";
import { requireRole } from "@/lib/authz";

export async function GET(request: NextRequest) {
  const auth = await requireRole(["ADMIN"], "Hanya Admin yang diizinkan.");
  if (!auth.ok) return auth.response;

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
  const auth = await requireRole(["ADMIN"], "Hanya Admin yang diizinkan.");
  if (!auth.ok) return auth.response;

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
