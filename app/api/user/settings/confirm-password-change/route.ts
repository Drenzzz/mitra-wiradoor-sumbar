import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import * as bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Data tidak lengkap." }, { status: 400 });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        passwordChangeToken: hashedToken,
        passwordChangeExpires: { gt: new Date() },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Token tidak valid atau telah kedaluwarsa." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordChangeToken: null,
        passwordChangeExpires: null,
      },
    });

    return NextResponse.json({ message: "Password berhasil diubah." });

  } catch (error) {
    console.error("Error confirming password change:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
