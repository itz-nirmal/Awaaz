import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  try {
    const adminUser = verifyAdminToken(request);

    if (!adminUser) {
      return NextResponse.json(
        { error: "Invalid admin session" },
        { status: 401 }
      );
    }

    // Return admin info without sensitive data
    const adminInfo = {
      _id: adminUser.userId,
      email: adminUser.email,
      name: "Awaaz Official Administrator",
      userType: adminUser.userType,
      isVerified: true,
      loginTime: new Date().toISOString(),
    };

    return NextResponse.json({
      admin: adminInfo,
      adminAccess: true,
    });
  } catch (error) {
    console.error("Admin verification error:", error);
    return NextResponse.json(
      { error: "Session verification failed" },
      { status: 500 }
    );
  }
}
