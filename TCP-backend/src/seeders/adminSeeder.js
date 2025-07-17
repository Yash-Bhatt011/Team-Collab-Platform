const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
        
        if (adminExists) {
            console.log('Admin already exists');
            await mongoose.connection.close();
            return;
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        
        const admin = new User({
            name: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
            password: hashedPassword,
            role: 'admin',
            department: 'Administration',
            position: 'Administrator',
            isVerified: true
        });

        await admin.save();
        console.log('Admin user created successfully');
        console.log('Admin credentials:');
        console.log('Email:', process.env.ADMIN_EMAIL);
        console.log('Password:', process.env.ADMIN_PASSWORD);
        console.log('Role: admin');
        
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error creating admin:', error);
        await mongoose.connection.close();
    }
};

// Run the seeder
createAdmin();
