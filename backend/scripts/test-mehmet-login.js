// Test Mehmet login logic
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');

const testLogin = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected\n');

    const email = 'mehmet@prestalink.app';
    const password = 'mehmet';
    const roles = ['user', 'recruiter', 'admin'];

    console.log(`🔍 Testing login logic for: ${email}\n`);

    for (const role of roles) {
      console.log(`\n📋 Testing ${role.toUpperCase()} role:`);
      
      // Simulate what backend does
      const emailParts = email.split('@');
      const baseName = emailParts[0];
      const domain = emailParts[1];
      const searchEmail = `${baseName}_${role}@${domain}`;
      
      console.log(`   Input email: ${email}`);
      console.log(`   Search email: ${searchEmail}`);
      
      const user = await User.findOne({ email: searchEmail });
      
      if (!user) {
        console.log(`   ❌ User NOT FOUND: ${searchEmail}`);
        continue;
      }
      
      console.log(`   ✅ User FOUND: ${searchEmail}`);
      console.log(`   ✅ User role: ${user.role}`);
      
      const passwordMatch = await user.matchPassword(password);
      
      if (!passwordMatch) {
        console.log(`   ❌ Password MISMATCH`);
        continue;
      }
      
      console.log(`   ✅ Password MATCH`);
      
      if (user.role !== role) {
        console.log(`   ❌ Role MISMATCH: Expected ${role}, got ${user.role}`);
      } else {
        console.log(`   ✅ Role MATCH`);
      }
      
      console.log(`   ✅✅✅ LOGIN WOULD SUCCEED for ${role} role!`);
    }

    await mongoose.disconnect();
    console.log('\n✅ Test completed\n');
    console.log('💡 If all tests passed, the issue might be:');
    console.log('   1. Backend not running (npm run dev)');
    console.log('   2. Frontend API URL incorrect');
    console.log('   3. Browser console errors\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testLogin();
