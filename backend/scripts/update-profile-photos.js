const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function updateProfilePhotos() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected\n');

    const updates = [
      { email: 'mehmet@prestalink.app', photo: '/uploads/profiles/mehmet.png' },
      { email: 'ahmet@prestalink.app', photo: '/uploads/profiles/ahmet.png' },
      { email: 'sara@prestalink.app', photo: '/uploads/profiles/sara.png' },
      { email: 'sarad@prestalink.app', photo: '/uploads/profiles/sarad.png' }
    ];

    for (const { email, photo } of updates) {
      const result = await User.updateOne(
        { email },
        { $set: { profilePhoto: photo } }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`✅ ${email} → ${photo}`);
      } else {
        console.log(`⚠️  ${email} not found or already updated`);
      }
    }

    console.log('\n🎉 Profile photos updated!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateProfilePhotos();
