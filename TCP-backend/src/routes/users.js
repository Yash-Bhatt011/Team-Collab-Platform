const express = require('express');
const router = express.Router();
const { authenticateUser, isAdmin } = require('../middleware/auth');
const usersController = require('../controllers/usersController');
const User = require('../models/User');  // Added missing import

// Profile routes
router.get('/profile', authenticateUser, usersController.getProfile);
router.put('/profile', authenticateUser, usersController.updateProfile);

// Admin routes
router.get('/all', authenticateUser, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Add new user route
router.post('/', authenticateUser, isAdmin, usersController.createUser);

// Search users (protected route)
router.get('/search', authenticateUser, usersController.searchUsers);

module.exports = router;
