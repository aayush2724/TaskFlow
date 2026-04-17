import express from "express";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  updateProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";

const router = express.Router();

router.post("/register", asyncHandler(registerUser));
router.post("/login", asyncHandler(loginUser));
router.get("/me", protect, asyncHandler(getCurrentUser));
router.put("/profile", protect, asyncHandler(updateProfile));

export default router;
