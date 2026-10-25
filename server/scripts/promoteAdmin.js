import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

const email = process.argv[2]?.toLowerCase().trim();
if (!email) {
  console.error("Usage: npm run make:admin -- user@example.com");
  process.exitCode = 1;
} else {
  await connectDB();
  const user = await User.findOneAndUpdate({ email }, { role: "admin" }, { new: true });
  if (!user) {
    console.error(`No user found for ${email}`);
    process.exitCode = 1;
  } else {
    console.log(`Admin access granted to ${user.email}`);
  }
  await mongoose.disconnect();
}
