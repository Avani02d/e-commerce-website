import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

export async function createOrder(req, res) {
  const { items, shippingAddress } = req.body;
  if (!Array.isArray(items) || !items.length) return res.status(400).json({ message: "At least one item is required" });
  if (!shippingAddress?.name || !shippingAddress?.line1 || !shippingAddress?.city || !shippingAddress?.postalCode) return res.status(400).json({ message: "Complete shipping details are required" });

  let normalizedItems;
  if (mongoose.connection.readyState === 1) {
    const productIds = items.map((item) => item.product);
    if (productIds.some((id) => !mongoose.isValidObjectId(id))) return res.status(400).json({ message: "Every order item must reference a valid product" });

    const products = await Product.find({ _id: { $in: productIds } });
    const productById = new Map(products.map((product) => [product._id.toString(), product]));
    normalizedItems = items.map((item) => {
      const product = productById.get(String(item.product));
      const quantity = Number(item.quantity);
      if (!product) return null;
      if (!Number.isInteger(quantity) || quantity < 1) return null;
      if (product.stock < quantity) return null;
      return { product: product._id.toString(), name: product.name, quantity, price: product.price };
    });
    if (normalizedItems.some((item) => !item)) return res.status(409).json({ message: "One or more products are unavailable or out of stock" });

    const reserved = [];
    try {
      for (const item of normalizedItems) {
        const product = await Product.findOneAndUpdate(
          { _id: item.product, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { new: true }
        );
        if (!product) throw new Error("Stock changed while placing the order");
        reserved.push(item);
      }
    } catch (error) {
      if (reserved.length) await Product.bulkWrite(reserved.map((item) => ({ updateOne: { filter: { _id: item.product }, update: { $inc: { stock: item.quantity } } } })));
      return res.status(409).json({ message: error.message });
    }

    try {
      const total = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const order = await Order.create({ user: req.user.id, items: normalizedItems, total, shippingAddress });
      return res.status(201).json(order);
    } catch (error) {
      await Product.bulkWrite(normalizedItems.map((item) => ({ updateOne: { filter: { _id: item.product }, update: { $inc: { stock: item.quantity } } } })));
      throw error;
    }
  } else {
    normalizedItems = items.map((item) => ({ product: item.product, name: item.name, quantity: Math.max(1, Number(item.quantity) || 1), price: Math.max(0, Number(item.price) || 0) }));
  }
  const total = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = await Order.create({ user: req.user.id, items: normalizedItems, total, shippingAddress });
  res.status(201).json(order);
}

export async function listOrders(req, res) {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
}

export async function getOrder(req, res) {
  const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
}

export async function listAllOrders(_req, res) {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json(orders);
}

export async function updateOrderStatus(req, res) {
  const allowedStatuses = ["pending", "paid", "shipped", "delivered", "cancelled"];
  if (!allowedStatuses.includes(req.body?.status)) return res.status(400).json({ message: "Invalid order status" });
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).populate("user", "name email");
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
}
