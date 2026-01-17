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
  const response = NextResponse.next();

  // 0. Global: Ensure CSRF Cookie Exists
  let csrfToken = req.cookies.get("csrf_token")?.value;
  let isNewToken = false;

  if (!csrfToken) {
    csrfToken = crypto.randomUUID();
    isNewToken = true;
    // Set cookie on the default response
    response.cookies.set("csrf_token", csrfToken, { path: "/", httpOnly: false, sameSite: "lax" });
  }

  // 1. Security: API Protections
  if (req.nextUrl.pathname.startsWith("/api/")) {
    // A. Body Size Limit (2MB)
    const contentLengthStr = req.headers.get("content-length");
    if (contentLengthStr) {
      const contentLength = parseInt(contentLengthStr, 10);
      if (contentLength > 2 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Payload too large. Maximum size is 2MB." },
          { status: 413 }
        );
      }
    }

    // B. CSRF Validation for Mutations
    const method = req.method;
    const isMutation = ["POST", "PUT", "DELETE", "PATCH"].includes(method);
    const isAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");

    if (isMutation && !isAuthRoute) {
      const headerToken = req.headers.get("x-csrf-token");
      if (!headerToken || headerToken !== csrfToken) {
        return NextResponse.json(
          { error: "Invalid CSRF Token" },
          { status: 403 }
        );
      }
    }
  }

  // 2. Auth: Proteksi route Admin
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const authRes = await (adminAuthMiddleware as any)(req);
    
    // If we generated a new CSRF token, ensure it's set on the auth response too
    if (isNewToken) {
      authRes.cookies.set("csrf_token", csrfToken, { path: "/", httpOnly: false, sameSite: "lax" });
    }
    
    return authRes;
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};