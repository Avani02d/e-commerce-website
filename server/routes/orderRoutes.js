import express from "express";
import { cancelOrder, createOrder, getAdminOrder, getOrder, listAllOrders, listOrders, updateOrderStatus } from "../controllers/orderController.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);
router.get("/", listOrders);
router.post("/", createOrder);
router.get("/admin", adminOnly, listAllOrders);
router.get("/admin/:id", adminOnly, getAdminOrder);
router.patch("/admin/:id/status", adminOnly, updateOrderStatus);
router.patch("/:id/cancel", cancelOrder);
router.get("/:id", getOrder);
export default router;
