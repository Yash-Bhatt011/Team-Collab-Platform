const Notification = require('../models/Notification');
const User = require('../models/User');

// Get user notifications (including broadcast messages)
exports.getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, isRead, category, type } = req.query;
    const user = req.user.currentUser;
    
    // Get user's direct notifications
    const directFilter = { recipient: req.user.userId };
    if (isRead !== undefined) {
      directFilter.isRead = isRead === 'true';
    }
    if (category) directFilter.category = category;
    if (type) directFilter.type = type;

    // Get broadcast notifications for this user
    const broadcastFilter = { 
      broadcast: true,
      $or: [
        { broadcastTarget: 'all' },
        { broadcastTarget: user.role === 'admin' ? 'admins' : 'employees' }
      ]
    };
    
    // If user has a department, include department broadcasts
    if (user.department) {
      broadcastFilter.$or.push({ 
        broadcastTarget: 'department', 
        department: user.department 
      });
    }
    
    if (isRead !== undefined) {
      broadcastFilter.isRead = isRead === 'true';
    }
    if (category) broadcastFilter.category = category;
    if (type) broadcastFilter.type = type;

    // Combine direct and broadcast notifications
    const [directNotifications, broadcastNotifications] = await Promise.all([
      Notification.find(directFilter)
        .populate('sender', 'name email department position')
        .populate('recipient', 'name email department position')
        .sort({ createdAt: -1 }),
      Notification.find(broadcastFilter)
        .populate('sender', 'name email department position')
        .sort({ createdAt: -1 })
    ]);

    // Combine and sort all notifications
    const allNotifications = [...directNotifications, ...broadcastNotifications]
      .sort((a, b) => b.createdAt - a.createdAt);

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedNotifications = allNotifications.slice(startIndex, endIndex);

    // Count unread notifications
    const unreadCount = allNotifications.filter(notification => !notification.isRead).length;

    res.json({
      success: true,
      data: paginatedNotifications,
      unreadCount,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(allNotifications.length / limit),
        total: allNotifications.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create broadcast notification (admin only)
exports.createBroadcast = async (req, res) => {
  try {
    const { title, message, type, priority, broadcastTarget, department, actionRequired, actionUrl, expiresAt } = req.body;
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can create broadcast notifications'
      });
    }

    // Validate required fields
    if (!title || !message || !type || !broadcastTarget) {
      return res.status(400).json({
        success: false,
        message: 'Title, message, type, and broadcast target are required'
      });
    }

    // Validate broadcast target
    if (broadcastTarget === 'department' && !department) {
      return res.status(400).json({
        success: false,
        message: 'Department is required when targeting specific department'
      });
    }

    // Create the broadcast notification
    const broadcastNotification = new Notification({
      sender: req.user.userId,
      broadcast: true,
      broadcastTarget,
      department: broadcastTarget === 'department' ? department : undefined,
      type,
      title,
      message,
      priority: priority || 'medium',
      category: 'broadcast',
      actionRequired: actionRequired || false,
      actionUrl,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined
    });

    await broadcastNotification.save();

    // Populate sender information
    await broadcastNotification.populate('sender', 'name email');

    res.status(201).json({
      success: true,
      message: 'Broadcast notification created successfully',
      data: broadcastNotification
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get broadcast notifications (admin only)
exports.getBroadcasts = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can view broadcast notifications'
      });
    }

    const { page = 1, limit = 20 } = req.query;
    
    const broadcasts = await Notification.find({ broadcast: true })
      .populate('sender', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments({ broadcast: true });

    res.json({
      success: true,
      data: broadcasts,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete broadcast notification (admin only)
exports.deleteBroadcast = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete broadcast notifications'
      });
    }

    const broadcast = await Notification.findOneAndDelete({
      _id: req.params.id,
      broadcast: true
    });

    if (!broadcast) {
      return res.status(404).json({
        success: false,
        message: 'Broadcast notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Broadcast notification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      $or: [
        { recipient: req.user.userId },
        { broadcast: true } // Allow marking broadcast notifications as read
      ]
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.markAsRead();

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const user = req.user.currentUser;
    
    // Get broadcast conditions for this user
    const broadcastConditions = [
      { broadcastTarget: 'all' },
      { broadcastTarget: user.role === 'admin' ? 'admins' : 'employees' }
    ];
    
    if (user.department) {
      broadcastConditions.push({ 
        broadcastTarget: 'department', 
        department: user.department 
      });
    }

    await Notification.updateMany(
      {
        $or: [
          { recipient: req.user.userId, isRead: false },
          { 
            broadcast: true, 
            isRead: false,
            $or: broadcastConditions
          }
        ]
      },
      { isRead: true, readAt: new Date() }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user.userId
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get notification settings
exports.getNotificationSettings = async (req, res) => {
  try {
    // This would typically come from a user settings model
    // For now, return default settings
    const settings = {
      email: {
        taskAssigned: true,
        taskCompleted: true,
        leaveApproved: true,
        mentions: true,
        deadlineReminders: true,
        broadcasts: true
      },
      push: {
        taskAssigned: true,
        taskCompleted: false,
        leaveApproved: true,
        mentions: true,
        deadlineReminders: true,
        broadcasts: true
      },
      inApp: {
        taskAssigned: true,
        taskCompleted: true,
        leaveApproved: true,
        mentions: true,
        deadlineReminders: true,
        chatMessages: true,
        broadcasts: true
      }
    };

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update notification settings
exports.updateNotificationSettings = async (req, res) => {
  try {
    // This would typically update a user settings model
    // For now, just return success
    res.json({
      success: true,
      message: 'Notification settings updated successfully',
      data: req.body
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create notification (internal use)
exports.createNotification = async (notificationData) => {
  try {
    const notification = new Notification(notificationData);
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

module.exports = exports;