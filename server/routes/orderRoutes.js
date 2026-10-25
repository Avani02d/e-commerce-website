import express from "express";
import { createOrder, getOrder, listOrders } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);
router.get("/", listOrders);
router.post("/", createOrder);
router.get("/:id", getOrder);
export default router;
