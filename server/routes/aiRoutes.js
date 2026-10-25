import express from "express";
import { askAI } from "../controllers/aiController.js";

const router = express.Router();
router.post("/", askAI);
export default router;
