const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  checkIn: {
    time: {
      type: Date,
      required: true
    },
    location: {
      type: String,
      enum: ['office', 'remote', 'field'],
      default: 'office'
    },
    ipAddress: String,
    device: String
  },
  checkOut: {
    time: Date,
    location: {
      type: String,
      enum: ['office', 'remote', 'field'],
      default: 'office'
    },
    ipAddress: String,
    device: String
  },
  breaks: [{
    startTime: {
      type: Date,
      required: true
    },
    endTime: Date,
    type: {
      type: String,
      enum: ['lunch', 'tea', 'personal', 'meeting'],
      default: 'personal'
    },
    duration: {
      type: Number, // in minutes
      min: 0
    }
  }],
  totalHours: {
    type: Number,
    min: 0,
    default: 0
  },
  totalBreakTime: {
    type: Number, // in minutes
    min: 0,
    default: 0
  },
  overtimeHours: {
    type: Number,
    min: 0,
    default: 0
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'half-day', 'work-from-home'],
    default: 'present'
  },
  notes: {
    type: String,
    trim: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isManualEntry: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index to ensure one attendance record per user per day
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ status: 1 });

// Calculate total hours and break time before saving
attendanceSchema.pre('save', function(next) {
  if (this.checkIn.time && this.checkOut.time) {
    const totalMs = this.checkOut.time - this.checkIn.time;
    this.totalHours = totalMs / (1000 * 60 * 60); // Convert to hours
    
    // Calculate total break time
    this.totalBreakTime = this.breaks.reduce((total, breakItem) => {
      if (breakItem.endTime) {
        const breakMs = breakItem.endTime - breakItem.startTime;
        breakItem.duration = breakMs / (1000 * 60); // Convert to minutes
        return total + breakItem.duration;
      }
      return total;
    }, 0);
    
    // Subtract break time from total hours
    this.totalHours -= (this.totalBreakTime / 60);
    
    // Calculate overtime (assuming 8 hours is standard)
    if (this.totalHours > 8) {
      this.overtimeHours = this.totalHours - 8;
    }
  }
  next();
});

module.exports = mongoose.model('Attendance', attendanceSchema);