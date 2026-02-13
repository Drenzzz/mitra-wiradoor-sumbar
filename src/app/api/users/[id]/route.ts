import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import * as userService from "@/lib/services/user.service";
import { userUpdateSchema } from "@/lib/validations/user.schema";
import { requireRole } from "@/lib/authz";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(["ADMIN"], "Hanya Admin yang diizinkan.");
  if (!auth.ok) return auth.response;

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
  const auth = await requireRole(["ADMIN"], "Hanya Admin yang diizinkan.");
  if (!auth.ok) return auth.response;

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
  const auth = await requireRole(["ADMIN"], "Hanya Admin yang diizinkan.");
  if (!auth.ok) return auth.response;
  const session = auth.session;

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
