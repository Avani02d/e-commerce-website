import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [{ name: String, product: String, quantity: Number, price: Number }],
    total: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["pending", "paid", "shipped", "delivered", "cancelled"], default: "pending" },
    shippingAddress: { name: String, line1: String, city: String, state: String, postalCode: String, country: { type: String, default: "India" } }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
