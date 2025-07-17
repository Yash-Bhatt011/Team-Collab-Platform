const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Temporary route to list all users for debugging
router.get('/list-users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users', error: error.message });
  }
});

module.exports = router;
