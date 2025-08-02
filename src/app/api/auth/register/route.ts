import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password, name, userType, phoneNumber, address } =
      await request.json();

    // Validate required fields
    if (!email || !password || !name || !userType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // For citizens, phone number is required
    if (userType === "citizen" && !phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required for citizen accounts" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      userType,
      phoneNumber,
      address,
      isVerified: false,
    });

    await newUser.save();

    // Remove password from response
    const userResponse = {
      _id: newUser._id,
      email: newUser.email,
      name: newUser.name,
      userType: newUser.userType,
      phoneNumber: newUser.phoneNumber,
      address: newUser.address,
      isVerified: newUser.isVerified,
      createdAt: newUser.createdAt,
    };

    return NextResponse.json(
      { message: "User registered successfully", user: userResponse },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
