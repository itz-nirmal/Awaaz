import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Ticket } from "@/models/Ticket";

// POST - Create a new ticket (Super Simple)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const requestBody = await request.json();
    const { title, description, category, location, images, userEmail } =
      requestBody;

    // Just create the ticket - no complex auth
    const newTicket = new Ticket({
      title,
      description,
      category,
      priority: "medium",
      location,
      userEmail: userEmail, // Use email instead of complex user ID
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

// GET - Simple fetch for both users and admins
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get("userEmail");
    const isAdmin = searchParams.get("admin") === "true";

    let filter = {};
    if (!isAdmin && userEmail) {
      filter = { userEmail: userEmail }; // Show only user's tickets
    }
    // If admin, show all tickets (no filter)

    const tickets = await Ticket.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error("Get tickets error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update ticket status (for admin)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { ticketId, status, resolution } = await request.json();

    const updateData: { status: string; resolution?: string } = { status };
    if (resolution) {
      updateData.resolution = resolution;
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(ticketId, updateData, {
      new: true,
    });

    return NextResponse.json({
      message: "Ticket updated successfully!",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Update ticket error:", error);
    return NextResponse.json(
      { error: "Failed to update ticket" },
      { status: 500 }
    );
  }
}
