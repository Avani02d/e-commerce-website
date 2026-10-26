import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { orderApi } from "../services/api";

const statuses = ["pending", "paid", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const { session } = useAuth();
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    if (session?.user.role === "admin") orderApi.adminList(session.token).then(setOrders).catch((error) => setMessage(error.message));
  }, [session]);

  if (!session || session.user.role !== "admin") return <main className="page empty"><p className="eyebrow">Admin</p><h1>Admin access required.</h1><Link className="button" to="/">Back home <span>→</span></Link></main>;

  async function changeStatus(id, status) {
    try {
      const updated = await orderApi.updateStatus(session.token, id, status);
      setOrders((current) => current.map((order) => order._id === updated._id ? updated : order));
      setSelectedOrder((current) => current?._id === updated._id ? updated : current);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function viewOrder(id) {
    setDetailLoading(true);
    setMessage("");
    try {
      setSelectedOrder(await orderApi.adminGet(session.token, id));
    } catch (error) {
      setMessage(error.message);
    } finally {
      setDetailLoading(false);
    }
  }

  const normalizedQuery = query.trim().toLowerCase();
  const visibleOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const searchable = `${order._id} ${order.user?.email || ""} ${order.user?.name || ""}`.toLowerCase();
    return matchesStatus && (!normalizedQuery || searchable.includes(normalizedQuery));
  });
  const revenue = orders.reduce((sum, order) => sum + (order.status === "cancelled" ? 0 : order.total), 0);
  const openOrders = orders.filter((order) => !["delivered", "cancelled"].includes(order.status)).length;

  return <main className="page"><p className="eyebrow">Admin operations</p><h1>Orders.</h1><Link className="text-button" to="/admin">Back to catalog tools →</Link>{message && <p className="form-error">{message}</p>}<div className="admin-summary"><div><span>Total orders</span><strong>{orders.length}</strong></div><div><span>Net revenue</span><strong>₹{revenue.toLocaleString("en-IN")}</strong></div><div><span>Open orders</span><strong>{openOrders}</strong></div></div><div className="catalog-tools"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search order or customer" aria-label="Search orders" /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter orders by status"><option value="all">All statuses</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select></div><div className="cart-list">{!orders.length && !message && <p className="lede">No orders yet.</p>}{orders.length > 0 && !visibleOrders.length && <p className="lede">No matching orders.</p>}{visibleOrders.map((order) => <div className="cart-row" key={order._id}><button className="text-button" onClick={() => viewOrder(order._id)} aria-label={`View order ${order._id.slice(-6)}`}>#{order._id.slice(-6)}</button><span>{order.user?.email || "Customer"}</span><strong>₹{order.total.toLocaleString("en-IN")}</strong><select value={order.status} onChange={(event) => changeStatus(order._id, event.target.value)} aria-label={`Status for order ${order._id.slice(-6)}`}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></div>)}</div>{detailLoading && <p className="lede">Loading order details…</p>}{selectedOrder && <section className="admin-order-detail" aria-labelledby="admin-order-detail-title"><div className="section-head"><div><p className="eyebrow">Order #{selectedOrder._id.slice(-8)}</p><h2 id="admin-order-detail-title">Customer order.</h2></div><button className="text-button" onClick={() => setSelectedOrder(null)}>Close</button></div><p className="lede">{selectedOrder.user?.name || "Customer"} · {selectedOrder.user?.email || "No email"} · {selectedOrder.status}</p><p>{selectedOrder.shippingAddress.name}<br />{selectedOrder.shippingAddress.line1}{selectedOrder.shippingAddress.line2 && <><br />{selectedOrder.shippingAddress.line2}</>}<br />{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p><div className="cart-list">{selectedOrder.items.map((item, index) => <div className="cart-row" key={`${item.product}-${index}`}><span>{item.name} × {item.quantity}</span><strong>₹{(item.price * item.quantity).toLocaleString("en-IN")}</strong><span>₹{item.price.toLocaleString("en-IN")} each</span></div>)}</div><div className="cart-total"><span>Total</span><strong>₹{selectedOrder.total.toLocaleString("en-IN")}</strong></div></section>}</main>;
}
