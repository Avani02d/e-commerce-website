import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function createToken(user) {
  return jwt.sign({ id: user._id.toString(), email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

export async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Name, email, and password are required" });
  if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });

  const normalizedEmail = email.toLowerCase().trim();
  if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ message: "Email is already registered" });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name: name.trim(), email: normalizedEmail, password: passwordHash });
  res.status(201).json({ user: publicUser(user), token: createToken(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase().trim() }).select("+password");
  if (!user || !(await bcrypt.compare(password || "", user.password))) return res.status(401).json({ message: "Invalid email or password" });
  res.json({ user: publicUser(user), token: createToken(user) });
}

export async function me(req, res) {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user: publicUser(user) });
}
