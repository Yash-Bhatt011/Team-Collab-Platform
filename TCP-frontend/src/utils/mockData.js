export const mockTasks = [
  {
    id: 1,
    title: 'Implement User Authentication',
    description: 'Set up JWT authentication and user registration system',
    status: 'done',
    priority: 'high',
    assignee: 'john.doe@example.com',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-16T15:30:00Z',
    dueDate: '2024-03-20T00:00:00Z',
    tags: ['backend', 'security'],
    comments: [
      {
        id: 1,
        user: 'john.doe@example.com',
        text: 'Completed the JWT implementation',
        timestamp: '2024-03-16T15:30:00Z'
      }
    ]
  },
  {
    id: 2,
    title: 'Design Dashboard UI',
    description: 'Create responsive dashboard layout with Chakra UI',
    status: 'in-progress',
    priority: 'medium',
    assignee: 'jane.smith@example.com',
    createdAt: '2024-03-14T09:00:00Z',
    updatedAt: '2024-03-15T14:20:00Z',
    dueDate: '2024-03-25T00:00:00Z',
    tags: ['frontend', 'ui/ux'],
    comments: [
      {
        id: 1,
        user: 'jane.smith@example.com',
        text: 'Working on the layout components',
        timestamp: '2024-03-15T14:20:00Z'
      }
    ]
  },
  {
    id: 3,
    title: 'Database Schema Design',
    description: 'Design and implement database schema for user management',
    status: 'todo',
    priority: 'high',
    assignee: 'mike.wilson@example.com',
    createdAt: '2024-03-13T11:00:00Z',
    updatedAt: '2024-03-13T11:00:00Z',
    dueDate: '2024-03-22T00:00:00Z',
    tags: ['database', 'backend'],
    comments: []
  },
  {
    id: 4,
    title: 'API Documentation',
    description: 'Create comprehensive API documentation using Swagger',
    status: 'todo',
    priority: 'low',
    assignee: 'sarah.johnson@example.com',
    createdAt: '2024-03-12T14:00:00Z',
    updatedAt: '2024-03-12T14:00:00Z',
    dueDate: '2024-03-28T00:00:00Z',
    tags: ['documentation'],
    comments: []
  },
  {
    id: 5,
    title: 'Unit Testing',
    description: 'Implement unit tests for core functionality',
    status: 'in-progress',
    priority: 'medium',
    assignee: 'alex.brown@example.com',
    createdAt: '2024-03-11T10:00:00Z',
    updatedAt: '2024-03-14T16:45:00Z',
    dueDate: '2024-03-26T00:00:00Z',
    tags: ['testing'],
    comments: [
      {
        id: 1,
        user: 'alex.brown@example.com',
        text: 'Completed authentication tests',
        timestamp: '2024-03-14T16:45:00Z'
      }
    ]
  }
]

export const mockActivities = [
  {
    id: 1,
    user: 'john.doe@example.com',
    action: 'completed task',
    target: 'Implement User Authentication',
    timestamp: '2024-03-16T15:30:00Z',
    type: 'task_completion'
  },
  {
    id: 2,
    user: 'jane.smith@example.com',
    action: 'updated task',
    target: 'Design Dashboard UI',
    timestamp: '2024-03-15T14:20:00Z',
    type: 'task_update'
  },
  {
    id: 3,
    user: 'admin@example.com',
    action: 'created task',
    target: 'Database Schema Design',
    timestamp: '2024-03-13T11:00:00Z',
    type: 'task_creation'
  },
  {
    id: 4,
    user: 'sarah.johnson@example.com',
    action: 'commented on',
    target: 'API Documentation',
    timestamp: '2024-03-12T15:45:00Z',
    type: 'comment'
  },
  {
    id: 5,
    user: 'alex.brown@example.com',
    action: 'started working on',
    target: 'Unit Testing',
    timestamp: '2024-03-11T10:00:00Z',
    type: 'task_start'
  }
]

export const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?u=admin@example.com',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'employee@example.com',
    role: 'employee',
    avatar: 'https://i.pravatar.cc/150?u=employee@example.com',
  },
]

export const mockMessages = [
  {
    id: 1,
    user: 'admin@example.com',
    text: 'Welcome to the team chat!',
    timestamp: '2024-03-15T10:00:00Z',
  },
  {
    id: 2,
    user: 'employee@example.com',
    text: 'Thanks! Excited to be here.',
    timestamp: '2024-03-15T10:05:00Z',
  },
]

export const mockFiles = [
  {
    id: 1,
    name: 'Project Requirements.pdf',
    type: 'pdf',
    size: '2.5 MB',
    uploadedBy: 'admin@example.com',
    uploadDate: '2024-03-15',
    description: 'Project requirements document',
  },
  {
    id: 2,
    name: 'Design Mockups.zip',
    type: 'zip',
    size: '15 MB',
    uploadedBy: 'employee@example.com',
    uploadDate: '2024-03-14',
    description: 'UI/UX design mockups',
  },
]

export const mockOnlineUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'admin@example.com',
    status: 'online',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'employee@example.com',
    status: 'online',
  },
]

export const mockNotifications = [
  {
    id: 1,
    type: 'task',
    title: 'New Task Assigned',
    message: 'You have been assigned to "Implement Authentication"',
    timestamp: '2024-03-16T10:00:00Z',
    read: false,
  },
  {
    id: 2,
    type: 'mention',
    title: 'Mentioned in Comment',
    message: 'Jane Smith mentioned you in "Project Setup"',
    timestamp: '2024-03-15T15:30:00Z',
    read: true,
  },
  {
    id: 3,
    type: 'announcement',
    title: 'New Company Announcement',
    message: 'Company All-Hands Meeting this Friday',
    timestamp: '2024-03-16T10:00:00Z',
    read: false,
    priority: 'high',
    link: '/announcements/1'
  }
]

export const mockAnnouncements = [
  {
    id: 1,
    title: 'Company All-Hands Meeting',
    content: 'Join us for our monthly all-hands meeting this Friday at 3 PM.',
    type: 'company-wide',
    priority: 'high',
    sender: 'admin@example.com',
    timestamp: '2024-03-16T10:00:00Z',
    expiresAt: '2024-03-17T15:00:00Z',
    targetGroups: ['all'],
    reactions: {
      '👍': 12,
      '👀': 5
    }
  },
  {
    id: 2,
    title: 'New Project Guidelines',
    content: 'Updated project guidelines are now available in the resource library.',
    type: 'department',
    priority: 'medium',
    sender: 'admin@example.com',
    timestamp: '2024-03-15T14:00:00Z',
    targetGroups: ['development', 'design'],
    reactions: {
      '👍': 8
    }
  }
]

export const mockCalendarEvents = [
  {
    id: 1,
    title: 'Team Meeting',
    start: new Date().toISOString(),
    end: new Date(new Date().setHours(new Date().getHours() + 1)).toISOString(),
    type: 'meeting',
  },
  {
    id: 2,
    title: 'Project Deadline',
    start: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    end: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    type: 'deadline',
  },
]

export const mockTimeEntries = [
  {
    id: 1,
    userId: 1,
    taskId: 1,
    date: '2024-03-15',
    duration: 7.5, // hours
    description: 'Working on authentication implementation',
  },
  {
    id: 2,
    userId: 2,
    taskId: 2,
    date: '2024-03-15',
    duration: 6.0,
    description: 'Dashboard UI development',
  },
]

export const mockResources = [
  {
    id: 1,
    title: 'Employee Handbook',
    category: 'HR',
    type: 'pdf',
    size: '2.5 MB',
    uploadedBy: 'admin@example.com',
    uploadDate: '2024-03-01',
    access: ['all'],
  },
  {
    id: 2,
    title: 'Design Guidelines',
    category: 'Design',
    type: 'pdf',
    size: '5.2 MB',
    uploadedBy: 'admin@example.com',
    uploadDate: '2024-03-10',
    access: ['design', 'development'],
  },
]

export const mockPerformanceMetrics = [
  {
    userId: 1,
    metrics: {
      tasksCompleted: 25,
      onTimeCompletion: 92,
      avgTaskDuration: 2.5,
      collaborationScore: 8.5,
    },
    period: '2024-03',
  },
  {
    userId: 2,
    metrics: {
      tasksCompleted: 18,
      onTimeCompletion: 88,
      avgTaskDuration: 3.2,
      collaborationScore: 9.0,
    },
    period: '2024-03',
  },
]

export const mockAttendanceData = [
  {
    id: 1,
    employeeId: 'emp1',
    employeeName: 'John Doe',
    status: 'in',
    checkIn: '09:00 AM',
    checkOut: '06:00 PM',
    totalHours: 9,
    hourlyRate: 20,
    breaks: [
      { start: '11:30 AM', end: '12:00 PM', duration: 30 },
      { start: '02:30 PM', end: '02:45 PM', duration: 15 }
    ],
    totalBreakTime: 45, // in minutes
    leaves: [
      { type: 'unpaid', status: 'approved', days: 1 }
    ]
  },
  {
    id: 2,
    employeeId: 'emp2',
    employeeName: 'Jane Smith',
    status: 'out',
    checkIn: '08:00 AM',
    checkOut: '05:30 PM',
    totalHours: 9.5,
    hourlyRate: 25,
    leaves: []
  },
  {
    id: 3,
    employeeId: 'emp3',
    employeeName: 'Mike Johnson',
    status: 'in',
    checkIn: '08:30 AM',
    checkOut: '04:30 PM',
    totalHours: 8,
    hourlyRate: 22,
    leaves: [
      { type: 'paid', status: 'approved', days: 2 }
    ]
  }
];

export const mockLeaveRequests = [
  {
    id: 1,
    employeeId: 'emp1',
    employeeName: 'John Doe',
    type: 'vacation',
    startDate: '2024-02-01',
    endDate: '2024-02-05',
    status: 'pending',
    reason: 'Annual family vacation',
    appliedOn: '2024-01-15',
    totalDays: 5
  },
  {
    id: 2,
    employeeId: 'emp2',
    employeeName: 'Jane Smith',
    type: 'sick',
    startDate: '2024-01-20',
    endDate: '2024-01-21',
    status: 'approved',
    reason: 'Medical appointment',
    appliedOn: '2024-01-18',
    totalDays: 2
  },
  {
    id: 3,
    employeeId: 'emp3',
    employeeName: 'Mike Johnson',
    type: 'personal',
    startDate: '2024-02-10',
    endDate: '2024-02-10',
    status: 'rejected',
    reason: 'Family event',
    appliedOn: '2024-01-25',
    totalDays: 1
  },
  {
    id: 4,
    employeeId: 'emp1',
    employeeName: 'John Doe',
    type: 'work-from-home',
    startDate: '2024-02-15',
    endDate: '2024-02-16',
    status: 'pending',
    reason: 'Internet installation at home',
    appliedOn: '2024-01-30',
    totalDays: 2
  },
  {
    id: 5,
    employeeId: 'emp2',
    employeeName: 'Jane Smith',
    type: 'vacation',
    startDate: '2024-03-01',
    endDate: '2024-03-05',
    status: 'approved',
    reason: 'Spring break vacation',
    appliedOn: '2024-01-15',
    totalDays: 5
  }
];

export const dashboardStats = {
  overview: {
    totalUsers: 156,
    activeProjects: 23,
    completedTasks: 89,
    pendingTasks: 34,
    teamEfficiency: 87,
    totalHours: 1240,
    projectSuccess: 92,
    activeUsers: 45
  },
  attendance: {
    present: 42,
    absent: 3,
    onLeave: 5,
    remote: 12,
    lateArrivals: 4,
    averageWorkHours: 7.5
  },
  projectMetrics: {
    onTrack: 18,
    delayed: 3,
    completed: 8,
    cancelled: 1,
    upcomingDeadlines: 5,
    totalBudget: 150000,
    utilizedBudget: 89000
  },
  resourceUtilization: {
    development: 85,
    design: 72,
    marketing: 65,
    sales: 78,
    support: 90
  }
};

export const recentActivities = [
  {
    id: 1,
    user: 'John Doe',
    action: 'completed',
    item: 'Database Migration',
    timestamp: '2024-01-15T09:30:00',
    department: 'Development'
  },
  // ...add more activities
];

export const upcomingDeadlines = [
  {
    id: 1,
    project: 'Client Portal',
    task: 'User Authentication',
    deadline: '2024-01-20',
    assignee: 'Jane Smith',
    priority: 'high'
  },
  // ...add more deadlines
];

export const mockCulturalHolidays = [
  {
    id: 1,
    name: 'Diwali',
    description: 'Festival of Lights - One of the major festivals in Hinduism',
    date: '2025-11-12',
    type: 'religious',
    culture: 'Hindu',
    icon: '🪔',
    color: 'orange.400',
    countries: ['India', 'Nepal', 'Sri Lanka', 'Malaysia', 'Singapore'],
    isGloballyObserved: true
  },
  {
    id: 2,
    name: 'Eid al-Fitr',
    description: 'Festival marking the end of Ramadan',
    date: '2025-04-30',
    type: 'religious',
    culture: 'Islamic',
    icon: '🌙',
    color: 'green.400',
    countries: ['Global Islamic Communities'],
    isGloballyObserved: true
  },
  {
    id: 3,
    name: 'Hanukkah',
    description: 'Eight-day Jewish festival of lights',
    date: '2025-12-14',
    endDate: '2025-12-22',
    type: 'religious',
    culture: 'Jewish',
    icon: '🕎',
    color: 'blue.400',
    countries: ['Global Jewish Communities'],
    isGloballyObserved: true
  },
  {
    id: 4,
    name: 'Lunar New Year',
    description: 'Chinese New Year - Year of the Snake',
    date: '2025-01-29',
    type: 'cultural',
    culture: 'Eastern Asian',
    icon: '🧧',
    color: 'red.400',
    countries: ['China', 'Korea', 'Vietnam', 'Singapore', 'Malaysia'],
    isGloballyObserved: true
  },
  {
    id: 5,
    name: 'Ramadan Start',
    description: 'Beginning of Islamic holy month of fasting',
    date: '2025-03-01',
    type: 'religious',
    culture: 'Islamic',
    icon: '🌙',
    color: 'green.400',
    countries: ['Global Islamic Communities'],
    isGloballyObserved: true
  },
  {
    id: 6,
    name: 'Easter',
    description: 'Christian celebration of resurrection of Jesus',
    date: '2025-04-20',
    type: 'religious',
    culture: 'Christian',
    icon: '✝️',
    color: 'purple.400',
    countries: ['Global Christian Communities'],
    isGloballyObserved: true
  },
  {
    id: 7,
    name: 'Passover',
    description: 'Jewish festival of freedom',
    date: '2025-04-12',
    endDate: '2025-04-20',
    type: 'religious',
    culture: 'Jewish',
    icon: '✡️',
    color: 'blue.400',
    countries: ['Global Jewish Communities'],
    isGloballyObserved: true
  },
  {
    id: 8,
    name: 'Diwali',
    description: 'Festival of Lights - One of the major festivals in Hinduism',
    date: '2026-11-01',
    type: 'religious',
    culture: 'Hindu',
    icon: '🪔',
    color: 'orange.400',
    countries: ['India', 'Nepal', 'Sri Lanka', 'Malaysia', 'Singapore'],
    isGloballyObserved: true
  },
  {
    id: 9,
    name: 'Eid al-Fitr',
    description: 'Festival marking the end of Ramadan',
    date: '2026-04-20',
    type: 'religious',
    culture: 'Islamic',
    icon: '🌙',
    color: 'green.400',
    countries: ['Global Islamic Communities'],
    isGloballyObserved: true
  },
  {
    id: 10,
    name: 'Lunar New Year',
    description: 'Chinese New Year - Year of the Horse',
    date: '2026-02-17',
    type: 'cultural',
    culture: 'Eastern Asian',
    icon: '🧧',
    color: 'red.400',
    countries: ['China', 'Korea', 'Vietnam', 'Singapore', 'Malaysia'],
    isGloballyObserved: true
  }
];

export const mockPrivateNotes = [
  {
    id: 1,
    taskId: 1,
    userId: 'emp1',
    content: 'Need to check authentication flow with security team',
    createdAt: '2024-03-16T10:00:00Z',
    updatedAt: '2024-03-16T10:00:00Z',
    isPrivate: true
  },
  {
    id: 2,
    taskId: 2,
    userId: 'emp1',
    content: 'Review mobile responsiveness before submitting',
    createdAt: '2024-03-15T14:20:00Z',
    updatedAt: '2024-03-15T14:20:00Z',
    isPrivate: true
  }
];

export const mockUserActivity = [
  {
    id: 1,
    userId: 'emp1',
    date: '2024-03-16',
    activities: [
      {
        type: 'task_completion',
        time: '2024-03-16T10:30:00Z',
        details: 'Completed task: Implement Authentication',
        taskId: 1
      },
      {
        type: 'file_upload',
        time: '2024-03-16T11:15:00Z',
        details: 'Uploaded documentation files',
        fileCount: 2
      },
      {
        type: 'comment',
        time: '2024-03-16T13:45:00Z',
        details: 'Commented on Dashboard UI task',
        taskId: 2
      }
    ],
    summary: {
      tasksCompleted: 4,
      filesUploaded: 2,
      commentsAdded: 3,
      hoursWorked: 7.5
    }
  }
];