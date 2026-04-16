import express from "express";
import { getAnalytics, getGamification } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAnalytics);
router.get("/gamification", protect, getGamification);

export default router;
