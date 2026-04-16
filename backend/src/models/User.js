import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profile: {
      name: { type: String, required: true, trim: true },
      avatar: {
        type: String,
        default:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
      },
    },
    settings: {
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "dark",
      },
    },
    gamification: {
      xp: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      lastCompletedDate: { type: String, default: null },
      level: { type: Number, default: 1 },
    },
    badges: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function onSave(next) {
  if (!this.isModified("password")) {
    next();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = function matchPassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
