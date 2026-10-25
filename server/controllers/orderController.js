import Order from "../models/Order.js";

export async function createOrder(req, res) {
  const { items, shippingAddress } = req.body;
  if (!Array.isArray(items) || !items.length) return res.status(400).json({ message: "At least one item is required" });
  if (!shippingAddress?.name || !shippingAddress?.line1 || !shippingAddress?.city || !shippingAddress?.postalCode) return res.status(400).json({ message: "Complete shipping details are required" });

  const normalizedItems = items.map((item) => ({ product: item.product, name: item.name, quantity: Math.max(1, Number(item.quantity) || 1), price: Math.max(0, Number(item.price) || 0) }));
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
