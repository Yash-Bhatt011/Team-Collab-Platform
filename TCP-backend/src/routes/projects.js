const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticateUser } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticateUser);

// Project routes
router.get('/', projectController.getProjects);
router.get('/analytics', projectController.getProjectAnalytics);
router.get('/:id', projectController.getProject);
router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

// Team management routes
router.post('/:id/team', projectController.addTeamMember);
router.delete('/:id/team/:userId', projectController.removeTeamMember);

module.exports = router;