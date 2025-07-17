const Attendance = require('../models/Attendance');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');

// Check in
exports.checkIn = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({
      user: req.user.userId,
      date: { $gte: today, $lt: tomorrow }
    });

    if (existingAttendance && existingAttendance.checkIn.time) {
      return res.status(400).json({
        success: false,
        message: 'Already checked in today',
        data: existingAttendance
      });
    }

    const checkInData = {
      time: new Date(),
      location: req.body.location || 'office',
      ipAddress: req.ip,
      device: req.get('User-Agent')
    };

    let attendance;
    if (existingAttendance) {
      existingAttendance.checkIn = checkInData;
      attendance = await existingAttendance.save();
    } else {
      attendance = new Attendance({
        user: req.user.userId,
        date: today,
        checkIn: checkInData
      });
      await attendance.save();
    }

    await attendance.populate('user', 'name email');

    // Create activity
    await Activity.createActivity({
      user: req.user.userId,
      type: 'attendance_checked_in',
      action: 'checked in',
      targetType: 'Attendance',
      targetId: attendance._id,
      targetName: `Check-in at ${checkInData.time.toLocaleTimeString()}`,
      metadata: { location: checkInData.location }
    });

    res.json({
      success: true,
      message: 'Checked in successfully',
      data: attendance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Check out
exports.checkOut = async (req, res) => {
  try {
    const userId = req.user?.userId;
    console.log('CheckOut userId:', userId);
    console.log('CheckOut req.body:', req.body);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await Attendance.findOne({
      user: req.user.userId,
      date: { $gte: today, $lt: tomorrow }
    });

    if (!attendance || !attendance.checkIn.time) {
      return res.status(400).json({
        success: false,
        message: 'No check-in record found for today'
      });
    }

    if (attendance.checkOut.time) {
      return res.status(400).json({
        success: false,
        message: 'Already checked out today'
      });
    }

    attendance.checkOut = {
      time: new Date(),
      location: req.body.location || 'office',
      ipAddress: req.ip,
      device: req.get('User-Agent')
    };

    await attendance.save();
    await attendance.populate('user', 'name email');

    // Create activity
    await Activity.createActivity({
      user: req.user.userId,
      type: 'attendance_checked_out',
      action: 'checked out',
      targetType: 'Attendance',
      targetId: attendance._id,
      targetName: `Check-out at ${attendance.checkOut.time.toLocaleTimeString()}`,
      metadata: { 
        location: attendance.checkOut.location,
        totalHours: attendance.totalHours
      }
    });

    res.json({
      success: true,
      message: 'Checked out successfully',
      data: attendance
    });
  } catch (error) {
    console.error('Check-out error:', error);
    res.status(500).json({ success: false, message: 'Server error during check-out' });
  }
};

// Start break
exports.startBreak = async (req, res) => {
  try {
    const userId = req.user?.userId;
    console.log('StartBreak userId:', userId);
    console.log('StartBreak req.body:', req.body);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const { type } = req.body;
    if (!type) {
      return res.status(400).json({ success: false, message: 'Break type is required' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await Attendance.findOne({
      user: req.user.userId,
      date: { $gte: today, $lt: tomorrow }
    });

    if (!attendance || !attendance.checkIn.time) {
      return res.status(400).json({
        success: false,
        message: 'Please check in first'
      });
    }

    // Check if there's an ongoing break
    const ongoingBreak = attendance.breaks.find(b => !b.endTime);
    if (ongoingBreak) {
      return res.status(400).json({
        success: false,
        message: 'Break already in progress'
      });
    }

    attendance.breaks.push({
      startTime: new Date(),
      type: req.body.type || 'personal'
    });

    await attendance.save();

    res.json({
      success: true,
      message: 'Break started successfully',
      data: attendance
    });
  } catch (error) {
    console.error('Start break error:', error);
    res.status(500).json({ success: false, message: 'Server error during break start' });
  }
};

// End break
exports.endBreak = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await Attendance.findOne({
      user: req.user.userId,
      date: { $gte: today, $lt: tomorrow }
    });

    if (!attendance) {
      return res.status(400).json({
        success: false,
        message: 'No attendance record found'
      });
    }

    const ongoingBreak = attendance.breaks.find(b => !b.endTime);
    if (!ongoingBreak) {
      return res.status(400).json({
        success: false,
        message: 'No ongoing break found'
      });
    }

    ongoingBreak.endTime = new Date();
    await attendance.save();

    res.json({
      success: true,
      message: 'Break ended successfully',
      data: attendance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get attendance records
exports.getAttendance = async (req, res) => {
  try {
    const { startDate, endDate, userId, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Non-admin users can only see their own attendance
    if (req.user.role !== 'admin') {
      filter.user = req.user.userId;
    } else if (userId) {
      filter.user = userId;
    }

    const attendance = await Attendance.find(filter)
      .populate('user', 'name email position')
      .populate('approvedBy', 'name email')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Attendance.countDocuments(filter);

    res.json({
      success: true,
      data: attendance,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get today's attendance
exports.getTodayAttendance = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await Attendance.findOne({
      user: req.user.userId,
      date: { $gte: today, $lt: tomorrow }
    }).populate('user', 'name email');

    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get attendance analytics
exports.getAttendanceAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;
    const filter = {};

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (req.user.role !== 'admin') {
      filter.user = req.user.userId;
    } else if (userId) {
      filter.user = userId;
    }

    const analytics = await Attendance.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalDays: { $sum: 1 },
          presentDays: {
            $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] }
          },
          absentDays: {
            $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] }
          },
          lateDays: {
            $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] }
          },
          totalHours: { $sum: '$totalHours' },
          totalOvertimeHours: { $sum: '$overtimeHours' },
          averageHours: { $avg: '$totalHours' },
          totalBreakTime: { $sum: '$totalBreakTime' }
        }
      }
    ]);

    const monthlyStats = await Attendance.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          totalDays: { $sum: 1 },
          totalHours: { $sum: '$totalHours' },
          presentDays: {
            $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        summary: analytics[0] || {
          totalDays: 0,
          presentDays: 0,
          absentDays: 0,
          lateDays: 0,
          totalHours: 0,
          totalOvertimeHours: 0,
          averageHours: 0,
          totalBreakTime: 0
        },
        monthlyStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update attendance (admin only)
exports.updateAttendance = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    Object.assign(attendance, req.body);
    attendance.approvedBy = req.user.userId;
    attendance.isManualEntry = true;

    await attendance.save();
    await attendance.populate('user', 'name email');

    res.json({
      success: true,
      message: 'Attendance updated successfully',
      data: attendance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = exports;