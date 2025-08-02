import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST() {
  try {
    await connectDB();

    // Check if admin already exists with new email
    const existingAdmin = await User.findOne({ email: "admin@awaaz.gov.in" });

    if (existingAdmin) {
      return NextResponse.json(
        { message: "Admin user already exists" },
        { status: 200 }
      );
    }

    // Remove old admin if exists
    await User.deleteOne({ email: "admin@awaaz.gov" });

    // Create admin user with new credentials
    const hashedPassword = await bcrypt.hash("12AwaazAdmin@#", 12);

    const adminUser = new User({
      email: "admin@awaaz.gov.in",
      password: hashedPassword,
      name: "Awaaz Official Administrator",
      userType: "admin",
      isVerified: true,
    });

    await adminUser.save();

    return NextResponse.json(
      {
        message: "Admin user created successfully",
        credentials: {
          email: "admin@awaaz.gov.in",
          password: "12AwaazAdmin@#",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating admin user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
