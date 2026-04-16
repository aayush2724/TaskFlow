import { daysBetween, toDateKey } from "./date.js";

const BADGES = [
  { key: "first-task", check: ({ totalCompleted }) => totalCompleted >= 1 },
  { key: "focused-five", check: ({ currentStreak }) => currentStreak >= 5 },
  { key: "xp-500", check: ({ xp }) => xp >= 500 },
  { key: "task-master", check: ({ totalCompleted }) => totalCompleted >= 25 },
];

export const awardCompletion = ({ user, completedToday, totalCompleted }) => {
  const today = toDateKey();
  const lastDate = user.gamification.lastCompletedDate;
  let streak = user.gamification.currentStreak || 0;

  if (!lastDate) {
    streak = 1;
  } else {
    const diff = daysBetween(lastDate, today);
    if (diff === 0) {
      streak = user.gamification.currentStreak || 1;
    } else if (diff === 1) {
      streak += 1;
    } else {
      streak = 1;
    }
  }

  const xpGain = 25 + Math.min(15, completedToday * 5);
  const xp = (user.gamification.xp || 0) + xpGain;
  const level = Math.floor(xp / 120) + 1;
  const longestStreak = Math.max(streak, user.gamification.longestStreak || 0);

  user.gamification = {
    xp,
    level,
    currentStreak: streak,
    longestStreak,
    lastCompletedDate: today,
  };

  const earned = BADGES.filter((badge) =>
    badge.check({ xp, currentStreak: streak, totalCompleted }),
  ).map((badge) => badge.key);

  user.badges = Array.from(new Set([...(user.badges || []), ...earned]));

  return {
    xp,
    level,
    currentStreak: streak,
    longestStreak,
    badges: user.badges,
    xpGain,
  };
};
