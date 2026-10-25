import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: "draft-8", legacyHeaders: false }));

app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/api/health", (_req, res) => res.json({
  ok: true,
  service: "ecommerce-api",
  uptime: Math.round(process.uptime()),
  database: mongoose.connection.readyState === 1 ? "connected" : "not-configured"
}));

if (process.env.NODE_ENV === "production") {
  const rootDir = path.dirname(fileURLToPath(import.meta.url));
  app.use(express.static(path.resolve(rootDir, "../client/dist")));
  app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.resolve(rootDir, "../client/dist/index.html")));
}

app.use(notFound);
app.use(errorHandler);
connectDB().finally(() => app.listen(port, () => console.log(`E-commerce API running on http://localhost:${port}`)));

async function shutdown(signal) {
  console.log(`${signal} received; closing database connection`);
  await mongoose.disconnect();
  process.exit(0);
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));
