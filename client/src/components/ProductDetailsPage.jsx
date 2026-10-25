import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { productsApi } from "../services/api";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { add } = useCart();
  const { toggle, has } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    productsApi.get(id).then(setProduct).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <main className="page empty"><p className="lede">Loading product…</p></main>;
  if (error || !product) return <main className="page empty"><h1>{error || "Product not found."}</h1><Link className="button" to="/products">Back to products <span>→</span></Link></main>;

  const outOfStock = Number.isFinite(product.stock) && product.stock < 1;
  return <main className="detail-page"><div className={`detail-image ${product.tone || "ocean"}`}><span>{product.category}</span><strong>{product.name}</strong></div><div className="detail-copy"><p className="eyebrow">{product.category}</p><h1>{product.name}</h1><p className="detail-description">{product.description || "A considered everyday essential, selected for quality, comfort, and a little extra joy."}</p><strong className="detail-price">₹{product.price.toLocaleString("en-IN")}</strong><p className="lede">{outOfStock ? "Currently out of stock" : `${product.stock} available`}</p><div className="detail-actions"><button className="button" onClick={() => add(product)} disabled={outOfStock}>{outOfStock ? "Sold out" : "Add to cart"} <span>→</span></button><button className="text-button" onClick={() => toggle(product)}>{has(product.id) ? "♥ Saved" : "♡ Save to wishlist"}</button></div></div></main>;
}
