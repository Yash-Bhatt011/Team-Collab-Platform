const Task = require('../models/Task');
const Comment = require('../models/Comment');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const { status, priority, assignedTo, project, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (project) filter.project = project;
    if (req.user.role !== 'admin') {
      // Non-admin users can only see tasks assigned to them or created by them
      filter.$or = [
        { assignedTo: req.user.userId },
        { createdBy: req.user.userId },
        { watchers: req.user.userId }
      ];
    }

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('project', 'name')
      .populate('watchers', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Task.countDocuments(filter);

    res.json({
      success: true,
      data: tasks,
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

// Get single task
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email position')
      .populate('createdBy', 'name email position')
      .populate('project', 'name description')
      .populate('watchers', 'name email');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check if user has access to this task
    const isCreator = task.createdBy && task.createdBy._id.equals(req.user.userId);
    const isAssignee = task.assignedTo && task.assignedTo._id.equals(req.user.userId);
    const isWatcher = task.watchers && task.watchers.some(watcher => watcher._id.equals(req.user.userId));
    const isAdmin = req.user.role === 'admin';
    
    if (!isAdmin && !isCreator && !isAssignee && !isWatcher) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create task
exports.createTask = async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      createdBy: req.user.userId
    };

    const task = new Task(taskData);
    await task.save();

    // Fetch the fully populated task
    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    // Create activity
    await Activity.createActivity({
      user: req.user.userId,
      type: 'task_created',
      action: `created task "${task.title}"`,
      targetType: 'Task',
      targetId: task._id,
      targetName: task.title,
      project: task.project
    });

    // Create notification for assigned user
    if (task.assignedTo && !task.assignedTo.equals(req.user.userId)) {
      await Notification.create({
        recipient: task.assignedTo,
        sender: req.user.userId,
        type: 'task_assigned',
        title: 'New Task Assigned',
        message: `You have been assigned a new task: "${task.title}"`,
        data: { taskId: task._id },
        category: 'task',
        actionUrl: `/tasks/${task._id}`
      });
    }

    res.status(201).json({ success: true, data: populatedTask });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check permissions
    const isCreator = task.createdBy && task.createdBy.equals(req.user.userId);
    const isAssignee = task.assignedTo && task.assignedTo.equals(req.user.userId);
    const isAdmin = req.user.role === 'admin';
    
    // Debug logging
    console.log('Task update permission check:', {
      taskId: task._id,
      userId: req.user.userId,
      userRole: req.user.role,
      taskCreatedBy: task.createdBy,
      taskAssignedTo: task.assignedTo,
      isCreator,
      isAssignee,
      isAdmin
    });
    
    if (!isAdmin && !isCreator && !isAssignee) {
      console.log('Access denied for task update');
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const oldStatus = task.status;
    Object.assign(task, req.body);
    
    if (req.body.status === 'done' && oldStatus !== 'done') {
      task.completedDate = new Date();
    }

    await task.save();
    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');

    // Create activity
    await Activity.createActivity({
      user: req.user.userId,
      type: 'task_updated',
      action: `updated task "${task.title}"`,
      targetType: 'Task',
      targetId: task._id,
      targetName: task.title,
      project: task.project,
      metadata: { changes: req.body }
    });

    // Create notification if status changed to completed
    if (req.body.status === 'done' && oldStatus !== 'done') {
      await Notification.create({
        recipient: task.createdBy,
        sender: req.user.userId,
        type: 'task_completed',
        title: 'Task Completed',
        message: `Task "${task.title}" has been completed`,
        data: { taskId: task._id },
        category: 'task',
        actionUrl: `/tasks/${task._id}`
      });
    }

    res.json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check permissions
    const isCreator = task.createdBy && task.createdBy.equals(req.user.userId);
    const isAdmin = req.user.role === 'admin';
    
    if (!isAdmin && !isCreator) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await Task.findByIdAndDelete(req.params.id);
    
    // Delete related comments
    await Comment.deleteMany({ task: req.params.id });

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get task comments
exports.getTaskComments = async (req, res) => {
  try {
    const comments = await Comment.find({ task: req.params.id })
      .populate('author', 'name email')
      .populate('mentions', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add task comment
exports.addTaskComment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const comment = new Comment({
      content: req.body.content,
      author: req.user.userId,
      task: req.params.id,
      mentions: req.body.mentions || []
    });

    await comment.save();
    await comment.populate('author', 'name email');

    // Create activity
    await Activity.createActivity({
      user: req.user.userId,
      type: 'comment_added',
      action: `commented on task "${task.title}"`,
      targetType: 'Comment',
      targetId: comment._id,
      targetName: task.title,
      task: task._id,
      project: task.project
    });

    // Create notifications for mentions
    if (req.body.mentions && req.body.mentions.length > 0) {
      const notifications = req.body.mentions.map(userId => ({
        recipient: userId,
        sender: req.user.userId,
        type: 'mention',
        title: 'You were mentioned',
        message: `You were mentioned in a comment on task "${task.title}"`,
        data: { taskId: task._id, commentId: comment._id },
        category: 'task',
        actionUrl: `/tasks/${task._id}`
      }));
      
      await Notification.insertMany(notifications);
    }

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get task analytics
exports.getTaskAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, project } = req.query;
    const filter = {};
    
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (project) filter.project = project;
    
    if (req.user.role !== 'admin') {
      filter.$or = [
        { assignedTo: req.user.userId },
        { createdBy: req.user.userId }
      ];
    }

    const analytics = await Task.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] }
          },
          inProgressTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
          },
          todoTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'todo'] }, 1, 0] }
          },
          highPriorityTasks: {
            $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] }
          },
          averageHours: { $avg: '$actualHours' },
          totalHours: { $sum: '$actualHours' }
        }
      }
    ]);

    const statusDistribution = await Task.aggregate([
      { $match: filter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const priorityDistribution = await Task.aggregate([
      { $match: filter },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        summary: analytics[0] || {
          totalTasks: 0,
          completedTasks: 0,
          inProgressTasks: 0,
          todoTasks: 0,
          highPriorityTasks: 0,
          averageHours: 0,
          totalHours: 0
        },
        statusDistribution,
        priorityDistribution
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = exports;