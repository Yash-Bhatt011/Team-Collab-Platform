const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authenticateUser } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticateUser);

// Attendance routes
router.post('/check-in', attendanceController.checkIn);
router.post('/check-out', attendanceController.checkOut);
router.post('/break/start', attendanceController.startBreak);
router.post('/break/end', attendanceController.endBreak);
router.get('/', attendanceController.getAttendance);
router.get('/today', attendanceController.getTodayAttendance);
router.get('/analytics', attendanceController.getAttendanceAnalytics);
router.put('/:id', attendanceController.updateAttendance);

module.exports = router;