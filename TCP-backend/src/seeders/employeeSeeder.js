const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createEmployee = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Define employee email(s) to create
        const employeeEmails = [
            'employee1@example.com',
            'employee2@example.com',
            'employee3@example.com'
        ];

        for (const email of employeeEmails) {
            // Check if employee already exists
            const employeeExists = await User.findOne({ email: email });
            
            if (employeeExists) {
                console.log(`Employee with email ${email} already exists`);
                continue;
            }

            // Create employee user
            const hashedPassword = await bcrypt.hash('password123', 10);
            
            const employee = new User({
                name: 'Employee',
                email: email,
                password: hashedPassword,
                role: 'employee',
                department: 'Engineering',
                position: 'Software Developer',
                hourlyRate: 25,
                salaryType: 'hourly',
                isVerified: true
            });

            await employee.save();
            console.log(`Employee user created successfully: ${email}`);
        }
        
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error creating employee:', error);
        await mongoose.connection.close();
    }
};

// Run the seeder
createEmployee();
