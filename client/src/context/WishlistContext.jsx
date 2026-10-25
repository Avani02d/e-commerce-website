import { createContext, useContext, useMemo, useState } from "react";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem("shopwise-wishlist") || "[]"));
  function toggle(product) {
    const exists = items.some((item) => item.id === product.id);
    const next = exists ? items.filter((item) => item.id !== product.id) : [...items, product];
    setItems(next);
    localStorage.setItem("shopwise-wishlist", JSON.stringify(next));
  }
  const value = useMemo(() => ({ items, toggle, has: (id) => items.some((item) => item.id === id) }), [items]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() { return useContext(WishlistContext); }
