const express = require('express');
const router = express.Router();
const { getDashboardStats, getHeatmapData, getTrend } = require('../controllers/statsController');
const { protect } = require('../middleware/auth');

router.get('/dashboard', protect, getDashboardStats);
router.get('/heatmap',   protect, getHeatmapData);
router.get('/trend',     protect, getTrend);

module.exports = router;
