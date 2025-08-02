import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import { User } from "@/models/User";

interface DecodedToken {
  userId: string;
  email: string;
  userType: "admin" | "citizen";
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    // Verify token first (faster than DB connection)
    let decoded: DecodedToken;
    try {
      const secret =
        process.env.JWT_SECRET ||
        process.env.NEXTAUTH_SECRET ||
        "awaaz-secret-key";
      decoded = jwt.verify(token, secret) as DecodedToken;
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Connect to DB only after token verification
    await connectDB();

    // Find user in database with timeout
    const user = await Promise.race([
      User.findById(decoded.userId).select("-password"),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Database timeout")), 5000)
      ),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        userType: user.userType,
        phoneNumber: user.phoneNumber,
        address: user.address,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    if (error instanceof Error && error.message === "Database timeout") {
      return NextResponse.json(
        { error: "Service temporarily unavailable" },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
