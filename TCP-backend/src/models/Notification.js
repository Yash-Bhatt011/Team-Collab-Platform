const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return !this.broadcast; // recipient is required only for non-broadcast notifications
    }
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  broadcast: {
    type: Boolean,
    default: false
  },
  broadcastTarget: {
    type: String,
    enum: ['all', 'employees', 'admins', 'department'],
    required: function() {
      return this.broadcast === true;
    }
  },
  department: {
    type: String,
    required: function() {
      return this.broadcast === true && this.broadcastTarget === 'department';
    }
  },
  type: {
    type: String,
    enum: [
      'task_assigned',
      'task_updated',
      'task_completed',
      'task_overdue',
      'comment_added',
      'mention',
      'leave_request',
      'leave_approved',
      'leave_rejected',
      'attendance_reminder',
      'project_update',
      'deadline_approaching',
      'system_announcement',
      'chat_message',
      'broadcast_announcement',
      'broadcast_reminder',
      'broadcast_urgent',
      'broadcast_general'
    ],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed // For storing additional data like task ID, project ID, etc.
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  actionRequired: {
    type: Boolean,
    default: false
  },
  actionUrl: {
    type: String,
    trim: true
  },
  expiresAt: {
    type: Date
  },
  category: {
    type: String,
    enum: ['task', 'project', 'attendance', 'leave', 'system', 'chat', 'broadcast'],
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ broadcast: 1, broadcastTarget: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Mark as read method
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Notification', notificationSchema);