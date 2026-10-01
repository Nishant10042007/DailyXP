const express = require('express');
const router = express.Router();
const { logHabit, getLogs } = require('../controllers/logController');
const { protect } = require('../middleware/auth');

router.route('/').post(protect, logHabit).get(protect, getLogs);

module.exports = router;
