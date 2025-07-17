const mongoose = require('mongoose');

const privateNoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  title: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['general', 'task', 'project', 'meeting', 'idea', 'reminder', 'personal'],
    default: 'general'
  },
  tags: [{
    type: String,
    trim: true
  }],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  isReminder: {
    type: Boolean,
    default: false
  },
  reminderDate: {
    type: Date
  },
  reminderSent: {
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
  isArchived: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: '#ffffff'
  },
  isFavorite: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better query performance
privateNoteSchema.index({ user: 1, createdAt: -1 });
privateNoteSchema.index({ task: 1 });
privateNoteSchema.index({ project: 1 });
privateNoteSchema.index({ category: 1 });
privateNoteSchema.index({ isReminder: 1, reminderDate: 1 });

module.exports = mongoose.model('PrivateNote', privateNoteSchema);