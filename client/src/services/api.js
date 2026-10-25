const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, { headers: { "Content-Type": "application/json", ...options.headers }, ...options });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Something went wrong");
  return data;
}
export const authApi = {
  register: (payload) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  me: (token) => request("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
};
export const cartApi = {
  get: (token) => request("/cart", { headers: { Authorization: `Bearer ${token}` } }),
  add: (token, productId, quantity = 1) => request("/cart/items", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ productId, quantity }) }),
  update: (token, productId, quantity) => request(`/cart/items/${productId}`, { method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ quantity }) }),
  remove: (token, productId) => request(`/cart/items/${productId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }),
  clear: (token) => request("/cart", { method: "DELETE", headers: { Authorization: `Bearer ${token}` } })
};
export const askAI = (message) => request("/ai", { method: "POST", body: JSON.stringify({ message }) });
function normalizeProduct(product) { return product ? { ...product, id: product.id || product._id } : product; }
export const productsApi = { list: async () => (await request("/products")).map(normalizeProduct), get: async (id) => normalizeProduct(await request(`/products/${id}`)), create: async (token, payload) => normalizeProduct(await request("/products", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) })), update: async (token, id, payload) => normalizeProduct(await request(`/products/${id}`, { method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) })), remove: (token, id) => request(`/products/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }) };
export const orderApi = {
  list: (token) => request("/orders", { headers: { Authorization: `Bearer ${token}` } }),
  create: (token, payload) => request("/orders", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) }),
  get: (token, id) => request(`/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
  cancel: (token, id) => request(`/orders/${id}/cancel`, { method: "PATCH", headers: { Authorization: `Bearer ${token}` } }),
  adminList: (token) => request("/orders/admin", { headers: { Authorization: `Bearer ${token}` } }),
  updateStatus: (token, id, status) => request(`/orders/admin/${id}/status`, { method: "PATCH", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) })
};
export const paymentApi = {
  createOrder: (token, amountInPaise) => request("/payments/create-order", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ amount: amountInPaise }) }),
  verify: (token, payload) => request("/payments/verify", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) })
};
