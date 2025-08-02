import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET() {
  try {
    console.log("Starting debug auth check...");

    // Test MongoDB connection
    await connectDB();
    console.log("✅ MongoDB connected successfully");

    // Check if admin user exists
    const adminUser = await User.findOne({
      email: "admin@awaaz.gov.in",
      userType: "admin",
    });

    if (!adminUser) {
      console.log("❌ Admin user not found");
      return NextResponse.json({
        error: "Admin user not found",
        suggestion: "Call /api/seed-admin first",
      });
    }

    console.log("✅ Admin user found:", {
      email: adminUser.email,
      name: adminUser.name,
      userType: adminUser.userType,
      isVerified: adminUser.isVerified,
    });

    // Test password comparison with the expected password
    const testPassword = "12AwaazAdmin@#";
    const isPasswordValid = await bcrypt.compare(
      testPassword,
      adminUser.password
    );

    console.log("Password test result:", isPasswordValid);

    return NextResponse.json({
      success: true,
      adminExists: true,
      adminDetails: {
        email: adminUser.email,
        name: adminUser.name,
        userType: adminUser.userType,
        isVerified: adminUser.isVerified,
      },
      passwordTest: isPasswordValid,
      message: isPasswordValid
        ? "✅ Admin setup is correct"
        : "❌ Password doesn't match - admin may need to be recreated",
    });
  } catch (error) {
    console.error("Debug auth error:", error);
    return NextResponse.json({
      error: "Debug failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function POST() {
  try {
    console.log("Testing admin login flow...");

    await connectDB();

    const testCredentials = {
      email: "admin@awaaz.gov.in",
      password: "12AwaazAdmin@#",
    };

    // Simulate the exact login flow
    console.log("1. Testing email restriction...");
    if (testCredentials.email !== "admin@awaaz.gov.in") {
      return NextResponse.json({
        step: "email_check",
        result: "failed",
        error: "Email restriction failed",
      });
    }
    console.log("✅ Email check passed");

    console.log("2. Finding user in database...");
    const user = await User.findOne({
      email: "admin@awaaz.gov.in",
      userType: "admin",
    });

    if (!user) {
      return NextResponse.json({
        step: "user_lookup",
        result: "failed",
        error: "Admin user not found in database",
      });
    }
    console.log("✅ User found");

    console.log("3. Testing password...");
    const isPasswordValid = await bcrypt.compare(
      testCredentials.password,
      user.password
    );
    if (!isPasswordValid) {
      return NextResponse.json({
        step: "password_check",
        result: "failed",
        error: "Password comparison failed",
        storedHash: user.password.substring(0, 20) + "...",
        testPassword: testCredentials.password,
      });
    }
    console.log("✅ Password valid");

    console.log("4. Testing verification status...");
    if (!user.isVerified) {
      return NextResponse.json({
        step: "verification_check",
        result: "failed",
        error: "User not verified",
      });
    }
    console.log("✅ User verified");

    return NextResponse.json({
      success: true,
      message: "All login checks passed! The admin login should work.",
      userDetails: {
        email: user.email,
        name: user.name,
        userType: user.userType,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Login test error:", error);
    return NextResponse.json({
      error: "Login test failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
