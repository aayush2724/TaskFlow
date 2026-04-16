import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const sanitizeUser = (user) => ({
  _id: user._id,
  email: user.email,
  profile: user.profile,
  settings: user.settings,
  gamification: user.gamification,
  badges: user.badges,
  createdAt: user.createdAt,
});

export const registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({
    email,
    password,
    profile: { name },
  });

  return res.status(201).json({
    token: signToken(user._id),
    user: sanitizeUser(user),
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email?.toLowerCase() });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  return res.json({
    token: signToken(user._id),
    user: sanitizeUser(user),
  });
};

export const getCurrentUser = async (req, res) => {
  return res.json({ user: sanitizeUser(req.user) });
};

export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  const { name, avatar, theme } = req.body;

  if (name) {
    user.profile.name = name;
  }
  if (avatar) {
    user.profile.avatar = avatar;
  }
  if (theme) {
    user.settings.theme = theme;
  }

  await user.save();

  return res.json({ user: sanitizeUser(user) });
};
