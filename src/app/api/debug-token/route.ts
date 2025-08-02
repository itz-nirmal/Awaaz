import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    console.log("=== DEBUG TOKEN ENDPOINT ===");

    // Check for token in cookies
    const token = request.cookies.get("token")?.value;
    console.log("Token found:", !!token);

    if (token) {
      console.log("Token length:", token.length);
      console.log("Token first 50 chars:", token.substring(0, 50) + "...");

      // Check environment variables
      const nextAuthSecret = process.env.NEXTAUTH_SECRET;
      const jwtSecret = process.env.JWT_SECRET;

      console.log("NEXTAUTH_SECRET exists:", !!nextAuthSecret);
      console.log("JWT_SECRET exists:", !!jwtSecret);

      if (nextAuthSecret) {
        console.log("NEXTAUTH_SECRET length:", nextAuthSecret.length);
      }

      // Try to decode the token
      try {
        const secret = nextAuthSecret || "awaaz-secret-key";
        const decoded = jwt.verify(token, secret);
        console.log("Token decoded successfully:", decoded);

        return NextResponse.json({
          success: true,
          tokenExists: true,
          secretExists: !!nextAuthSecret,
          decoded: decoded,
        });
      } catch (error) {
        console.log("Token decode failed:", error);
        return NextResponse.json({
          success: false,
          tokenExists: true,
          secretExists: !!nextAuthSecret,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        tokenExists: false,
        message: "No token found in cookies",
      });
    }
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
