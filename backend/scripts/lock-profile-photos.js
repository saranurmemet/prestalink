/**
 * PROFILE PHOTOS LOCK SCRIPT
 * Bu script demo kullanıcılarının profil fotoğraflarını kalıcı olarak ayarlar ve korur.
 * ⚠️ BU DOSYA DEĞİŞTİRİLEMEZ - PROFİL FOTOĞRAFLARI KİLİTLİDİR
 * 
 * Profil fotoğrafları: backend/uploads/profile-photos/ klasöründen çağrılır
 * Bu bir kuraldır ve hiç değişmez!
 */

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
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// ⚠️ KİLİTLİ PROFİL FOTOĞRAFLARI - DEĞİŞTİRİLEMEZ (YEREL DOSYALAR)
// Profil fotoğrafları backend/uploads/profile-photos/ klasöründen çağrılır
// Bu bir kuraldır ve hiç değişmez!
const LOCKED_PROFILE_PHOTOS = {
  'mehmet@prestalink.app': '/uploads/profile-photos/mehmet.png',
  'ahmet@prestalink.app': '/uploads/profile-photos/ahmet.png',
  'sara@prestalink.app': '/uploads/profile-photos/sara.png',
  'sarad@prestalink.app': '/uploads/profile-photos/sarad.png',
};

// ⚠️ KİLİTLİ İSİMLER - DEĞİŞTİRİLEMEZ
const LOCKED_NAMES = {
  'mehmet@prestalink.app': 'Mehmet Demir',
  'ahmet@prestalink.app': 'Ahmet Suriye',
  'sara@prestalink.app': 'Sara Soley',
  'sarad@prestalink.app': 'Sarad Kaşgarlı',
};

async function lockProfilePhotos() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    log('✅ MongoDB bağlandı\n', 'green');

    // Profil fotoğrafları klasörünü kontrol et
    const profilePhotosDir = path.join(__dirname, '..', 'uploads', 'profile-photos');
    if (!fs.existsSync(profilePhotosDir)) {
      fs.mkdirSync(profilePhotosDir, { recursive: true });
      log('📁 Profil fotoğrafları klasörü oluşturuldu', 'yellow');
    }

    log('═══════════════════════════════════════════════════════', 'cyan');
    log('🔒 PROFİL FOTOĞRAFLARI KİLİTLENİYOR', 'cyan');
    log('═══════════════════════════════════════════════════════\n', 'cyan');

    let updatedCount = 0;
    let fixedCount = 0;
    let missingFiles = [];

    for (const [email, lockedPhoto] of Object.entries(LOCKED_PROFILE_PHOTOS)) {
      const user = await User.findOne({ email });
      
      if (!user) {
        log(`   ❌ ${email} kullanıcısı bulunamadı`, 'red');
        continue;
      }

      // Fotoğraf dosyasının varlığını kontrol et
      const photoPath = path.join(__dirname, '..', lockedPhoto);
      if (!fs.existsSync(photoPath)) {
        missingFiles.push({ email, photo: lockedPhoto });
        log(`   ⚠️  ${user.name}: Fotoğraf dosyası bulunamadı: ${lockedPhoto}`, 'yellow');
      }

      const oldPhoto = user.profilePhoto || '(yok)';
      const oldName = user.name || '(yok)';
      
      // Profil fotoğrafını kilitle
      user.profilePhoto = lockedPhoto;
      
      // İsmi de kilitle
      if (LOCKED_NAMES[email]) {
        user.name = LOCKED_NAMES[email];
      }

      // Zorla kaydet (markModified kullanarak)
      user.markModified('profilePhoto');
      user.markModified('name');
      
      await user.save({ validateBeforeSave: false });

      if (oldPhoto !== lockedPhoto) {
        log(`   ✅ ${user.name}: Fotoğraf güncellendi`, 'green');
        log(`      Eski: ${oldPhoto}`, 'yellow');
        log(`      Yeni: ${lockedPhoto}`, 'green');
        fixedCount++;
      } else {
        log(`   🔒 ${user.name}: Fotoğraf zaten doğru (kilitli)`, 'cyan');
      }

      if (oldName !== LOCKED_NAMES[email]) {
        log(`   ✅ ${email}: İsim güncellendi: "${oldName}" → "${LOCKED_NAMES[email]}"`, 'green');
      }

      updatedCount++;
    }

    if (missingFiles.length > 0) {
      log('\n⚠️  EKSİK FOTOĞRAF DOSYALARI:', 'yellow');
      missingFiles.forEach(({ email, photo }) => {
        log(`   ${email}: ${photo}`, 'yellow');
      });
      log('\n💡 Bu dosyaları backend/uploads/profile-photos/ klasörüne ekleyin!', 'cyan');
    }

    log('\n═══════════════════════════════════════════════════════', 'cyan');
    log('✅ PROFİL FOTOĞRAFLARI KİLİTLENDİ!', 'green');
    log('═══════════════════════════════════════════════════════\n', 'cyan');

    log('📊 ÖZET:', 'yellow');
    log(`   👥 Toplam Kullanıcı: ${updatedCount}`, 'cyan');
    log(`   🔧 Düzeltilen Fotoğraf: ${fixedCount}`, 'cyan');
    log(`   🔒 Kilitli Fotoğraf: ${updatedCount - fixedCount}`, 'cyan');

    log('\n⚠️  ÖNEMLİ KURAL:', 'yellow');
    log('   Profil fotoğrafları: backend/uploads/profile-photos/ klasöründen çağrılır', 'yellow');
    log('   Bu bir kuraldır ve HİÇ DEĞİŞMEZ!', 'yellow');
    log('   Her çalıştırmada bu fotoğraflar otomatik olarak geri getirilecektir.\n', 'yellow');

    await mongoose.disconnect();
    log('✅ İşlem tamamlandı!', 'green');
  } catch (error) {
    log(`\n❌ Hata: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

lockProfilePhotos();


