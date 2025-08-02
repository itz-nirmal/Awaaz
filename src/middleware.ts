import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
  // Check if the request is for protected API routes
  if (request.nextUrl.pathname.startsWith("/api/profile")) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    try {
      jwt.verify(token, process.env.NEXTAUTH_SECRET || "awaaz-secret-key");
      // Token is valid, continue with the request
      return NextResponse.next();
    } catch {
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/profile/:path*"],
};
