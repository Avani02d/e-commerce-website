import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { cartApi } from "../services/api";
import { useAuth } from "./AuthContext.jsx";
const CartContext = createContext(null);
export function CartProvider({ children }) {
  const { session } = useAuth();
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem("shopwise-cart") || "[]"));
  useEffect(() => {
    if (!session?.token) return;
    cartApi.get(session.token).then((cart) => {
      if (!cart.items?.length) return;
      const next = cart.items.filter((item) => item.product).map((item) => ({ id: item.product._id, name: item.product.name, category: item.product.category, price: item.product.price, quantity: item.quantity }));
      if (next.length) { setItems(next); localStorage.setItem("shopwise-cart", JSON.stringify(next)); }
    }).catch(() => {});
  }, [session]);
  function save(next) { setItems(next); localStorage.setItem("shopwise-cart", JSON.stringify(next)); }
  function add(product) { const existing = items.find((item) => item.id === product.id); save(existing ? items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { ...product, quantity: 1 }]); if (session?.token) cartApi.add(session.token, String(product.id)).catch(() => {}); }
  function updateQuantity(productId, quantity) { if (quantity < 1) return remove(productId); save(items.map((item) => item.id === productId ? { ...item, quantity } : item)); if (session?.token) cartApi.update(session.token, String(productId), quantity).catch(() => {}); }
  function remove(productId) { save(items.filter((item) => item.id !== productId)); if (session?.token) cartApi.remove(session.token, String(productId)).catch(() => {}); }
  function clear() { save([]); if (session?.token) cartApi.clear(session.token).catch(() => {}); }
  const value = useMemo(() => ({ items, add, updateQuantity, remove, clear, count: items.reduce((sum, item) => sum + item.quantity, 0) }), [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() { return useContext(CartContext); }
