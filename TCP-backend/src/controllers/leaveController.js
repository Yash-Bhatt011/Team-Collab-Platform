const LeaveRequest = require('../models/LeaveRequest');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Create leave request
exports.createLeaveRequest = async (req, res) => {
  try {
    console.log('Creating leave request with data:', req.body);
    console.log('User ID from token:', req.user.userId);
    
    const leaveRequest = new LeaveRequest({
      ...req.body,
      employee: req.user.userId
    });

    console.log('Leave request object before save:', leaveRequest);

    await leaveRequest.save();
    await leaveRequest.populate('employee', 'name email position');

    console.log('Leave request saved successfully:', leaveRequest._id);

    // Create activity
    await Activity.createActivity({
      user: req.user.userId,
      type: 'leave_requested',
      action: `requested ${req.body.type} leave`,
      targetType: 'LeaveRequest',
      targetId: leaveRequest._id,
      targetName: `${req.body.type} leave from ${req.body.startDate} to ${req.body.endDate}`,
      metadata: { 
        type: req.body.type,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        totalDays: leaveRequest.totalDays
      }
    });

    console.log('Activity created successfully');

    // Notify admins about new leave request
    const admins = await User.find({ role: 'admin' });
    console.log('Found admins:', admins.length);
    
    const notifications = admins.map(admin => ({
      recipient: admin._id,
      sender: req.user.userId,
      type: 'leave_request',
      title: 'New Leave Request',
      message: `${leaveRequest.employee.name} has requested ${req.body.type} leave`,
      data: { leaveRequestId: leaveRequest._id },
      category: 'leave',
      actionRequired: true,
      actionUrl: `/admin/leave-requests/${leaveRequest._id}`
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
      console.log('Notifications created successfully');
    }

    res.status(201).json({
      success: true,
      message: 'Leave request submitted successfully',
      data: leaveRequest
    });
  } catch (error) {
    console.error('Error creating leave request:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get leave requests
exports.getLeaveRequests = async (req, res) => {
  try {
    const { status, type, employee, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (type) filter.type = type;
    
    // Non-admin users can only see their own leave requests
    if (req.user.role !== 'admin') {
      filter.employee = req.user.userId;
    } else if (employee) {
      filter.employee = employee;
    }

    const leaveRequests = await LeaveRequest.find(filter)
      .populate('employee', 'name email position')
      .populate('approvedBy', 'name email')
      .populate('coveringEmployee', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await LeaveRequest.countDocuments(filter);

    res.json({
      success: true,
      data: leaveRequests,
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

// Get single leave request
exports.getLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id)
      .populate('employee', 'name email position')
      .populate('approvedBy', 'name email')
      .populate('coveringEmployee', 'name email')
      .populate('comments.author', 'name email');

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    // Check access permissions
    if (req.user.role !== 'admin' && !leaveRequest.employee._id.equals(req.user.userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({ success: true, data: leaveRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update leave request status (admin only)
exports.updateLeaveRequestStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const { status, rejectionReason } = req.body;
    const leaveRequest = await LeaveRequest.findById(req.params.id)
      .populate('employee', 'name email');

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    if (leaveRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Leave request has already been processed'
      });
    }

    leaveRequest.status = status;
    leaveRequest.approvedBy = req.user.userId;
    leaveRequest.approvedAt = new Date();
    
    if (status === 'rejected' && rejectionReason) {
      leaveRequest.rejectionReason = rejectionReason;
    }

    await leaveRequest.save();

    // Create activity
    await Activity.createActivity({
      user: req.user.userId,
      type: status === 'approved' ? 'leave_approved' : 'leave_rejected',
      action: `${status} leave request`,
      targetType: 'LeaveRequest',
      targetId: leaveRequest._id,
      targetName: `${leaveRequest.type} leave request`,
      metadata: { 
        employeeName: leaveRequest.employee.name,
        status,
        rejectionReason
      }
    });

    // Notify employee about decision
    await Notification.create({
      recipient: leaveRequest.employee._id,
      sender: req.user.userId,
      type: status === 'approved' ? 'leave_approved' : 'leave_rejected',
      title: `Leave Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: status === 'approved' 
        ? 'Your leave request has been approved'
        : `Your leave request has been rejected${rejectionReason ? ': ' + rejectionReason : ''}`,
      data: { leaveRequestId: leaveRequest._id },
      category: 'leave',
      actionUrl: `/leave-requests/${leaveRequest._id}`
    });

    res.json({
      success: true,
      message: `Leave request ${status} successfully`,
      data: leaveRequest
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add comment to leave request
exports.addLeaveComment = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id);
    
    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    // Check access permissions
    if (req.user.role !== 'admin' && !leaveRequest.employee.equals(req.user.userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    leaveRequest.comments.push({
      author: req.user.userId,
      content: req.body.content
    });

    await leaveRequest.save();
    await leaveRequest.populate('comments.author', 'name email');

    res.json({
      success: true,
      message: 'Comment added successfully',
      data: leaveRequest
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel leave request
exports.cancelLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id);
    
    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    // Only employee can cancel their own request and only if it's pending
    if (!leaveRequest.employee.equals(req.user.userId)) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own leave requests'
      });
    }

    if (leaveRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a processed leave request'
      });
    }

    leaveRequest.status = 'cancelled';
    await leaveRequest.save();

    res.json({
      success: true,
      message: 'Leave request cancelled successfully',
      data: leaveRequest
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get leave analytics
exports.getLeaveAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, employee } = req.query;
    const filter = {};

    if (startDate && endDate) {
      filter.startDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (req.user.role !== 'admin') {
      filter.employee = req.user.userId;
    } else if (employee) {
      filter.employee = employee;
    }

    const analytics = await LeaveRequest.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalRequests: { $sum: 1 },
          approvedRequests: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
          },
          rejectedRequests: {
            $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
          },
          pendingRequests: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          totalDaysRequested: { $sum: '$totalDays' },
          totalDaysApproved: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'approved'] },
                '$totalDays',
                0
              ]
            }
          }
        }
      }
    ]);

    const typeDistribution = await LeaveRequest.aggregate([
      { $match: filter },
      { $group: { _id: '$type', count: { $sum: 1 }, totalDays: { $sum: '$totalDays' } } }
    ]);

    const monthlyStats = await LeaveRequest.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: '$startDate' },
            month: { $month: '$startDate' }
          },
          totalRequests: { $sum: 1 },
          totalDays: { $sum: '$totalDays' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        summary: analytics[0] || {
          totalRequests: 0,
          approvedRequests: 0,
          rejectedRequests: 0,
          pendingRequests: 0,
          totalDaysRequested: 0,
          totalDaysApproved: 0
        },
        typeDistribution,
        monthlyStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = exports;