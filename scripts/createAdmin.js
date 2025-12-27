const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const dotenv = require('dotenv');
const path = require('path');

// Explicitly specify the path to .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tugi-music';

// Debug: Check if .env is being read
if (!process.env.MONGODB_URI) {
  console.log('⚠️  Warning: MONGODB_URI not found in environment variables');
  console.log('   Make sure your .env file is in the project root and contains MONGODB_URI');
} else {
  console.log('✅ Found MONGODB_URI in environment');
  // Log connection string without password for debugging
  const uriWithoutPassword = MONGODB_URI.replace(/:[^:@]+@/, ':****@');
  console.log('   Connecting to:', uriWithoutPassword);
}

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'tugi' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = new Admin({
      username: 'tugi',
      password: '14tugi2024'
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('   Username: tugi');
    console.log('   Password: 14tugi2024');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();

