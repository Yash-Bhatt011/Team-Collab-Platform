const express = require('express');
const router = express.Router();
const { login, verifyToken } = require('../controllers/authController');
const { authenticateUser } = require('../middleware/auth');

router.post('/login', login);
router.get('/verify', authenticateUser, verifyToken);

module.exports = router;
