const User = require('../models/User');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const profilePhotos = [
  { email: 'mehmet@prestalink.app', photo: 'https://i.pravatar.cc/400?img=12' },
  { email: 'ahmet@prestalink.app', photo: 'https://i.pravatar.cc/400?img=15' },
  { email: 'sara@prestalink.app', photo: 'https://i.pravatar.cc/400?img=47' },
  { email: 'sarad@prestalink.app', photo: 'https://i.pravatar.cc/400?img=48' }
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected\n');

    console.log('🖼️  Updating profile photos...\n');
    
    for (const item of profilePhotos) {
      const result = await User.updateOne(
        { email: item.email },
        { profilePhoto: item.photo }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`✅ ${item.email} -> ${item.photo}`);
      } else {
        console.log(`⚠️  ${item.email} not found`);
      }
    }
    
    console.log('\n✅ All profile photos updated!');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();
