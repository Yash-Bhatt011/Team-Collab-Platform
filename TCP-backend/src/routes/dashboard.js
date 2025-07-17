const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateUser } = require('../middleware/auth');

router.use(authenticateUser);

router.get('/activities', dashboardController.getActivities);
router.get('/performance-metrics', dashboardController.getPerformanceMetrics);
router.get('/dashboard-stats', dashboardController.getDashboardStats);
router.get('/recent-activities', dashboardController.getRecentActivities);
router.get('/upcoming-deadlines', dashboardController.getUpcomingDeadlines);

module.exports = router;
