const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'on-hold', 'completed', 'cancelled'],
    default: 'planning'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  team: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['member', 'lead', 'manager'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  deadline: {
    type: Date
  },
  budget: {
    allocated: {
      type: Number,
      min: 0
    },
    spent: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  client: {
    name: String,
    email: String,
    company: String,
    contact: String
  },
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    url: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better query performance
projectSchema.index({ owner: 1 });
projectSchema.index({ 'team.user': 1 });
projectSchema.index({ status: 1 });

module.exports = mongoose.model('Project', projectSchema);