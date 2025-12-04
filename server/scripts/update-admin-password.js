import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const updateAdminPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/innovateher');
    console.log('Connected to MongoDB');

    const email = process.argv[2] || 'admin@innovateher.com';
    const password = process.argv[3] || 'innovateher123';

    // Find admin
    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) {
      console.log(`❌ Admin with email ${email} not found!`);
      process.exit(1);
    }

    // Update password
    admin.password = password;
    await admin.save();
    
    console.log('✅ Admin password updated successfully!');
    console.log('\n📋 Admin Details:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Name: ${admin.firstName} ${admin.lastName}`);
    console.log(`   Role: admin`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating admin password:', error.message);
    process.exit(1);
  }
};

updateAdminPassword();

