require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected\n');
    
    const mehmetUsers = await User.find({ email: /mehmet/i });
    
    if (mehmetUsers.length === 0) {
      console.log('Mehmet kullanıcıları bulunamadı. Seed script çalıştırılıyor...\n');
      process.exit(1);
    }
    
    console.log(`Bulunan Mehmet kullanıcıları (${mehmetUsers.length}):\n`);
    mehmetUsers.forEach(user => {
      console.log(`- Email: ${user.email}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Name: ${user.name}`);
      console.log('');
    });
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();

