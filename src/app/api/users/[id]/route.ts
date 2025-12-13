import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ZodError } from "zod";
import * as userService from "@/lib/services/user.service";
import { userUpdateSchema } from "@/lib/validations/user.schema";

async function isAdminSession() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await isAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Hanya Admin yang diizinkan." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const user = await userService.getUserById(id);
    if (!user) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await isAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Hanya Admin yang diizinkan." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = userUpdateSchema.parse(body);

    const updatedUser = await userService.updateUser(id, validatedData);
    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Data tidak valid.", details: error.issues }, { status: 400 });
    }
    if (error instanceof Error && error.message.includes("unique constraint")) {
      return NextResponse.json({ error: "Email ini sudah terdaftar." }, { status: 409 });
    }
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await isAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Hanya Admin yang diizinkan." }, { status: 403 });
  }

  const { id } = await params;

  if (session.user.id === id) {
    return NextResponse.json({ error: "Anda tidak dapat menghapus akun Anda sendiri." }, { status: 400 });
  }

  try {
    const deleted = await userService.deleteUser(id);
    if (!deleted) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ message: "Pengguna berhasil dihapus." }, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
