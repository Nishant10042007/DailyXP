const Log = require('../models/Log');
const Habit = require('../models/Habit');
const User = require('../models/User');

// @desc    Get dashboard stats for the logged-in user
// @route   GET /api/stats/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all habits for the user
    const habits = await Habit.find({ user: userId });
    const habitIds = habits.map((h) => h._id);

    // Fetch all logs
    const logs = await Log.find({ user: userId, habit: { $in: habitIds } });

    // Today's completions
    const today = new Date().toDateString();
    const todayLogs = logs.filter(
      (l) => new Date(l.dateCompleted).toDateString() === today
    );

    const totalHabits = habits.length;
    const completedToday = todayLogs.length;
    const completionPercent =
      totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

    // Best current streak across all habits
    const currentStreak = habits.reduce(
      (max, h) => Math.max(max, h.currentStreak || 0),
      0
    );
    const longestStreak = habits.reduce(
      (max, h) => Math.max(max, h.longestStreak || 0),
      0
    );

    const user = await User.findById(userId).select('-password');

    res.json({
      totalHabits,
      completedToday,
      completionPercent,
      currentStreak,
      longestStreak,
      totalXP: user.totalXP,
      level: user.level,
      badges: user.badges,
      totalLogs: logs.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get heatmap data — daily completion counts for the last 365 days
// @route   GET /api/stats/heatmap
// @access  Private
const getHeatmapData = async (req, res) => {
  try {
    const userId = req.user.id;
    const since = new Date();
    since.setFullYear(since.getFullYear() - 1);

    const logs = await Log.find({
      user: userId,
      dateCompleted: { $gte: since },
    });

    // Aggregate: { "2025-04-15": 3, ... }
    const counts = {};
    for (const log of logs) {
      const d = new Date(log.dateCompleted);
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      counts[dateKey] = (counts[dateKey] || 0) + 1;
    }

    // Convert to array format for react-calendar-heatmap
    const data = Object.entries(counts).map(([date, count]) => ({
      date,
      count,
    }));

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get completion trend — past 30 days of daily totals for line chart
// @route   GET /api/stats/trend
// @access  Private
const getTrend = async (req, res) => {
  try {
    const userId = req.user.id;
    const since = new Date();
    since.setDate(since.getDate() - 29);
    since.setHours(0, 0, 0, 0);

    const logs = await Log.find({ user: userId, dateCompleted: { $gte: since } });

    // Build 30 day map
    const trend = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date(since);
      d.setDate(d.getDate() + i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      trend[key] = 0;
    }
    for (const log of logs) {
      const d = new Date(log.dateCompleted);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (trend[key] !== undefined) trend[key] += 1;
    }

    const data = Object.entries(trend).map(([date, count]) => ({ date, count }));
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats, getHeatmapData, getTrend };
