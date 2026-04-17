import express from "express";
import { getAnalytics, getGamification } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";

const router = express.Router();

router.get("/", protect, asyncHandler(getAnalytics));
router.get("/gamification", protect, asyncHandler(getGamification));

export default router;
