const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateUser } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticateUser);

// Notification routes
router.get('/', notificationController.getNotifications);
router.put('/:id/read', notificationController.markAsRead);
router.put('/mark-all-read', notificationController.markAllAsRead);
router.delete('/:id', notificationController.deleteNotification);
router.get('/settings', notificationController.getNotificationSettings);
router.put('/settings', notificationController.updateNotificationSettings);

// Broadcast routes (admin only)
router.post('/broadcast', notificationController.createBroadcast);
router.get('/broadcast', notificationController.getBroadcasts);
router.delete('/broadcast/:id', notificationController.deleteBroadcast);

module.exports = router;