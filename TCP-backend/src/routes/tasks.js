const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticateUser } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticateUser);

// Task routes
router.get('/', taskController.getTasks);
router.get('/analytics', taskController.getTaskAnalytics);
router.get('/:id', taskController.getTask);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

// Task comments routes
router.get('/:id/comments', taskController.getTaskComments);
router.post('/:id/comments', taskController.addTaskComment);

module.exports = router;