const Habit = require('../models/Habit');

// @desc    Get all habits for user
// @route   GET /api/habits
// @access  Private
const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id });
    res.status(200).json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single habit
// @route   GET /api/habits/:id
// @access  Private
const getHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Make sure the logged in user matches the habit user
    if (habit.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    res.status(200).json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a habit
// @route   POST /api/habits
// @access  Private
const createHabit = async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({ message: 'Please add a title text field' });
    }

    const difficulty = req.body.difficulty || 'medium';
    let xpValue = 20;
    if (difficulty === 'easy') xpValue = 10;
    else if (difficulty === 'hard') xpValue = 30;

    const habit = await Habit.create({
      title: req.body.title,
      description: req.body.description || '',
      frequency: req.body.frequency || 'daily',
      difficulty,
      xpValue,
      user: req.user.id,
    });

    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a habit
// @route   PUT /api/habits/:id
// @access  Private
const updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Check for user
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Make sure the logged in user matches the habit user
    if (habit.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedHabit = await Habit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updatedHabit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a habit
// @route   DELETE /api/habits/:id
// @access  Private
const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Check for user
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Make sure the logged in user matches the habit user
    if (habit.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await habit.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getHabits,
  getHabit,
  createHabit,
  updateHabit,
  deleteHabit,
};
