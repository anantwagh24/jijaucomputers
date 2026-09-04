import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authCookie = request.cookies.get("jijau_admin_auth");
  const isAuthenticated = authCookie && authCookie.value === "true";

  // 1. Protect Admin Backend APIs (Block unauthorized API access with 401 JSON)
  if (pathname.startsWith("/api/admin") && pathname !== "/api/admin/login") {
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized: Administrator privileges required to access this endpoint." },
        { status: 401 }
      );
    }
  }

  // 2. Protect Admin Frontend Pages (Redirect to Login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isAuthenticated) {
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
