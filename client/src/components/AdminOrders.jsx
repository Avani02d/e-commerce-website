import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { orderApi } from "../services/api";

const statuses = ["pending", "paid", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const { session } = useAuth();
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (session?.user.role === "admin") orderApi.adminList(session.token).then(setOrders).catch((error) => setMessage(error.message));
  }, [session]);

  if (!session || session.user.role !== "admin") return <main className="page empty"><p className="eyebrow">Admin</p><h1>Admin access required.</h1><Link className="button" to="/">Back home <span>→</span></Link></main>;

  async function changeStatus(id, status) {
    try {
      const updated = await orderApi.updateStatus(session.token, id, status);
      setOrders((current) => current.map((order) => order._id === updated._id ? updated : order));
    } catch (error) {
      setMessage(error.message);
    }
  }

  return <main className="page"><p className="eyebrow">Admin operations</p><h1>Orders.</h1><Link className="text-button" to="/admin">Back to catalog tools →</Link>{message && <p className="form-error">{message}</p>}<div className="cart-list">{!orders.length && !message && <p className="lede">No orders yet.</p>}{orders.map((order) => <div className="cart-row" key={order._id}><span>#{order._id.slice(-6)} · {order.user?.email || "Customer"}</span><strong>₹{order.total.toLocaleString("en-IN")}</strong><select value={order.status} onChange={(event) => changeStatus(order._id, event.target.value)} aria-label={`Status for order ${order._id.slice(-6)}`}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></div>)}</div></main>;
}
