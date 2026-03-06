
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { AuthCollection } from "./models/auth_model.js";
import { UserCollection } from "./models/user_model.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/aquenix";

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await AuthCollection.findOne({ email: "admin@aquenix.com" });
    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    // Create admin profile
    const profile = await UserCollection.create({
      email: "admin@aquenix.com",
      name: "Admin",
      phone: "+1234567890",
      designation: "System Administrator",
      area: "Headquarters"
    });

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 12);

    // Create admin user
    await AuthCollection.create({
      name: "Admin",
      email: "admin@aquenix.com",
      phone: "+1234567890",
      password: hashedPassword,
      role: "admin",
      user: profile._id,
      isActive: true
    });

    console.log("Admin user created successfully!");
    console.log("Email: admin@aquenix.com");
    console.log("Password: admin123");

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

