import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface AdminTokenPayload {
  userId: string;
  email: string;
  userType: string;
  isAdmin: boolean;
  adminLevel?: string;
}

export function verifyAdminToken(
  request: NextRequest
): AdminTokenPayload | null {
  const adminToken =
    request.cookies.get("admin_token")?.value ||
    request.cookies.get("token")?.value;

  if (!adminToken) {
    return null;
  }

  try {
    const decoded = jwt.verify(
      adminToken,
      process.env.NEXTAUTH_SECRET || "awaaz-secret-key"
    ) as AdminTokenPayload;

    // Verify it's an admin user with the correct email
    if (
      decoded.userType === "admin" &&
      decoded.email === "admin@awaaz.gov.in" &&
      decoded.isAdmin === true
    ) {
      return decoded;
    }

    return null;
  } catch {
    return null;
  }
}

export function adminMiddleware(request: NextRequest) {
  const adminUser = verifyAdminToken(request);

  if (!adminUser) {
    return NextResponse.json(
      { error: "Access denied. Admin privileges required." },
      { status: 403 }
    );
  }

  return NextResponse.next();
}
