const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  level: {
    type: Number,
    default: 1,
  },
  totalXP: {
    type: Number,
    default: 0,
  },
  badges: [{
    type: String,
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
