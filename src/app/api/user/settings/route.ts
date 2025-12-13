import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { users } from "@/db/schema";
import * as bcrypt from "bcrypt";
import crypto from "crypto";
import { sendPasswordChangeEmail } from "@/lib/mail";
import { eq } from "drizzle-orm";

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    const body = await request.json();
    const userId = session.user.id;

    if ("name" in body && !("currentPassword" in body)) {
      const { name } = body;
      if (typeof name !== "string" || name.length < 3) {
        return NextResponse.json({ error: "Nama minimal 3 karakter." }, { status: 400 });
      }
      await db.update(users).set({ name }).where(eq(users.id, userId));
      return NextResponse.json({ message: "Nama berhasil diperbarui" });
    } else if ("currentPassword" in body) {
      const { currentPassword } = body;
      if (typeof currentPassword !== "string" || currentPassword.length === 0) {
        return NextResponse.json({ error: "Password saat ini wajib diisi." }, { status: 400 });
      }

      const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
      if (!user || !user.password) {
        return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json({ error: "Password saat ini yang Anda masukkan salah." }, { status: 400 });
      }

      const changeToken = crypto.randomBytes(32).toString("hex");
      const passwordChangeToken = crypto.createHash("sha256").update(changeToken).digest("hex");
      const passwordChangeExpires = new Date(Date.now() + 3600000);

      await db.update(users).set({ passwordChangeToken, passwordChangeExpires }).where(eq(users.id, userId));

      await sendPasswordChangeEmail(session.user.email, changeToken);

      return NextResponse.json({ message: "Link verifikasi telah dikirim ke email Anda." });
    }

    return NextResponse.json({ error: "Data permintaan tidak valid" }, { status: 400 });
  } catch (error) {
    console.error("Error in settings API:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
