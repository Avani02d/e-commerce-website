import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { orderApi } from "../services/api";

const statusSteps = ["pending", "paid", "shipped", "delivered"];

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { session } = useAuth();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session) orderApi.get(session.token, id).then(setOrder).catch((err) => setError(err.message));
  }, [session, id]);

  if (!session) return <main className="page empty"><h1>Sign in to view this order.</h1><Link className="button" to="/account">Go to account <span>→</span></Link></main>;
  if (error) return <main className="page empty"><h1>{error}</h1><Link className="button" to="/orders">Back to orders <span>→</span></Link></main>;
  if (!order) return <main className="page empty"><p className="lede">Loading order…</p></main>;

  async function cancel() {
    setSaving(true);
    try { setOrder(await orderApi.cancel(session.token, order._id)); } catch (err) { setError(err.message); } finally { setSaving(false); }
  }

  const currentStep = statusSteps.indexOf(order.status);
  return <main className="page"><p className="eyebrow">Order #{order._id.slice(-8)}</p><h1>Order details.</h1><p className="lede">Placed {new Date(order.createdAt).toLocaleDateString()} · {order.status}</p>{order.status === "cancelled" ? <div className="order-cancelled"><strong>Order cancelled</strong><span>Inventory has been released and this order will not be fulfilled.</span></div> : <div className="order-timeline" aria-label={`Order status: ${order.status}`}>{statusSteps.map((status, index) => <div className={index <= currentStep ? "timeline-step active" : "timeline-step"} key={status}><span>{index + 1}</span><small>{status}</small></div>)}</div>}<div className="cart-list">{order.items.map((item, index) => <div className="cart-row" key={`${item.product}-${index}`}><span>{item.name} × {item.quantity}</span><strong>₹{(item.price * item.quantity).toLocaleString("en-IN")}</strong><span>₹{item.price.toLocaleString("en-IN")}</span></div>)}</div><div className="cart-total"><span>Total</span><strong>₹{order.total.toLocaleString("en-IN")}</strong></div>{error && <p className="form-error">{error}</p>}{["pending", "paid"].includes(order.status) && <button className="text-button" onClick={cancel} disabled={saving}>{saving ? "Cancelling…" : "Cancel order"}</button>}<Link className="button" to="/orders">Back to orders <span>→</span></Link></main>;
}
