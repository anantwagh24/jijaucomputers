import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken } from "./lib/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract admin session token from cookie
  const adminCookie = request.cookies.get("jijau_admin_session");
  const session = await verifySessionToken(adminCookie?.value);
  const isAdminAuthenticated = Boolean(
    session && (session.role === "ADMIN" || session.role === "SUPERADMIN")
  );

  // 1. Protect Admin Backend APIs (Block unauthorized API access with 401 JSON)
  if (pathname.startsWith("/api/admin") && pathname !== "/api/admin/login") {
    if (!isAdminAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized: Valid administrator cryptographic session required." },
        { status: 401 }
      );
    }
  }

  // 2. Protect Admin Frontend Pages (Redirect to Login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isAdminAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
