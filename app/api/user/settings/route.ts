import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import * as z from "zod";

const nameSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter."),
});

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const userId = session.user.id;

    if ('name' in body && Object.keys(body).length === 1) {
      const validation = nameSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
      }

      await prisma.user.update({
        where: { id: userId },
        data: { name: validation.data.name },
      });

      return NextResponse.json({ message: "Nama berhasil diperbarui" });
    }
        
    return NextResponse.json({ error: "Data permintaan tidak valid" }, { status: 400 });

  } catch (error) {
    console.error("Error updating user settings:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
