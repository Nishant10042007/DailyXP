const express = require('express');
const router = express.Router();
const {
  getHabits,
  getHabit,
  createHabit,
  updateHabit,
  deleteHabit,
} = require('../controllers/habitController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getHabits).post(protect, createHabit);
router.route('/:id').get(protect, getHabit).put(protect, updateHabit).delete(protect, deleteHabit);

module.exports = router;
