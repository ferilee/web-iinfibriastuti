import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (except login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Protect mutating API routes (simplified check)
  if (
    pathname.startsWith("/api/") &&
    !pathname.startsWith("/api/auth") &&
    pathname !== "/api/contact" &&
    !pathname.startsWith("/api/comments") &&
    !pathname.startsWith("/api/reactions")
  ) {
    if (request.method !== "GET") {
      const token = request.cookies.get("token")?.value;

      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const payload = await verifyToken(token);
      if (!payload) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
