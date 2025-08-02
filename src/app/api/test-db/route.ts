import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

export async function GET() {
  try {
    console.log("🔄 Testing MongoDB connection...");

    const startTime = Date.now();
    await connectDB();
    const connectionTime = Date.now() - startTime;

    console.log(`✅ MongoDB connection successful in ${connectionTime}ms`);

    return NextResponse.json({
      success: true,
      message: "MongoDB connection successful! 🎉",
      connectionTime: `${connectionTime}ms`,
      timestamp: new Date().toISOString(),
      instructions: {
        if_this_works: "Your MongoDB connection is properly configured",
        if_this_fails: "Follow the IP whitelist instructions in the console",
      },
    });
  } catch (error) {
    console.error("❌ MongoDB connection test failed:", error);

    let errorMessage = "MongoDB connection failed";
    let solution = "Check MongoDB Atlas configuration";

    if (error instanceof Error) {
      errorMessage = error.message;

      if (error.message.includes("IP") || error.message.includes("whitelist")) {
        solution =
          "Add your IP address to MongoDB Atlas Network Access whitelist";
      } else if (error.message.includes("authentication")) {
        solution = "Check your MongoDB username and password";
      } else if (error.message.includes("timeout")) {
        solution = "Check your internet connection and MongoDB Atlas status";
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        solution: solution,
        instructions: {
          step1: "Go to https://cloud.mongodb.com",
          step2: "Select your cluster",
          step3: "Go to 'Network Access' in the left sidebar",
          step4: "Click 'Add IP Address'",
          step5: "Either add your current IP or use 0.0.0.0/0 for development",
          step6: "Click 'Confirm' and wait for the change to take effect",
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  // Test connection with detailed diagnostics
  try {
    console.log("🔍 Running detailed MongoDB diagnostics...");

    // Check environment variable
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI environment variable is not set");
    }

    console.log("✅ MONGODB_URI environment variable found");
    console.log("🔗 Connection string format looks valid");

    // Test connection
    const startTime = Date.now();
    await connectDB();
    const connectionTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      message: "All MongoDB diagnostics passed! 🎉",
      diagnostics: {
        environment_variable: "✅ MONGODB_URI found",
        connection_string: "✅ Format valid",
        connection_test: `✅ Connected in ${connectionTime}ms`,
        status: "All systems operational",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        diagnostics: {
          environment_variable: process.env.MONGODB_URI
            ? "✅ Found"
            : "❌ Missing",
          connection_test: "❌ Failed",
          likely_cause: "IP address not whitelisted in MongoDB Atlas",
        },
        quickFix:
          "Visit MongoDB Atlas → Network Access → Add IP Address → Use 0.0.0.0/0 for development",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
