import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Product from "../models/Product.js";

const products = [
  { name: "Cloud Knit Sneakers", category: "Footwear", price: 2499, stock: 12, description: "Lightweight everyday sneakers with a soft knit upper." },
  { name: "Everyday Canvas Tote", category: "Accessories", price: 1299, stock: 24, description: "A durable carryall for commutes, errands, and weekends." },
  { name: "Minimal Desk Lamp", category: "Home", price: 1899, stock: 8, description: "Warm, focused light for calm and productive spaces." }
];

await connectDB();
if (mongoose.connection.readyState !== 1) throw new Error("MONGO_URI is required to seed products");
await Product.deleteMany({});
await Product.insertMany(products);
console.log(`Seeded ${products.length} products`);
await mongoose.disconnect();
