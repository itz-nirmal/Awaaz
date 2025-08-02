import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import { User } from "@/models/User";

// Pre-reserved admin credentials for security
const AUTHORIZED_ADMIN_EMAIL = "admin@awaaz.gov.in";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // First check: Only allow the pre-reserved admin email
    if (email !== AUTHORIZED_ADMIN_EMAIL) {
      return NextResponse.json(
        {
          error:
            "Access denied. Only authorized officials can access the admin portal.",
        },
        { status: 403 }
      );
    }

    // Find user by email and ensure they are admin type
    const user = await User.findOne({
      email: AUTHORIZED_ADMIN_EMAIL,
      userType: "admin",
    });

    if (!user) {
      return NextResponse.json(
        { error: "Admin account not found. Contact system administrator." },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid admin credentials" },
        { status: 401 }
      );
    }

    // Additional security: Ensure user is verified and active
    if (!user.isVerified) {
      return NextResponse.json(
        {
          error: "Admin account is not verified. Contact system administrator.",
        },
        { status: 403 }
      );
    }

    // Create JWT token with admin-specific claims
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        userType: user.userType,
        isAdmin: true,
        adminLevel: "super", // Can be used for different admin levels
      },
      process.env.NEXTAUTH_SECRET || "awaaz-secret-key",
      { expiresIn: "24h" } // Shorter expiry for admin sessions
    );

    // Admin response (without password)
    const adminResponse = {
      _id: user._id,
      email: user.email,
      name: user.name,
      userType: user.userType,
      isVerified: user.isVerified,
      loginTime: new Date().toISOString(),
    };

    // Set secure token in HTTP-only cookie
    const response = NextResponse.json(
      {
        message: "Admin login successful",
        user: adminResponse,
        adminAccess: true,
      },
      { status: 200 }
    );

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/", // Ensure cookie is available site-wide
    });

    // Also set the regular token for compatibility
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
