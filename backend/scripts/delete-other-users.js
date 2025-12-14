require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

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

async function deleteOtherUsers() {
  try {
    // MongoDB bağlantısı
    await mongoose.connect(process.env.MONGO_URI);
    log('✅ MongoDB bağlandı\n', 'green');

    // Korunacak kullanıcı email'leri
    const protectedEmails = [
      'mehmet@prestalink.app',
      'sara@prestalink.app',
      'ahmet@prestalink.app',
      'sarad@prestalink.app'
    ];

    log('═══════════════════════════════════════════════════════', 'cyan');
    log('🗑️  KULLANICI SİLME İŞLEMİ', 'cyan');
    log('═══════════════════════════════════════════════════════\n', 'cyan');

    log('🔒 Korunacak Kullanıcılar:', 'yellow');
    protectedEmails.forEach(email => {
      log(`   ✅ ${email}`, 'green');
    });
    log('');

    // Silinecek kullanıcıları bul
    const usersToDelete = await User.find({
      email: { $nin: protectedEmails }
    }).select('name email role');

    if (usersToDelete.length === 0) {
      log('ℹ️  Silinecek kullanıcı bulunamadı.', 'blue');
      await mongoose.disconnect();
      return;
    }

    log(`📋 Silinecek Kullanıcılar (${usersToDelete.length} adet):`, 'yellow');
    log('─'.repeat(60), 'yellow');
    usersToDelete.forEach((user, index) => {
      log(`   ${(index + 1).toString().padStart(2)}. ${user.name.padEnd(25)} - ${user.email} (${user.role})`, 'red');
    });
    log('');

    // Silme işlemi
    const deleteResult = await User.deleteMany({
      email: { $nin: protectedEmails }
    });

    log('═══════════════════════════════════════════════════════', 'cyan');
    log(`✅ ${deleteResult.deletedCount} kullanıcı silindi!`, 'green');
    log('═══════════════════════════════════════════════════════\n', 'cyan');

    // Kalan kullanıcıları listele
    const remainingUsers = await User.find({}).select('name email roles');
    log('📊 Kalan Kullanıcılar:', 'blue');
    log('─'.repeat(60), 'blue');
    remainingUsers.forEach((user, index) => {
      const roles = user.roles && user.roles.length > 0 
        ? `[${user.roles.join(', ')}]` 
        : user.role;
      log(`   ${(index + 1).toString().padStart(2)}. ${user.name.padEnd(25)} - ${user.email}`, 'green');
      log(`      Roller: ${roles}`, 'cyan');
    });

    log('\n✅ İşlem tamamlandı!', 'green');

    await mongoose.disconnect();
  } catch (error) {
    log(`\n❌ Hata: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

deleteOtherUsers();




