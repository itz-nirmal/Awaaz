import mongoose from "mongoose";

// Only check for MONGODB_URI during runtime, not build time
function getMongoURI() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }
  return uri;
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface GlobalWithMongoose {
  mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

declare global {
  var mongoose:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

let cached = (global as GlobalWithMongoose).mongoose;

if (!cached) {
  cached = (global as GlobalWithMongoose).mongoose = {
    conn: null,
    promise: null,
  };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Get MongoDB URI at runtime
    const mongoUri = getMongoURI();
    
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000, // 45 second socket timeout
      maxPoolSize: 10, // Limit connection pool size
      retryWrites: true,
    };

    cached.promise = mongoose
      .connect(mongoUri, opts)
      .then((mongoose) => {
        console.log("✅ MongoDB connected successfully");
        return mongoose;
      })
      .catch((error) => {
        console.error("❌ MongoDB connection failed:", error.message);

        // Provide helpful error messages
        if (
          error.message.includes("IP") ||
          error.message.includes("whitelist")
        ) {
          console.error(
            "🔧 IP Whitelist Issue: Please add your IP address to MongoDB Atlas:"
          );
          console.error("   1. Go to https://cloud.mongodb.com");
          console.error("   2. Navigate to Network Access");
          console.error('   3. Click "Add IP Address"');
          console.error(
            "   4. Add your current IP or use 0.0.0.0/0 for all IPs (development only)"
          );
        }

        if (error.message.includes("authentication")) {
          console.error(
            "🔧 Authentication Issue: Check your username/password in the connection string"
          );
        }

        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("🚨 Failed to establish MongoDB connection:", e);
    throw e;
  }

  return cached.conn;
}

export default connectDB;
