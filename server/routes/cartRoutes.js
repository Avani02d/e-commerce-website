import express from "express";
import { addToCart, clearCart, getCart, removeFromCart, updateCartItem } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";
import { databaseRequired } from "../middleware/databaseMiddleware.js";

const router = express.Router();
router.use(protect);
router.use(databaseRequired);
router.get("/", getCart);
router.post("/items", addToCart);
router.put("/items/:productId", updateCartItem);
router.delete("/items/:productId", removeFromCart);
router.delete("/", clearCart);
export default router;
