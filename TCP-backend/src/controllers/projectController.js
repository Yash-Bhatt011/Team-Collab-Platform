const Project = require('../models/Project');
const Task = require('../models/Task');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');

// Get all projects
exports.getProjects = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    
    // Non-admin users can only see projects they're part of
    if (req.user.role !== 'admin') {
      filter.$or = [
        { owner: req.user.userId },
        { 'team.user': req.user.userId }
      ];
    }

    const projects = await Project.find(filter)
      .populate('owner', 'name email')
      .populate('team.user', 'name email position')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Project.countDocuments(filter);

    res.json({
      success: true,
      data: projects,
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

// Get single project
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email position')
      .populate('team.user', 'name email position');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if user has access to this project
    const hasAccess = req.user.role === 'admin' || 
                     project.owner._id.equals(req.user.userId) ||
                     project.team.some(member => member.user._id.equals(req.user.userId));

    if (!hasAccess) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Get project tasks
    const tasks = await Task.find({ project: req.params.id })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    // Calculate project statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'done').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
    const todoTasks = tasks.filter(task => task.status === 'todo').length;

    const projectData = {
      ...project.toObject(),
      tasks,
      statistics: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      }
    };

    res.json({ success: true, data: projectData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create project
exports.createProject = async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      owner: req.user.userId
    };

    const project = new Project(projectData);
    await project.save();

    await project.populate('owner', 'name email');

    // Create activity
    await Activity.createActivity({
      user: req.user.userId,
      type: 'project_created',
      action: `created project "${project.name}"`,
      targetType: 'Project',
      targetId: project._id,
      targetName: project.name,
      project: project._id
    });

    // Notify team members if any
    if (req.body.team && req.body.team.length > 0) {
      const notifications = req.body.team.map(member => ({
        recipient: member.user,
        sender: req.user.userId,
        type: 'project_update',
        title: 'Added to Project',
        message: `You have been added to project "${project.name}"`,
        data: { projectId: project._id },
        category: 'project',
        actionUrl: `/projects/${project._id}`
      }));

      await Notification.insertMany(notifications);
    }

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check permissions
    const hasPermission = req.user.role === 'admin' || 
                         project.owner.equals(req.user.userId) ||
                         project.team.some(member => 
                           member.user.equals(req.user.userId) && 
                           ['lead', 'manager'].includes(member.role)
                         );

    if (!hasPermission) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    Object.assign(project, req.body);
    await project.save();
    await project.populate('owner', 'name email');
    await project.populate('team.user', 'name email');

    // Create activity
    await Activity.createActivity({
      user: req.user.userId,
      type: 'project_updated',
      action: `updated project "${project.name}"`,
      targetType: 'Project',
      targetId: project._id,
      targetName: project.name,
      project: project._id,
      metadata: { changes: req.body }
    });

    res.json({ success: true, data: project });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check permissions (only owner or admin can delete)
    if (req.user.role !== 'admin' && !project.owner.equals(req.user.userId)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Check if project has tasks
    const taskCount = await Task.countDocuments({ project: req.params.id });
    if (taskCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete project with existing tasks. Please delete or reassign tasks first.'
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add team member to project
exports.addTeamMember = async (req, res) => {
  try {
    const { userId, role = 'member' } = req.body;
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check permissions
    const hasPermission = req.user.role === 'admin' || 
                         project.owner.equals(req.user.userId) ||
                         project.team.some(member => 
                           member.user.equals(req.user.userId) && 
                           ['lead', 'manager'].includes(member.role)
                         );

    if (!hasPermission) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Check if user is already a team member
    const existingMember = project.team.find(member => member.user.equals(userId));
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'User is already a team member'
      });
    }

    project.team.push({ user: userId, role });
    await project.save();
    await project.populate('team.user', 'name email');

    // Notify the new team member
    await Notification.create({
      recipient: userId,
      sender: req.user.userId,
      type: 'project_update',
      title: 'Added to Project',
      message: `You have been added to project "${project.name}"`,
      data: { projectId: project._id },
      category: 'project',
      actionUrl: `/projects/${project._id}`
    });

    res.json({
      success: true,
      message: 'Team member added successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove team member from project
exports.removeTeamMember = async (req, res) => {
  try {
    const { userId } = req.params;
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check permissions
    const hasPermission = req.user.role === 'admin' || 
                         project.owner.equals(req.user.userId) ||
                         project.team.some(member => 
                           member.user.equals(req.user.userId) && 
                           ['lead', 'manager'].includes(member.role)
                         );

    if (!hasPermission) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    project.team = project.team.filter(member => !member.user.equals(userId));
    await project.save();

    res.json({
      success: true,
      message: 'Team member removed successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get project analytics
exports.getProjectAnalytics = async (req, res) => {
  try {
    const filter = {};
    
    // Non-admin users can only see projects they're part of
    if (req.user.role !== 'admin') {
      filter.$or = [
        { owner: req.user.userId },
        { 'team.user': req.user.userId }
      ];
    }

    const analytics = await Project.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalProjects: { $sum: 1 },
          activeProjects: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          completedProjects: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          onHoldProjects: {
            $sum: { $cond: [{ $eq: ['$status', 'on-hold'] }, 1, 0] }
          },
          averageProgress: { $avg: '$progress' },
          totalBudgetAllocated: { $sum: '$budget.allocated' },
          totalBudgetSpent: { $sum: '$budget.spent' }
        }
      }
    ]);

    const statusDistribution = await Project.aggregate([
      { $match: filter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        summary: analytics[0] || {
          totalProjects: 0,
          activeProjects: 0,
          completedProjects: 0,
          onHoldProjects: 0,
          averageProgress: 0,
          totalBudgetAllocated: 0,
          totalBudgetSpent: 0
        },
        statusDistribution
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = exports;