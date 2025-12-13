const User = require('../models/User');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const users = await User.find({}, 'name email profilePhoto');
    
    console.log('📸 User Profile Photos:');
    console.log('='.repeat(60));
    users.forEach(u => {
      console.log(`\n👤 ${u.name} (${u.email})`);
      console.log(`   Photo: ${u.profilePhoto || 'NOT SET'}`);
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
