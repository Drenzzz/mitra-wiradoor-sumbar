import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const adminAuthMiddleware = withAuth(
  function middleware(req) {
    // Redirect jika user bukan 'ADMIN' atau 'STAF' dan mencoba mengakses /admin
    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      req.nextauth.token?.role !== "ADMIN" &&
      req.nextauth.token?.role !== "STAF"
    ) {
      return NextResponse.rewrite(new URL("/auth/login", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/login",
    },
  }
);

export async function middleware(req: NextRequest) {
  // 1. Security: Body Size Limit untuk API (2MB)
  if (req.nextUrl.pathname.startsWith("/api/")) {
    const contentLengthStr = req.headers.get("content-length");
    if (contentLengthStr) {
      const contentLength = parseInt(contentLengthStr, 10);
      if (contentLength > 2 * 1024 * 1024) { // 2MB
        return NextResponse.json(
          { error: "Payload too large. Maximum size is 2MB." },
          { status: 413 }
        );
      }
    }
  }

  // 2. Auth: Proteksi route Admin
  if (req.nextUrl.pathname.startsWith("/admin")) {
    return (adminAuthMiddleware as any)(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};