const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isAllDay: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['meeting', 'deadline', 'reminder', 'holiday', 'personal', 'project', 'training', 'interview'],
    default: 'meeting'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'tentative'],
      default: 'pending'
    },
    responseDate: Date
  }],
  location: {
    type: String,
    trim: true
  },
  meetingLink: {
    type: String,
    trim: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  recurrence: {
    type: {
      type: String,
      enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'],
      default: 'none'
    },
    interval: {
      type: Number,
      default: 1
    },
    endDate: Date,
    daysOfWeek: [{
      type: Number,
      min: 0,
      max: 6
    }]
  },
  reminders: [{
    type: {
      type: String,
      enum: ['email', 'notification', 'sms'],
      default: 'notification'
    },
    minutes: {
      type: Number,
      required: true
    }
  }],
  color: {
    type: String,
    default: '#3174ad'
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    url: String
  }],
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  }
}, {
  timestamps: true
});

// Index for better query performance
calendarEventSchema.index({ startDate: 1, endDate: 1 });
calendarEventSchema.index({ organizer: 1 });
calendarEventSchema.index({ 'attendees.user': 1 });
calendarEventSchema.index({ project: 1 });
calendarEventSchema.index({ type: 1 });

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);