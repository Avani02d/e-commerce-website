import mongoose from "mongoose";
import Product from "../models/Product.js";

const demoProducts = [
  { id: "demo-1", name: "Cloud Knit Sneakers", category: "Footwear", price: 2499, stock: 12 },
  { id: "demo-2", name: "Everyday Canvas Tote", category: "Accessories", price: 1299, stock: 24 },
  { id: "demo-3", name: "Minimal Desk Lamp", category: "Home", price: 1899, stock: 8 }
];

export async function listProducts(_req, res) {
  if (mongoose.connection.readyState !== 1) return res.json(demoProducts);
  res.json(await Product.find().sort({ createdAt: -1 }));
}

export async function getProduct(req, res) {
  if (mongoose.connection.readyState !== 1 || !mongoose.isValidObjectId(req.params.id)) {
    const product = demoProducts.find((item) => item.id === req.params.id);
    return product ? res.json(product) : res.status(404).json({ message: "Product not found" });
  }
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
}

export async function createProduct(req, res) {
  const product = await Product.create(req.body);
  res.status(201).json(product);
}

export async function updateProduct(req, res) {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
}

export async function deleteProduct(req, res) {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted" });
}
