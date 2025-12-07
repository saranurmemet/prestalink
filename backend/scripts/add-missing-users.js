// Sadece eksik kullanıcıları oluştur
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');

const addMissingUsers = async () => {
  try {
    console.log('🔄 MongoDB bağlanıyor...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB bağlandı\n');

    // Eksik kullanıcılar
    const missingUsers = [
      { name: 'Ahmet', email: 'ahmet@prestalink.app', phone: '+905551234567', password: 'ahmet', languages: ['EN', 'TR', 'AR'] },
      { name: 'Sara', email: 'sara@prestalink.app', phone: '+905551234568', password: 'sara', languages: ['EN', 'FR'] },
      { name: 'Sarad', email: 'sarad@prestalink.app', phone: '+905551234569', password: 'sarad', languages: ['EN', 'FR', 'AR'] },
    ];

    const roles = ['user', 'recruiter', 'admin'];
    
    console.log('👤 Eksik kullanıcılar oluşturuluyor...\n');
    
    let created = 0;
    let skipped = 0;

    for (const userData of missingUsers) {
      for (const role of roles) {
        const email = `${userData.email.split('@')[0]}_${role}@prestalink.app`;
        
        const existing = await User.findOne({ email });
        if (existing) {
          console.log(`⏭️  Zaten var: ${email}`);
          skipped++;
          continue;
        }
        
        await User.create({
          ...userData,
          email,
          role,
        });
        
        console.log(`✅ Oluşturuldu: ${email} (${role})`);
        created++;
      }
    }

    console.log(`\n📊 ÖZET:`);
    console.log(`   ✅ Oluşturulan: ${created}`);
    console.log(`   ⏭️  Atlanan: ${skipped}`);
    console.log(`\n✅ Tamamlandı!\n`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
};

addMissingUsers();


