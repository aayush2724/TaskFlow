import mongoose from "mongoose";

const dailyLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
    },
    tasksCompletedCount: {
      type: Number,
      default: 0,
    },
    tasksAddedCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

dailyLogSchema.index({ user: 1, date: 1 }, { unique: true });

const DailyLog = mongoose.model("DailyLog", dailyLogSchema);

export default DailyLog;
