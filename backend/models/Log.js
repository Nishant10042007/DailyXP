const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  habit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dateCompleted: {
    type: Date,
    required: true,
    default: Date.now,
  },
  xpEarned: {
    type: Number,
    required: true,
  },
  streakAtTime: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true,
});

// Compound index to ensure a habit is only logged once per day per user
logSchema.index({ habit: 1, user: 1, dateCompleted: 1 }, { unique: false }); 

module.exports = mongoose.model('Log', logSchema);
