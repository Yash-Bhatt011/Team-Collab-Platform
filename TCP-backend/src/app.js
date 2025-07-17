const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const attendanceRoutes = require('./routes/attendance');
const leaveRoutes = require('./routes/leave');
const projectRoutes = require('./routes/projects');
const notificationRoutes = require('./routes/notifications');
const errorHandler = require('./middleware/errorHandler');
const userDebugRoutes = require('./routes/userDebugRoutes');
const dashboardRoutes = require('./routes/dashboard');
const chatRoutes = require('./routes/chat');
const Chat = require('./models/Chat');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a chat room
  socket.on('join_chat', (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat ${chatId}`);
  });

  // Leave a chat room
  socket.on('leave_chat', (chatId) => {
    socket.leave(chatId);
    console.log(`User ${socket.id} left chat ${chatId}`);
  });

  // Handle new message
  socket.on('send_message', async (messageData) => {
    try {
      // Broadcast the message to all users in the chat room
      io.to(messageData.chatId).emit('receive_message', messageData);
      
      // For team chat, also broadcast to all connected users
      const chat = await Chat.findById(messageData.chatId);
      if (chat && chat.type === 'team') {
        socket.broadcast.emit('receive_message', messageData);
      }
      
      console.log(`Message broadcast to chat ${messageData.chatId}`);
    } catch (error) {
      console.error('Error broadcasting message:', error);
    }
  });

  // Handle typing status
  socket.on('typing', (data) => {
    // Broadcast typing status to all users in the chat
    socket.to(data.chatId).emit('user_typing', {
      userId: data.userId,
      username: data.username
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/debug', userDebugRoutes); // Added debug routes
app.use('/api', dashboardRoutes);
app.use('/api/chat', chatRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    console.log('Database URI:', process.env.MONGODB_URI);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
