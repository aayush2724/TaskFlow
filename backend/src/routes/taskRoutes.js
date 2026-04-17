import express from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  reorderTasks,
  updateTask,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";

const router = express.Router();

router.use(protect);
router.route("/").get(asyncHandler(getTasks)).post(asyncHandler(createTask));
router.put("/reorder", asyncHandler(reorderTasks));
router.route("/:id").put(asyncHandler(updateTask)).delete(asyncHandler(deleteTask));

export default router;
