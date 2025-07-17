const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const updateFields = { ...req.body };
    delete updateFields.password;
    delete updateFields.role;
    delete updateFields.email;

    // If there's a new password, hash it
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(req.body.password, salt);
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      department
    });

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({ success: true, data: userResponse });
  } catch (error) {
    console.error('Error creating user:', error);
    console.error(error.stack);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search users
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Search users by name or email, excluding the current user
    const users = await User.find({
      $and: [
        { _id: { $ne: req.user.userId } }, // Exclude current user
        {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    })
    .select('name email avatar role') // Only return necessary fields
    .limit(10); // Limit results

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search users'
    });
  }
};
