const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['sick', 'vacation', 'personal', 'maternity', 'paternity', 'emergency', 'bereavement', 'other'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalDays: {
    type: Number,
    min: 0.5,
    default: 1
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    url: String,
    description: String
  }],
  isHalfDay: {
    type: Boolean,
    default: false
  },
  halfDayPeriod: {
    type: String,
    enum: ['morning', 'afternoon'],
    required: function() {
      return this.isHalfDay;
    }
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  handoverNotes: {
    type: String,
    trim: true
  },
  coveringEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for better query performance
leaveRequestSchema.index({ employee: 1, startDate: -1 });
leaveRequestSchema.index({ status: 1 });
leaveRequestSchema.index({ approvedBy: 1 });

// Calculate total days before saving
leaveRequestSchema.pre('save', function(next) {
  if (this.startDate && this.endDate) {
    // Ensure dates are Date objects
    const startDate = new Date(this.startDate);
    const endDate = new Date(this.endDate);
    
    // Validate that end date is not before start date
    if (endDate < startDate) {
      return next(new Error('End date cannot be before start date'));
    }
    
    // Calculate the difference in milliseconds
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
    
    // Ensure minimum of 0.5 days
    if (this.isHalfDay && daysDiff === 1) {
      this.totalDays = 0.5;
    } else {
      this.totalDays = Math.max(daysDiff, 0.5);
    }
  } else {
    // Default to 1 day if dates are not provided
    this.totalDays = 1;
  }
  next();
});

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);