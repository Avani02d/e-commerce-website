import express from "express";
import { login, me, register } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { databaseRequired } from "../middleware/databaseMiddleware.js";

const router = express.Router();
router.use(databaseRequired);
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);
export default router;
