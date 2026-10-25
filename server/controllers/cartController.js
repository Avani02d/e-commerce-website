import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export async function getCart(req, res) {
  const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
  res.json(cart || { user: req.user.id, items: [] });
}

export async function addToCart(req, res) {
  const { productId, quantity = 1 } = req.body;
  if (!productId || !Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ message: "A valid productId and quantity are required" });

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) cart = new Cart({ user: req.user.id, items: [] });
  const existing = cart.items.find((item) => item.product.toString() === productId);
  if ((existing?.quantity || 0) + quantity > product.stock) return res.status(409).json({ message: `Only ${product.stock} item(s) available` });
  if (existing) existing.quantity += quantity;
  else cart.items.push({ product: productId, quantity });
  await cart.save();
  await cart.populate("items.product");
  res.status(201).json(cart);
}

export async function removeFromCart(req, res) {
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return res.json({ user: req.user.id, items: [] });
  cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId);
  await cart.save();
  await cart.populate("items.product");
  res.json(cart);
}

export async function updateCartItem(req, res) {
  const quantity = Number(req.body?.quantity);
  if (!Number.isInteger(quantity) || quantity < 1) return removeFromCart(req, res);
  const product = await Product.findById(req.params.productId);
  if (!product) return res.status(404).json({ message: "Product not found" });
  if (quantity > product.stock) return res.status(409).json({ message: `Only ${product.stock} item(s) available` });
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });
  const item = cart.items.find((entry) => entry.product.toString() === req.params.productId);
  if (!item) return res.status(404).json({ message: "Cart item not found" });
  item.quantity = quantity;
  await cart.save();
  await cart.populate("items.product");
  res.json(cart);
}

export async function clearCart(req, res) {
  await Cart.findOneAndDelete({ user: req.user.id });
  res.json({ user: req.user.id, items: [] });
}
