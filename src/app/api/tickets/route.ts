import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import { Ticket } from "@/models/Ticket";

interface DecodedToken {
  userId: string;
  email: string;
  userType: "admin" | "citizen";
}

// Helper function to verify JWT token (used for GET requests)
function verifyToken(request: NextRequest): DecodedToken | null {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const secret =
      process.env.JWT_SECRET ||
      process.env.NEXTAUTH_SECRET ||
      "awaaz-secret-key";

    const decoded = jwt.verify(token, secret) as DecodedToken;
    return decoded;
  } catch {
    return null;
  }
}

// GET - Fetch all tickets or user's tickets
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const userId = searchParams.get("userId");

    // Build filter query
    const filter: Record<string, unknown> = {};

    if (user.userType === "citizen" && !userId) {
      filter.citizenId = user.userId;
    } else if (userId) {
      filter.citizenId = userId;
    }

    if (status) filter.status = status;
    if (category) filter.category = category;

    const skip = (page - 1) * limit;

    const tickets = await Ticket.find(filter)
      .populate("citizenId", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Ticket.countDocuments(filter);

    return NextResponse.json({
      tickets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get tickets error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new ticket (No JWT verification - simplified approach)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // No authentication required - anyone can submit issues
    // This makes it much simpler and avoids JWT complications
    const requestBody = await request.json();

    const { title, description, category, priority, location, images } =
      requestBody;

    // Validate required fields
    if (!title || !description || !category || !location?.address) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: title, description, category, and address are required",
        },
        { status: 400 }
      );
    }

    // Create new ticket without user authentication
    const newTicket = new Ticket({
      title,
      description,
      category,
      priority: priority || "medium",
      location,
      // citizenId is now optional - no user required
      images: images || [],
    });

    await newTicket.save();

    return NextResponse.json(
      { message: "Issue submitted successfully!", ticket: newTicket },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create ticket error:", error);
    return NextResponse.json(
      { error: "Failed to submit issue. Please try again." },
      { status: 500 }
    );
  }
}
