import connectDB from "../src/lib/mongodb.js";
import { User } from "../src/models/User.js";
import bcrypt from "bcryptjs";

async function seedAdminUser() {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@awaaz.gov" });

    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12);

    const adminUser = new User({
      email: "admin@awaaz.gov",
      password: hashedPassword,
      name: "Awaaz Admin",
      userType: "admin",
      isVerified: true,
    });

    await adminUser.save();
    console.log("Admin user created successfully");
    console.log("Email: admin@awaaz.gov");
    console.log("Password: admin123");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    process.exit(0);
  }
}

seedAdminUser();
