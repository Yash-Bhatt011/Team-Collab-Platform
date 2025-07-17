const Activity = require('../models/Activity');

exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate('user', 'name email')
      .populate({
        path: 'project',
        select: 'name description',
        populate: { path: 'owner', select: 'name email' }
      })
      .populate({
        path: 'task',
        select: 'title description status',
        populate: [
          { path: 'assignedTo', select: 'name email' },
          { path: 'createdBy', select: 'name email' }
        ]
      })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPerformanceMetrics = async (req, res) => {
  try {
    // Placeholder data, replace with real calculations
    const metrics = {
      teamProductivityScore: 78,
      projectSuccessRate: 92,
    };
    res.json({ success: true, data: metrics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    // Placeholder data, replace with real stats
    const stats = {
      overview: {
        totalUsers: 50,
        activeUsers: 45,
        completedTasks: 120,
        pendingTasks: 30,
      },
      projectMetrics: {
        onTrack: 12,
        delayed: 3,
        completed: 8,
      },
      attendance: {
        present: 40,
        remote: 5,
      },
      resourceUtilization: {
        Development: 80,
        Design: 70,
        Marketing: 60,
      },
    };
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRecentActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate('user', 'name email')
      .populate({
        path: 'project',
        select: 'name description',
        populate: { path: 'owner', select: 'name email' }
      })
      .populate({
        path: 'task',
        select: 'title description status',
        populate: [
          { path: 'assignedTo', select: 'name email' },
          { path: 'createdBy', select: 'name email' }
        ]
      })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUpcomingDeadlines = async (req, res) => {
  try {
    // Placeholder data, replace with real deadlines
    const deadlines = [
      { id: 1, task: 'Design Homepage', assignee: 'Alice', dueDate: '2024-07-10', status: 'on-time' },
      { id: 2, task: 'Develop API', assignee: 'Bob', dueDate: '2024-07-15', status: 'overdue' },
    ];
    res.json({ success: true, data: deadlines });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
