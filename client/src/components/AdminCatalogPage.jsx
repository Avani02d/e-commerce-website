import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { productsApi } from "../services/api";

const emptyForm = { name: "", category: "", price: "", stock: "", description: "" };

export default function AdminCatalogPage() {
  const { session } = useAuth();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (session?.user.role === "admin") productsApi.list().then(setItems).catch((error) => setMessage(error.message));
  }, [session]);

  if (!session || session.user.role !== "admin") return <main className="page empty"><p className="eyebrow">Admin</p><h1>Admin access required.</h1><Link className="button" to="/">Back home <span>→</span></Link></main>;

  function startEditing(item) {
    setEditing(item._id || item.id);
    setForm({ name: item.name, category: item.category, price: item.price, stock: item.stock, description: item.description || "" });
    setMessage("");
  }

  async function save(event) {
    event.preventDefault();
    try {
      const updated = await productsApi.update(session.token, editing, { ...form, price: Number(form.price), stock: Number(form.stock) });
      setItems((current) => current.map((item) => (item._id || item.id) === editing ? updated : item));
      setEditing(null);
      setForm(emptyForm);
      setMessage("Product updated successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete this product from the catalog?")) return;
    setRemovingId(id);
    setMessage("");
    try {
      await productsApi.remove(session.token, id);
      setItems((current) => current.filter((item) => (item._id || item.id) !== id));
      setMessage("Product deleted successfully.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setRemovingId(null);
    }
  }

  return <main className="page"><p className="eyebrow">Catalog management</p><h1>Products.</h1><div className="admin-links"><Link className="button" to="/admin">Add product <span>→</span></Link><Link className="text-button" to="/admin/orders">Manage orders →</Link></div>{message && <p className={message.includes("successfully") ? "success-message" : "form-error"}>{message}</p>}{editing && <form className="admin-edit-form" onSubmit={save}><h2>Edit product</h2><label>Name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label><label>Category<input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} required /></label><label>Price<input type="number" min="0" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required /></label><label>Stock<input type="number" min="0" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} required /></label><label>Description<input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label><button className="button" type="submit">Save changes <span>→</span></button><button className="text-button" type="button" onClick={() => setEditing(null)}>Cancel</button></form>}<div className="cart-list">{items.map((item) => { const id = item._id || item.id; return <div className="cart-row" key={id}><span>{item.name} · {item.category} · {item.stock} in stock</span><strong>₹{item.price.toLocaleString("en-IN")}</strong><button onClick={() => startEditing(item)}>Edit</button><button onClick={() => remove(id)} disabled={removingId === id}>{removingId === id ? "Deleting…" : "Delete"}</button></div>; })}</div></main>;
}
