import DailyLog from "../models/DailyLog.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import { awardCompletion } from "../utils/gamification.js";
import { toDateKey } from "../utils/date.js";

const buildFilters = (query, userId) => {
  const filters = { user: userId };

  if (query.status && query.status !== "all") {
    filters.status = query.status;
  }
  if (query.priority && query.priority !== "all") {
    filters.priority = query.priority;
  }
  if (query.category && query.category !== "all") {
    filters.category = query.category;
  }
  if (query.search) {
    filters.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
      { tags: { $elemMatch: { $regex: query.search, $options: "i" } } },
    ];
  }

  return filters;
};

const updateDailyLog = async (userId, dateKey, changes) => {
  await DailyLog.findOneAndUpdate(
    { user: userId, date: dateKey },
    { $inc: changes },
    { upsert: true, new: true },
  );
};

const pickTaskPayload = (payload) => {
  const allowedFields = [
    "title",
    "description",
    "notes",
    "status",
    "priority",
    "category",
    "tags",
    "dueDate",
    "subtasks",
    "isRecurring",
    "recurrenceRule",
  ];

  return allowedFields.reduce((taskPayload, field) => {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      taskPayload[field] = payload[field];
    }
    return taskPayload;
  }, {});
};

export const getTasks = async (req, res) => {
  const tasks = await Task.find(buildFilters(req.query, req.user._id)).sort({
    order: 1,
    dueDate: 1,
    createdAt: -1,
  });

  return res.json({ tasks });
};

export const createTask = async (req, res) => {
  const count = await Task.countDocuments({ user: req.user._id });
  const task = await Task.create({
    ...pickTaskPayload(req.body),
    user: req.user._id,
    order: count,
    tags: req.body.tags || [],
    subtasks: req.body.subtasks || [],
  });

  await updateDailyLog(req.user._id, toDateKey(), { tasksAddedCount: 1 });

  return res.status(201).json({ task });
};

export const updateTask = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const wasCompleted = task.status === "completed";
  Object.assign(task, pickTaskPayload(req.body));

  if (req.body.status === "completed" && !wasCompleted) {
    task.completedAt = new Date();
    const today = toDateKey();
    await updateDailyLog(req.user._id, today, { tasksCompletedCount: 1 });

    const user = await User.findById(req.user._id);
    const completedTodayLog = await DailyLog.findOne({ user: req.user._id, date: today });
    const totalCompleted = await Task.countDocuments({ user: req.user._id, status: "completed" });
    const reward = awardCompletion({
      user,
      completedToday: completedTodayLog?.tasksCompletedCount || 1,
      totalCompleted,
    });
    await user.save();
    await task.save();

    return res.json({ task, reward });
  }

  if (req.body.status !== "completed") {
    task.completedAt = null;
  }

  await task.save();
  return res.json({ task });
};

export const deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  return res.json({ message: "Task deleted" });
};

export const reorderTasks = async (req, res) => {
  const { orderedIds } = req.body;

  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ message: "orderedIds must be an array" });
  }

  const updates = orderedIds.map((id, index) =>
    Task.updateOne({ _id: id, user: req.user._id }, { $set: { order: index } }),
  );

  await Promise.all(updates);
  const tasks = await Task.find({ user: req.user._id }).sort({ order: 1, dueDate: 1 });

  return res.json({ tasks });
};
