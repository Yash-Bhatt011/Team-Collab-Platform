const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendance'); // Added attendance routes import

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes); // Added attendance routes middleware

// MongoDB connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-db-name'; // Provide fallback or ensure env var is set
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
