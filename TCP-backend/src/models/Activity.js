const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'task_created',
      'task_updated',
      'task_completed',
      'task_assigned',
      'comment_added',
      'file_uploaded',
      'project_created',
      'project_updated',
      'user_joined',
      'user_left',
      'attendance_checked_in',
      'attendance_checked_out',
      'leave_requested',
      'leave_approved',
      'leave_rejected',
      'time_logged',
      'chat_message',
      'calendar_event_created',
      'calendar_event_updated'
    ],
    required: true
  },
  action: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  targetType: {
    type: String,
    enum: ['Task', 'Project', 'User', 'Comment', 'LeaveRequest', 'Attendance', 'TimeEntry', 'CalendarEvent', 'Chat'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  targetName: {
    type: String,
    trim: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed // For storing additional data
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  visibility: {
    type: String,
    enum: ['public', 'team', 'project', 'private'],
    default: 'public'
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

// Index for better query performance
activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ type: 1 });
activitySchema.index({ targetType: 1, targetId: 1 });
activitySchema.index({ project: 1 });
activitySchema.index({ visibility: 1 });
activitySchema.index({ createdAt: -1 });

// Static method to create activity
activitySchema.statics.createActivity = async function(data) {
  try {
    // Validate required fields
    if (!data.user || !data.type || !data.action || !data.targetType || !data.targetId) {
      throw new Error('Missing required fields for activity creation');
    }

    // Create activity with enhanced metadata
    const activity = await this.create({
      user: data.user,
      type: data.type,
      action: data.action,
      description: data.description,
      targetType: data.targetType,
      targetId: data.targetId,
      targetName: data.targetName,
      metadata: {
        ...data.metadata,
        timestamp: new Date(),
        userAgent: data.userAgent,
        ipAddress: data.ipAddress
      },
      project: data.project,
      task: data.task,
      visibility: data.visibility || 'public'
    });

    // Populate important references
    await activity.populate([
      { path: 'user', select: 'name email department position' },
      { 
        path: 'project',
        select: 'name description owner team',
        populate: { path: 'owner', select: 'name email' }
      },
      {
        path: 'task',
        select: 'title description assignedTo createdBy',
        populate: [
          { path: 'assignedTo', select: 'name email' },
          { path: 'createdBy', select: 'name email' }
        ]
      }
    ]);

    return activity;
  } catch (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
};

module.exports = mongoose.model('Activity', activitySchema);