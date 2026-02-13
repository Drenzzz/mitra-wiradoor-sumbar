import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { Role } from "@/db/schema";
import { hasPermission, type Permission } from "@/lib/config/permissions";

type AuthGuardResult =
  | { ok: true; session: Session }
  | { ok: false; response: NextResponse };

export async function getSession(): Promise<Session | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return null;
  }
  return session;
}

export async function requireSession(errorMessage = "Not authenticated"): Promise<AuthGuardResult> {
  const session = await getSession();
  if (!session) {
    return {
      ok: false,
      response: NextResponse.json({ error: errorMessage }, { status: 401 }),
    };
  }

  return { ok: true, session };
}

export async function requireRole(roles: Role[], errorMessage = "Forbidden"): Promise<AuthGuardResult> {
  const sessionGuard = await requireSession();
  if (!sessionGuard.ok) {
    return sessionGuard;
  }

  const role = sessionGuard.session.user.role;
  if (!role || !roles.includes(role)) {
    return {
      ok: false,
      response: NextResponse.json({ error: errorMessage }, { status: 403 }),
    };
  }

  return sessionGuard;
}

export async function requirePermission(permission: Permission, errorMessage = "Forbidden"): Promise<AuthGuardResult> {
  const sessionGuard = await requireSession();
  if (!sessionGuard.ok) {
    return sessionGuard;
  }

  if (!hasPermission(sessionGuard.session.user.role, permission)) {
    return {
      ok: false,
      response: NextResponse.json({ error: errorMessage }, { status: 403 }),
    };
  }

  return sessionGuard;
}
