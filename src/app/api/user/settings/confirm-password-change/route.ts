import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import crypto from "crypto";
import * as bcrypt from "bcrypt";
import { eq, gt, and } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Data tidak lengkap." }, { status: 400 });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await db.query.users.findFirst({
      where: and(eq(users.passwordChangeToken, hashedToken), gt(users.passwordChangeExpires, new Date())),
    });

    if (!user) {
      return NextResponse.json({ error: "Token tidak valid atau telah kedaluwarsa." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db
      .update(users)
      .set({
        password: hashedPassword,
        passwordChangeToken: null,
        passwordChangeExpires: null,
      })
      .where(eq(users.id, user.id));

    return NextResponse.json({ message: "Password berhasil diubah." });
  } catch (error) {
    console.error("Error confirming password change:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
