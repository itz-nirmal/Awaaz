import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    // Get all users, excluding sensitive information like passwords
    const users = await User.find(
      {},
      {
        password: 0, // Exclude password field
        __v: 0, // Exclude version field
      }
    ).sort({ createdAt: -1 });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
