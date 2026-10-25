import crypto from "node:crypto";
import Razorpay from "razorpay";

function getClient() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return null;
  return new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
}

export async function createPaymentOrder(req, res) {
  if (process.env.PAYMENT_MODE === "mock") {
    const amount = Number(req.body?.amount);
    if (!Number.isInteger(amount) || amount < 1) return res.status(400).json({ message: "Amount must be a positive integer in paise" });
    return res.status(201).json({ orderId: `mock_${Date.now()}`, amount, currency: "INR", keyId: "mock" });
  }
  const client = getClient();
  if (!client) return res.status(503).json({ message: "Razorpay is not configured" });
  const amount = Number(req.body?.amount);
  if (!Number.isInteger(amount) || amount < 1) return res.status(400).json({ message: "Amount must be a positive integer in paise" });
  const order = await client.orders.create({ amount, currency: "INR", receipt: `shopwise-${req.user.id}-${Date.now()}` });
  res.status(201).json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID });
}

export function verifyPayment(req, res) {
  if (process.env.PAYMENT_MODE === "mock") return res.json({ verified: true, paymentId: req.body?.paymentId || "mock_payment" });
  const { orderId, paymentId, signature } = req.body || {};
  if (!orderId || !paymentId || !signature || !process.env.RAZORPAY_KEY_SECRET) return res.status(400).json({ message: "Incomplete payment verification data" });
  const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest("hex");
  if (expected.length !== signature.length || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return res.status(400).json({ message: "Invalid payment signature" });
  res.json({ verified: true, paymentId });
}
