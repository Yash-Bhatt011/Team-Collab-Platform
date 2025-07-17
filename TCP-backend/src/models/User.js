const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'employee'],
    required: true,
  },
  department: {
    type: String,
    default: null,
  },
  hourlyRate: {
    type: Number,
    default: 20  // Default hourly rate
  },
  salaryType: {
    type: String,
    enum: ['hourly', 'monthly'],
    default: 'hourly'
  },
  position: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: null
  },
  phoneNumber: {
    type: String,
    default: null
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phoneNumber: String
  },
  dateOfBirth: {
    type: Date
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  skills: [{
    type: String
  }],
  bio: {
    type: String,
    maxLength: 500
  },
  socialLinks: {
    linkedin: String,
    twitter: String,
    github: String
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on_leave'],
    default: 'active'
  }
}, { timestamps: true });

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
