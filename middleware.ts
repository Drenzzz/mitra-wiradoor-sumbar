// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` akan memperkaya `req` Anda dengan `token`
  function middleware(req) {
    // Redirect jika user bukan 'ADMIN' dan mencoba mengakses /admin
    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      req.nextauth.token?.role !== "ADMIN" &&
      req.nextauth.token?.role !== "STAF"
    ) {
      return NextResponse.rewrite(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Jika ada token, maka authorized
    },
  }
);

// Tentukan rute mana yang ingin Anda lindungi
export const config = {
  matcher: ["/admin/:path*"],
};