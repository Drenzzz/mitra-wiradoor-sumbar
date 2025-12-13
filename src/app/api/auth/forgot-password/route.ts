import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { sendPasswordResetEmail } from "@/lib/mail";
import crypto from "crypto";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const user = await db.query.users.findFirst({ where: eq(users.email, email) });

    if (!user) {
      return NextResponse.json({ message: "Jika email terdaftar, link reset akan dikirim." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    const passwordResetExpires = new Date(Date.now() + 3600000);

    await db.update(users).set({ passwordResetToken, passwordResetExpires }).where(eq(users.id, user.id));

    await sendPasswordResetEmail(user.email!, resetToken);

    return NextResponse.json({ message: "Jika email terdaftar, link reset akan dikirim." });
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
