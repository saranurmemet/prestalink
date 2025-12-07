// Quick test script to check if users exist and login works
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');

const test = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI not found in .env file');
      process.exit(1);
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected\n');

    // Check for test users
    const testEmails = [
      'mehmet_user@prestalink.app',
      'mehmet_recruiter@prestalink.app',
      'mehmet_admin@prestalink.app',
      'ahmet_user@prestalink.app',
      'sara_user@prestalink.app',
      'sarad_user@prestalink.app',
    ];

    console.log('🔍 Checking users...\n');
    
    for (const email of testEmails) {
      const user = await User.findOne({ email });
      if (user) {
        console.log(`✅ Found: ${email} (${user.role})`);
        // Test password
        const passwordMatch = await user.matchPassword('mehmet');
        if (email.includes('mehmet')) {
          console.log(`   Password test: ${passwordMatch ? '✅ OK' : '❌ FAILED'}`);
        }
      } else {
        console.log(`❌ Not found: ${email}`);
      }
    }

    // Count total users
    const totalUsers = await User.countDocuments();
    console.log(`\n📊 Total users in database: ${totalUsers}`);

    await mongoose.disconnect();
    console.log('\n✅ Test completed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

test();



