import mongoose from "mongoose";

export function databaseRequired(_req, res, next) {
  if (mongoose.connection.readyState === 1) return next();
  res.status(503).json({ message: "Database service is temporarily unavailable" });
}
