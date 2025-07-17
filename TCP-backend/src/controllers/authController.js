const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, position } = req.body;
    console.log('Starting signup process for:', email);

    // Validation logging
    console.log('Validating user data:', { name, email, position });

    // Create user with error handling
    const user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      position,
      role: email === process.env.ADMIN_EMAIL ? 'admin' : 'employee'
    });

    // Save with explicit error handling
    try {
      await user.save();
      console.log('User saved successfully:', user._id);
    } catch (saveError) {
      console.error('Error saving user:', saveError);
      if (saveError.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
      throw saveError;
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        position: user.position
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating user',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    console.log('Login attempt received:', { email, role });

    // Validate input
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, password and role'
      });
    }

    const user = await User.findOne({ email });
    console.log('User found:', user ? 'yes' : 'no');

    if (!user) {
      console.log('Login failed: user not found');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Login failed: invalid password');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Only enforce strict role for admin
    if (role === 'admin' && user.role !== 'admin') {
      console.log(`Login failed: admin role required, user role is ${user.role}`);
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: admin access required'
      });
    }
    // For employee, allow login if user.role is employee
    if (role === 'employee' && user.role !== 'employee') {
      console.log(`Login failed: employee role required, user role is ${user.role}`);
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: employee access required'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful for:', email);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        position: user.position
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.protect = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
