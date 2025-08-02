import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    // Test JWT with current environment
    const testPayload = {
      userId: "test123",
      email: "test@example.com",
      userType: "citizen",
    };

    const jwtSecret = process.env.JWT_SECRET;
    const nextAuthSecret = process.env.NEXTAUTH_SECRET;
    const fallbackSecret = "awaaz-secret-key";

    console.log("=== ENVIRONMENT TEST ===");
    console.log("JWT_SECRET exists:", !!jwtSecret);
    console.log("NEXTAUTH_SECRET exists:", !!nextAuthSecret);
    console.log("JWT_SECRET value:", jwtSecret);
    console.log("NEXTAUTH_SECRET value:", nextAuthSecret);

    // Use same logic as login
    const secret = jwtSecret || nextAuthSecret || fallbackSecret;
    console.log("Using secret:", secret);

    // Create token
    const token = jwt.sign(testPayload, secret, { expiresIn: "7d" });
    console.log("Token created:", token.substring(0, 50) + "...");

    // Verify token
    const decoded = jwt.verify(token, secret);
    console.log("Token verified:", decoded);

    return NextResponse.json({
      success: true,
      environmentCheck: {
        JWT_SECRET_EXISTS: !!jwtSecret,
        NEXTAUTH_SECRET_EXISTS: !!nextAuthSecret,
        USING_SECRET:
          secret === jwtSecret
            ? "JWT_SECRET"
            : secret === nextAuthSecret
            ? "NEXTAUTH_SECRET"
            : "FALLBACK",
      },
      tokenTest: {
        created: true,
        verified: true,
        payload: decoded,
      },
    });
  } catch (error) {
    console.error("Test failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
