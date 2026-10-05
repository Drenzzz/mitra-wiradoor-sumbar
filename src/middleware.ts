import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const response = NextResponse.next();

  let csrfToken = req.cookies.get("csrf_token")?.value;
  let isNewToken = false;

  if (!csrfToken) {
    csrfToken = crypto.randomUUID();
    isNewToken = true;
    response.cookies.set("csrf_token", csrfToken, { path: "/", httpOnly: false, sameSite: "lax" });
  }

  if (req.nextUrl.pathname.startsWith("/api/")) {
    const contentLengthStr = req.headers.get("content-length");
    if (contentLengthStr) {
      const contentLength = parseInt(contentLengthStr, 10);
      if (contentLength > 2 * 1024 * 1024) {
        return NextResponse.json({ error: "Payload too large. Maximum size is 2MB." }, { status: 413 });
      }
    }

    const method = req.method;
    const isMutation = ["POST", "PUT", "DELETE", "PATCH"].includes(method);
    const isAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");

    if (isMutation && !isAuthRoute) {
      const headerToken = req.headers.get("x-csrf-token");
      if (!headerToken || headerToken !== csrfToken) {
        return NextResponse.json({ error: "Invalid CSRF Token" }, { status: 403 });
      }
    }
  }

  if (req.nextUrl.pathname.startsWith("/admin")) {
    const sessionCookie = getSessionCookie(req);
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
