const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const LeaveRequest = require('../models/LeaveRequest');
const Attendance = require('../models/Attendance');
const Notification = require('../models/Notification');
const Activity = require('../models/Activity');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    await LeaveRequest.deleteMany({});
    await Attendance.deleteMany({});
    await Notification.deleteMany({});
    await Activity.deleteMany({});

    // Create users
    console.log('Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: await bcrypt.hash('Admin@123', 10),
      role: 'admin',
      position: 'Administrator',
      isVerified: true
    });

    const users = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'employee',
        position: 'Frontend Developer',
        isVerified: true,
        skills: ['JavaScript', 'React', 'HTML', 'CSS', 'TypeScript']
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: hashedPassword,
        role: 'employee',
        position: 'Backend Developer',
        isVerified: true,
        skills: ['Node.js', 'Express', 'MongoDB', 'Python', 'Docker']
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: hashedPassword,
        role: 'employee',
        position: 'UI/UX Designer',
        isVerified: true,
        skills: ['Figma', 'Adobe XD', 'UI Design', 'UX Research', 'Prototyping']
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        password: hashedPassword,
        role: 'employee',
        position: 'Project Manager',
        isVerified: true,
        skills: ['Project Management', 'Agile', 'Scrum', 'Team Leadership', 'Risk Management']
      },
      {
        name: 'David Brown',
        email: 'david@example.com',
        password: hashedPassword,
        role: 'employee',
        position: 'DevOps Engineer',
        isVerified: true,
        skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux']
      }
    ]);

    console.log(`Created ${users.length + 1} users`);

    // Create projects
    console.log('Creating projects...');
    const projects = await Project.insertMany([
      {
        name: 'Team Collaboration Platform',
        description: 'A comprehensive platform for team collaboration and project management',
        status: 'active',
        priority: 'high',
        owner: admin._id,
        team: [
          { user: users[0]._id, role: 'lead' },
          { user: users[1]._id, role: 'member' },
          { user: users[2]._id, role: 'member' }
        ],
        startDate: new Date('2024-01-01'),
        deadline: new Date('2024-06-30'),
        progress: 65,
        tags: ['web', 'collaboration', 'react', 'node.js']
      },
      {
        name: 'Mobile App Development',
        description: 'Cross-platform mobile application for task management',
        status: 'planning',
        priority: 'medium',
        owner: users[3]._id,
        team: [
          { user: users[0]._id, role: 'member' },
          { user: users[4]._id, role: 'member' }
        ],
        startDate: new Date('2024-03-01'),
        deadline: new Date('2024-09-30'),
        progress: 15,
        tags: ['mobile', 'react-native', 'ios', 'android']
      },
      {
        name: 'Data Analytics Dashboard',
        description: 'Business intelligence dashboard for data visualization',
        status: 'active',
        priority: 'medium',
        owner: users[1]._id,
        team: [
          { user: users[2]._id, role: 'lead' },
          { user: users[4]._id, role: 'member' }
        ],
        startDate: new Date('2024-02-15'),
        deadline: new Date('2024-08-15'),
        progress: 40,
        tags: ['dashboard', 'analytics', 'charts', 'data']
      }
    ]);

    console.log(`Created ${projects.length} projects`);

    // Create tasks
    console.log('Creating tasks...');
    const tasks = await Task.insertMany([
      // Tasks for Team Collaboration Platform
      {
        title: 'Setup Authentication System',
        description: 'Implement user authentication with JWT tokens',
        status: 'done',
        priority: 'high',
        assignedTo: users[1]._id,
        createdBy: admin._id,
        project: projects[0]._id,
        dueDate: new Date('2024-01-15'),
        completedDate: new Date('2024-01-14'),
        estimatedHours: 16,
        actualHours: 18,
        tags: ['authentication', 'jwt', 'security']
      },
      {
        title: 'Design User Dashboard',
        description: 'Create wireframes and mockups for the user dashboard',
        status: 'done',
        priority: 'high',
        assignedTo: users[2]._id,
        createdBy: admin._id,
        project: projects[0]._id,
        dueDate: new Date('2024-01-20'),
        completedDate: new Date('2024-01-19'),
        estimatedHours: 12,
        actualHours: 14,
        tags: ['design', 'ui', 'dashboard']
      },
      {
        title: 'Implement Task Management',
        description: 'Build CRUD operations for task management',
        status: 'in-progress',
        priority: 'high',
        assignedTo: users[0]._id,
        createdBy: admin._id,
        project: projects[0]._id,
        dueDate: new Date('2024-02-01'),
        estimatedHours: 24,
        actualHours: 16,
        tags: ['tasks', 'crud', 'frontend']
      },
      {
        title: 'Setup Database Schema',
        description: 'Design and implement MongoDB schema for all entities',
        status: 'done',
        priority: 'high',
        assignedTo: users[1]._id,
        createdBy: admin._id,
        project: projects[0]._id,
        dueDate: new Date('2024-01-10'),
        completedDate: new Date('2024-01-09'),
        estimatedHours: 8,
        actualHours: 10,
        tags: ['database', 'mongodb', 'schema']
      },
      {
        title: 'Implement Real-time Chat',
        description: 'Add real-time messaging functionality using Socket.io',
        status: 'todo',
        priority: 'medium',
        assignedTo: users[1]._id,
        createdBy: admin._id,
        project: projects[0]._id,
        dueDate: new Date('2024-02-15'),
        estimatedHours: 20,
        tags: ['chat', 'socket.io', 'realtime']
      },
      // Tasks for Mobile App Development
      {
        title: 'Setup React Native Project',
        description: 'Initialize React Native project with navigation',
        status: 'done',
        priority: 'high',
        assignedTo: users[0]._id,
        createdBy: users[3]._id,
        project: projects[1]._id,
        dueDate: new Date('2024-03-05'),
        completedDate: new Date('2024-03-04'),
        estimatedHours: 6,
        actualHours: 8,
        tags: ['react-native', 'setup', 'navigation']
      },
      {
        title: 'Design Mobile UI Components',
        description: 'Create reusable UI components for mobile app',
        status: 'in-progress',
        priority: 'medium',
        assignedTo: users[2]._id,
        createdBy: users[3]._id,
        project: projects[1]._id,
        dueDate: new Date('2024-03-20'),
        estimatedHours: 16,
        actualHours: 8,
        tags: ['mobile', 'ui', 'components']
      },
      // Tasks for Data Analytics Dashboard
      {
        title: 'Setup Chart Library',
        description: 'Integrate and configure chart.js for data visualization',
        status: 'done',
        priority: 'medium',
        assignedTo: users[2]._id,
        createdBy: users[1]._id,
        project: projects[2]._id,
        dueDate: new Date('2024-02-25'),
        completedDate: new Date('2024-02-24'),
        estimatedHours: 8,
        actualHours: 6,
        tags: ['charts', 'visualization', 'library']
      },
      {
        title: 'Implement Data API',
        description: 'Create REST API endpoints for analytics data',
        status: 'in-progress',
        priority: 'high',
        assignedTo: users[4]._id,
        createdBy: users[1]._id,
        project: projects[2]._id,
        dueDate: new Date('2024-03-10'),
        estimatedHours: 20,
        actualHours: 12,
        tags: ['api', 'analytics', 'data']
      }
    ]);

    console.log(`Created ${tasks.length} tasks`);

    // Create leave requests
    console.log('Creating leave requests...');
    const leaveRequests = await LeaveRequest.insertMany([
      {
        employee: users[0]._id,
        type: 'vacation',
        startDate: new Date('2024-03-15'),
        endDate: new Date('2024-03-20'),
        totalDays: 6,
        reason: 'Family vacation to Europe',
        status: 'approved',
        approvedBy: admin._id,
        approvedAt: new Date('2024-02-20')
      },
      {
        employee: users[1]._id,
        type: 'sick',
        startDate: new Date('2024-02-10'),
        endDate: new Date('2024-02-12'),
        totalDays: 3,
        reason: 'Flu symptoms and recovery',
        status: 'approved',
        approvedBy: admin._id,
        approvedAt: new Date('2024-02-09')
      },
      {
        employee: users[2]._id,
        type: 'personal',
        startDate: new Date('2024-03-25'),
        endDate: new Date('2024-03-25'),
        totalDays: 1,
        reason: 'Personal appointment',
        status: 'pending'
      },
      {
        employee: users[3]._id,
        type: 'vacation',
        startDate: new Date('2024-04-01'),
        endDate: new Date('2024-04-05'),
        totalDays: 5,
        reason: 'Spring break with family',
        status: 'pending'
      }
    ]);

    console.log(`Created ${leaveRequests.length} leave requests`);

    // Create attendance records
    console.log('Creating attendance records...');
    const attendanceRecords = [];
    const today = new Date();
    
    // Create attendance for the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      for (const user of users) {
        // 90% attendance rate
        if (Math.random() > 0.1) {
          const checkInTime = new Date(date);
          checkInTime.setHours(9 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
          
          const checkOutTime = new Date(checkInTime);
          checkOutTime.setHours(checkInTime.getHours() + 8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
          
          attendanceRecords.push({
            user: user._id,
            date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            checkIn: {
              time: checkInTime,
              location: Math.random() > 0.3 ? 'office' : 'remote'
            },
            checkOut: {
              time: checkOutTime,
              location: Math.random() > 0.3 ? 'office' : 'remote'
            },
            breaks: [
              {
                startTime: new Date(checkInTime.getTime() + 4 * 60 * 60 * 1000), // 4 hours after check-in
                endTime: new Date(checkInTime.getTime() + 4.5 * 60 * 60 * 1000), // 30 min break
                type: 'lunch'
              }
            ],
            status: checkInTime.getHours() > 9 ? 'late' : 'present'
          });
        }
      }
    }

    await Attendance.insertMany(attendanceRecords);
    console.log(`Created ${attendanceRecords.length} attendance records`);

    // Create notifications
    console.log('Creating notifications...');
    const notifications = await Notification.insertMany([
      {
        recipient: users[0]._id,
        sender: admin._id,
        type: 'task_assigned',
        title: 'New Task Assigned',
        message: 'You have been assigned a new task: "Implement Task Management"',
        data: { taskId: tasks[2]._id },
        category: 'task',
        actionUrl: `/tasks/${tasks[2]._id}`
      },
      {
        recipient: users[1]._id,
        sender: admin._id,
        type: 'task_assigned',
        title: 'New Task Assigned',
        message: 'You have been assigned a new task: "Implement Real-time Chat"',
        data: { taskId: tasks[4]._id },
        category: 'task',
        actionUrl: `/tasks/${tasks[4]._id}`
      },
      {
        recipient: admin._id,
        sender: users[2]._id,
        type: 'leave_request',
        title: 'New Leave Request',
        message: 'Mike Johnson has requested personal leave',
        data: { leaveRequestId: leaveRequests[2]._id },
        category: 'leave',
        actionRequired: true,
        actionUrl: `/admin/leave-requests/${leaveRequests[2]._id}`
      },
      {
        recipient: admin._id,
        sender: users[3]._id,
        type: 'leave_request',
        title: 'New Leave Request',
        message: 'Sarah Wilson has requested vacation leave',
        data: { leaveRequestId: leaveRequests[3]._id },
        category: 'leave',
        actionRequired: true,
        actionUrl: `/admin/leave-requests/${leaveRequests[3]._id}`
      }
    ]);

    console.log(`Created ${notifications.length} notifications`);

    // Create activities
    console.log('Creating activities...');
    const activities = await Activity.insertMany([
      {
        user: admin._id,
        type: 'project_created',
        action: 'created project "Team Collaboration Platform"',
        targetType: 'Project',
        targetId: projects[0]._id,
        targetName: 'Team Collaboration Platform',
        project: projects[0]._id
      },
      {
        user: users[1]._id,
        type: 'task_completed',
        action: 'completed task "Setup Authentication System"',
        targetType: 'Task',
        targetId: tasks[0]._id,
        targetName: 'Setup Authentication System',
        task: tasks[0]._id,
        project: projects[0]._id
      },
      {
        user: users[2]._id,
        type: 'task_completed',
        action: 'completed task "Design User Dashboard"',
        targetType: 'Task',
        targetId: tasks[1]._id,
        targetName: 'Design User Dashboard',
        task: tasks[1]._id,
        project: projects[0]._id
      },
      {
        user: users[0]._id,
        type: 'leave_requested',
        action: 'requested vacation leave',
        targetType: 'LeaveRequest',
        targetId: leaveRequests[0]._id,
        targetName: 'vacation leave from 2024-03-15 to 2024-03-20'
      }
    ]);

    console.log(`Created ${activities.length} activities`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`👥 Users: ${users.length + 1} (including admin)`);
    console.log(`📁 Projects: ${projects.length}`);
    console.log(`📋 Tasks: ${tasks.length}`);
    console.log(`🏖️ Leave Requests: ${leaveRequests.length}`);
    console.log(`⏰ Attendance Records: ${attendanceRecords.length}`);
    console.log(`🔔 Notifications: ${notifications.length}`);
    console.log(`📈 Activities: ${activities.length}`);
    
    console.log('\n🔑 Login Credentials:');
    console.log('Admin: admin@example.com / Admin@123');
    console.log('Users: john@example.com, jane@example.com, mike@example.com, sarah@example.com, david@example.com / password123');

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();