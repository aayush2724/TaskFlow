import express from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  reorderTasks,
  updateTask,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.route("/").get(getTasks).post(createTask);
router.put("/reorder", reorderTasks);
router.route("/:id").put(updateTask).delete(deleteTask);

export default router;
