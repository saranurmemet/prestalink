require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function fixProfilePhotos() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    log('✅ MongoDB bağlandı\n', 'green');

    const profilePhotosDir = path.join(__dirname, '..', 'uploads', 'profilePhotos');
    
    // Klasör yoksa oluştur
    if (!fs.existsSync(profilePhotosDir)) {
      fs.mkdirSync(profilePhotosDir, { recursive: true });
      log('📁 profilePhotos klasörü oluşturuldu', 'yellow');
    }

    // Kullanıcıları güncelle
    const users = [
      { email: 'ahmet@prestalink.app', photo: 'ahmet.png' },
      { email: 'sara@prestalink.app', photo: 'sara.png' },
      { email: 'sarad@prestalink.app', photo: 'sarad.png' }
    ];

    log('📸 Profil fotoğrafları güncelleniyor...\n', 'yellow');

    for (const { email, photo } of users) {
      const photoPath = path.join(profilePhotosDir, photo);
      const photoUrl = `/uploads/profilePhotos/${photo}`;

      // Dosya var mı kontrol et
      if (fs.existsSync(photoPath)) {
        const user = await User.findOne({ email });
        if (user) {
          user.profilePhoto = photoUrl;
          await user.save();
          log(`   ✅ ${email} → ${photoUrl}`, 'green');
        } else {
          log(`   ⚠️  ${email} kullanıcısı bulunamadı`, 'yellow');
        }
      } else {
        log(`   ❌ ${photo} dosyası bulunamadı: ${photoPath}`, 'red');
      }
    }

    // Mehmet'in profil fotoğrafını kontrol et
    const mehmet = await User.findOne({ email: 'mehmet@prestalink.app' });
    if (mehmet && !mehmet.profilePhoto) {
      mehmet.profilePhoto = 'https://i.pravatar.cc/400?img=12';
      await mehmet.save();
      log(`   ✅ mehmet@prestalink.app → varsayılan fotoğraf`, 'green');
    }

    log('\n✅ Profil fotoğrafları güncellendi!', 'green');

    // Özet
    const allUsers = await User.find({
      email: { $in: ['mehmet@prestalink.app', 'ahmet@prestalink.app', 'sara@prestalink.app', 'sarad@prestalink.app'] }
    }).select('email profilePhoto');

    log('\n📊 Profil Fotoğrafı Durumu:', 'cyan');
    allUsers.forEach(user => {
      const status = user.profilePhoto ? '✅' : '❌';
      log(`   ${status} ${user.email}: ${user.profilePhoto || 'YOK'}`, user.profilePhoto ? 'green' : 'red');
    });

    await mongoose.disconnect();
  } catch (error) {
    log(`\n❌ Hata: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

fixProfilePhotos();





