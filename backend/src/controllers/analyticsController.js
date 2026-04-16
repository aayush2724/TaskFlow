import DailyLog from "../models/DailyLog.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import { toDateKey } from "../utils/date.js";

export const getAnalytics = async (req, res) => {
  const [tasks, logs, user] = await Promise.all([
    Task.find({ user: req.user._id }).sort({ dueDate: 1 }),
    DailyLog.find({ user: req.user._id }).sort({ date: 1 }),
    User.findById(req.user._id).select("gamification badges"),
  ]);

  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === "completed").length;
  const pending = tasks.filter((task) => task.status === "pending").length;
  const overdue = tasks.filter(
    (task) => task.status !== "completed" && task.dueDate && new Date(task.dueDate) < new Date(),
  ).length;

  const categoryMap = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {});

  const completionTrend = logs.map((log) => ({
    date: log.date,
    completed: log.tasksCompletedCount,
    added: log.tasksAddedCount,
  }));

  const priorityMix = ["High", "Medium", "Low"].map((priority) => ({
    name: priority,
    value: tasks.filter((task) => task.priority === priority).length,
  }));

  return res.json({
    overview: {
      total,
      completed,
      pending,
      overdue,
      completionRate: total ? Math.round((completed / total) * 100) : 0,
      today: toDateKey(),
    },
    streaks: user.gamification,
    badges: user.badges,
    completionTrend,
    priorityMix,
    categoryBreakdown: Object.entries(categoryMap).map(([name, value]) => ({ name, value })),
    heatmap: logs.map((log) => ({
      date: log.date,
      count: log.tasksCompletedCount,
    })),
  });
};

export const getGamification = async (req, res) => {
  const user = await User.findById(req.user._id).select("gamification badges");
  return res.json({
    gamification: user.gamification,
    badges: user.badges,
  });
};
