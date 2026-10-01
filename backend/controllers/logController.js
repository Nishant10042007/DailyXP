const Log = require('../models/Log');
const Habit = require('../models/Habit');
const User = require('../models/User');

// Helper: same day check
const isSameDay = (d1, d2) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth()    === d2.getMonth()    &&
  d1.getDate()     === d2.getDate();

// Helper: check if date is exactly yesterday
const isYesterday = (dateToCheck, today = new Date()) => {
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(dateToCheck, yesterday);
};

// Badge milestone definitions (order matters — check highest first)
const BADGE_MILESTONES = [
  { streak: 100, badge: 'Legend 👑' },
  { streak: 60,  badge: 'Iron Will' },
  { streak: 30,  badge: 'Unbreakable' },
  { streak: 21,  badge: 'Habit Builder' },
  { streak: 14,  badge: 'Rising Ember' },
  { streak: 7,   badge: 'Consistency Rookie' },
  { streak: 3,   badge: 'Starter Flame 🔥' },
];

// Check if the current streak unlocks any new badge
const getNewBadge = (streak, existingBadges) => {
  for (const { streak: threshold, badge } of BADGE_MILESTONES) {
    if (streak >= threshold && !existingBadges.includes(badge)) {
      return badge; // return first newly earned badge
    }
  }
  return null;
};

// @desc    Log a habit (Complete it for the day)
// @route   POST /api/logs
// @access  Private
const logHabit = async (req, res) => {
  try {
    const { habitId } = req.body;
    const userId = req.user.id;

    // 1. Validate habit exists and belongs to user
    const habit = await Habit.findById(habitId);
    if (!habit) return res.status(404).json({ message: 'Habit not found' });
    if (habit.user.toString() !== userId)
      return res.status(401).json({ message: 'Not authorized to log this habit' });

    const today = new Date();

    // 2. Prevent double-logging the same day
    if (habit.lastLoggedDate && isSameDay(new Date(habit.lastLoggedDate), today)) {
      return res.status(400).json({ message: 'Habit already logged today' });
    }

    // 3. Streak calculation
    let newStreak = habit.currentStreak;
    if (!habit.lastLoggedDate) {
      newStreak = 1; // First ever log
    } else {
      const lastLogged = new Date(habit.lastLoggedDate);
      if (isYesterday(lastLogged, today)) {
        newStreak += 1; // Continue streak
      } else {
        newStreak = 1;  // Streak broken — reset
      }
    }

    const longestStreak = Math.max(habit.longestStreak, newStreak);

    // 4. XP = habit's xpValue (set by difficulty) × streak multiplier
    const BASE_XP = habit.xpValue || 20;
    let multiplier = 1.0;
    if (newStreak >= 30) multiplier = 3.0;
    else if (newStreak >= 7) multiplier = 2.0;
    else if (newStreak >= 3) multiplier = 1.5;

    const xpEarned = Math.floor(BASE_XP * multiplier);

    // 5. Update user XP, level, and badges
    const user = await User.findById(userId);
    user.totalXP += xpEarned;

    // Level up: every 100 XP = 1 level
    const newLevel = Math.floor(user.totalXP / 100) + 1;
    const leveledUp = newLevel > user.level;
    if (leveledUp) user.level = newLevel;

    // Award badge if newly earned at this streak milestone
    const newBadge = getNewBadge(newStreak, user.badges);
    if (newBadge) {
      user.badges.push(newBadge);
    }

    // 6. Persist all changes
    await user.save();

    habit.currentStreak = newStreak;
    habit.longestStreak = longestStreak;
    habit.lastLoggedDate = today;
    await habit.save();

    const log = await Log.create({
      habit: habitId,
      user: userId,
      xpEarned,
      streakAtTime: newStreak,
      dateCompleted: today,
    });

    res.status(201).json({
      log,
      habit,
      userStats: {
        totalXP: user.totalXP,
        level: user.level,
        xpEarned,
        leveledUp,
        newBadge,   // null if none, or badge string
        badges: user.badges,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all logs for user (optionally filtered by habitId)
// @route   GET /api/logs or GET /api/logs?habitId=xxx
// @access  Private
const getLogs = async (req, res) => {
  try {
    const query = { user: req.user.id };
    if (req.query.habitId) query.habit = req.query.habitId;

    const logs = await Log.find(query)
      .sort({ dateCompleted: -1 })
      .populate('habit', 'title difficulty xpValue');

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { logHabit, getLogs };
