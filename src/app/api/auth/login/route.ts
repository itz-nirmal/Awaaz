import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import { User } from "@/models/User";

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

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Block admin users from using regular login
    if (user.userType === "admin") {
      return NextResponse.json(
        { error: "Admin users must use the dedicated admin login portal" },
        { status: 403 }
      );
    }

    // Ensure only citizens can use regular login
    if (user.userType !== "citizen") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create JWT token
    const secret =
      process.env.JWT_SECRET ||
      process.env.NEXTAUTH_SECRET ||
      "awaaz-secret-key";

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        userType: user.userType,
      },
      secret,
      { expiresIn: "7d" }
    );

    // User response (without password)
    const userResponse = {
      _id: user._id,
      email: user.email,
      name: user.name,
      userType: user.userType,
      phoneNumber: user.phoneNumber,
      address: user.address,
      isVerified: user.isVerified,
    };

    // Set token in HTTP-only cookie
    const response = NextResponse.json(
      { message: "Login successful", user: userResponse },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
