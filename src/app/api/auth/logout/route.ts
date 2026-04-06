import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const wantsHtml = request.headers.get("accept")?.includes("text/html");
  const response = wantsHtml
    ? NextResponse.redirect(new URL("/", request.url))
    : NextResponse.json({ message: "Logout successful", redirectTo: "/" });

  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
