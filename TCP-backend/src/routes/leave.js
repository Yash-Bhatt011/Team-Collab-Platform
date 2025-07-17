const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { authenticateUser } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticateUser);

// Leave request routes
router.get('/', leaveController.getLeaveRequests);
router.get('/analytics', leaveController.getLeaveAnalytics);
router.get('/:id', leaveController.getLeaveRequest);
router.post('/', leaveController.createLeaveRequest);
router.put('/:id/status', leaveController.updateLeaveRequestStatus);
router.post('/:id/comments', leaveController.addLeaveComment);
router.put('/:id/cancel', leaveController.cancelLeaveRequest);

module.exports = router;