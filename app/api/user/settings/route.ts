import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import * as z from "zod";

const nameSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter."),
});

const passwordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8, "Password baru minimal 8 karakter."),
});

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const userId = session.user.id;

    if ('name' in body) {
      const validation = nameSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
      }
      await prisma.user.update({ where: { id: userId }, data: { name: validation.data.name } });
      return NextResponse.json({ message: "Nama berhasil diperbarui" });
    }

    if ('currentPassword' in body && 'newPassword' in body) {
      const validation = passwordSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
      }
      
      const { currentPassword, newPassword } = validation.data;

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || !user.password) {
        return NextResponse.json({ error: "Pengguna tidak ditemukan atau tidak memiliki password." }, { status: 404 });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json({ error: "Password saat ini yang Anda masukkan salah." }, { status: 400 });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
      });
      
      return NextResponse.json({ message: "Password berhasil diperbarui." });
    }

    return NextResponse.json({ error: "Data permintaan tidak valid" }, { status: 400 });

  } catch (error) {
    console.error("Error updating user settings:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
