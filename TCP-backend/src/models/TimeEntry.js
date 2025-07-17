const mongoose = require('mongoose');

const timeEntrySchema = new mongoose.Schema({
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
  description: {
    type: String,
    required: true,
    trim: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number, // in minutes
    min: 0
  },
  isRunning: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    enum: ['development', 'testing', 'meeting', 'documentation', 'research', 'bug-fix', 'review', 'other'],
    default: 'development'
  },
  billable: {
    type: Boolean,
    default: true
  },
  hourlyRate: {
    type: Number,
    min: 0
  },
  totalCost: {
    type: Number,
    min: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    trim: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'rejected'],
    default: 'draft'
  },
  rejectionReason: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for better query performance
timeEntrySchema.index({ user: 1, date: -1 });
timeEntrySchema.index({ task: 1 });
timeEntrySchema.index({ project: 1 });
timeEntrySchema.index({ isRunning: 1 });

// Calculate duration and total cost before saving
timeEntrySchema.pre('save', function(next) {
  if (this.startTime && this.endTime) {
    const durationMs = this.endTime - this.startTime;
    this.duration = Math.round(durationMs / (1000 * 60)); // Convert to minutes
    this.isRunning = false;
    
    // Calculate total cost if hourly rate is provided
    if (this.hourlyRate && this.duration) {
      const hours = this.duration / 60;
      this.totalCost = hours * this.hourlyRate;
    }
  } else if (this.startTime && !this.endTime) {
    this.isRunning = true;
  }
  
  // Set date from startTime if not provided
  if (this.startTime && !this.date) {
    this.date = new Date(this.startTime.getFullYear(), this.startTime.getMonth(), this.startTime.getDate());
  }
  
  next();
});

// Method to stop timer
timeEntrySchema.methods.stopTimer = function() {
  if (this.isRunning) {
    this.endTime = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

module.exports = mongoose.model('TimeEntry', timeEntrySchema);