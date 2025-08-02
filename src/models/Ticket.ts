import mongoose, { Document, Schema } from "mongoose";

export interface ITicket extends Document {
  _id: string;
  title: string;
  description: string;
  category:
    | "infrastructure"
    | "utilities"
    | "safety"
    | "environment"
    | "transport"
    | "other";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in-progress" | "resolved" | "closed";
  resolution?: string; // Admin resolution message
  location: {
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  citizenId?: mongoose.Types.ObjectId; // Made optional
  userEmail?: string; // Simple email field instead of complex user relations
  assignedTo?: mongoose.Types.ObjectId;
  images?: string[];
  upvotes: number;
  downvotes: number;
  comments: {
    userId: mongoose.Types.ObjectId;
    comment: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema = new Schema<ITicket>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    category: {
      type: String,
      enum: [
        "infrastructure",
        "utilities",
        "safety",
        "environment",
        "transport",
        "other",
      ],
      required: [true, "Category is required"],
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "resolved", "closed"],
      default: "open",
    },
    resolution: {
      type: String,
      required: false,
      trim: true,
      maxlength: [1000, "Resolution cannot exceed 1000 characters"],
    },
    location: {
      address: {
        type: String,
        required: [true, "Location address is required"],
        trim: true,
      },
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    citizenId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, // Made optional for simplified submissions
    },
    userEmail: {
      type: String,
      required: false, // Simple email field
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    images: [
      {
        type: String,
      },
    ],
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        comment: {
          type: String,
          required: true,
          trim: true,
          maxlength: [500, "Comment cannot exceed 500 characters"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create indexes
TicketSchema.index({ citizenId: 1 });
TicketSchema.index({ status: 1 });
TicketSchema.index({ category: 1 });
TicketSchema.index({ priority: 1 });
TicketSchema.index({ createdAt: -1 });

export const Ticket =
  mongoose.models.Ticket || mongoose.model<ITicket>("Ticket", TicketSchema);
