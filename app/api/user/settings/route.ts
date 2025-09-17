import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";

// Handler untuk metode PATCH/PUT (untuk update)
export async function PATCH(request: Request) {

    const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { name, currentPassword, newPassword } = body;

  // @ts-ignore
  const userId = session.user.id;

  try {
    if (name) {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { name: name },
      });
      return NextResponse.json({ message: "Nama berhasil diperbarui", user: updatedUser });
    }

    if (currentPassword && newPassword) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || !user.password) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isPasswordValid) {
        return NextResponse.json({ error: "Password saat ini salah" }, { status: 400 });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
      });

      return NextResponse.json({ message: "Password berhasil diperbarui" });
    }

    // Jika tidak ada data yang sesuai untuk diupdate
    return NextResponse.json({ error: "Data tidak valid untuk pembaruan" }, { status: 400 });

  } catch (error) {
    console.error("Error updating user settings:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}