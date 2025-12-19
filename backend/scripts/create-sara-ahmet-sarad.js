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

async function createMultiRoleUsers() {
  try {
    // MongoDB bağlantısı
    await mongoose.connect(process.env.MONGO_URI);
    log('✅ MongoDB bağlandı\n', 'green');

    // Tüm rolleri içeren kullanıcılar
    const allRoles = ['user', 'recruiter', 'admin', 'superadmin'];
    
    const users = [
      {
        name: 'Mehmet Demir',
        email: 'mehmet@prestalink.app',
        password: 'mehmet',
        phone: '+905551234567',
        roles: allRoles,
        activeRole: 'user',
        role: 'user', // Default role
      },
      {
        name: 'Sara',
        email: 'sara@prestalink.app',
        password: 'sara',
        phone: '+905551234568',
        roles: allRoles,
        activeRole: 'user',
        role: 'user',
      },
      {
        name: 'Ahmet',
        email: 'ahmet@prestalink.app',
        password: 'ahmet',
        phone: '+905551234569',
        roles: allRoles,
        activeRole: 'user',
        role: 'user',
      },
      {
        name: 'Sarad',
        email: 'sarad@prestalink.app',
        password: 'sarad',
        phone: '+905551234570',
        roles: allRoles,
        activeRole: 'user',
        role: 'user',
      },
    ];

    log('═══════════════════════════════════════════════════════', 'cyan');
    log('👥 MULTI-ROLE KULLANICILAR OLUŞTURULUYOR', 'cyan');
    log('═══════════════════════════════════════════════════════\n', 'cyan');

    for (const userData of users) {
      log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, 'blue');
      log(`👤 İşleniyor: ${userData.name}`, 'yellow');
      log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`, 'blue');

      // Mevcut kullanıcıyı kontrol et
      let user = await User.findOne({ email: userData.email });

      if (user) {
        log(`   ⚠️  Kullanıcı zaten mevcut, güncelleniyor...`, 'yellow');
        
        // Tüm rolleri ve bilgileri güncelle
        user.name = userData.name;
        user.phone = userData.phone;
        user.roles = userData.roles;
        user.activeRole = userData.activeRole;
        user.role = userData.role;
        user.password = userData.password; // Şifre hash'lenecek (pre-save hook)
        
        await user.save();
        log(`   ✅ Kullanıcı güncellendi`, 'green');
      } else {
        log(`   📝 Yeni kullanıcı oluşturuluyor...`, 'cyan');
        user = await User.create(userData);
        log(`   ✅ Kullanıcı oluşturuldu`, 'green');
      }

      log(`\n   📋 Kullanıcı Bilgileri:`, 'cyan');
      log(`      ID        : ${user._id}`, 'white');
      log(`      İsim      : ${user.name}`, 'white');
      log(`      Email     : ${user.email}`, 'white');
      log(`      Şifre     : ${userData.password}`, 'white');
      log(`      Telefon   : ${user.phone}`, 'white');
      log(`      Roller    : [${user.roles.join(', ')}]`, 'magenta');
      log(`      Aktif Rol : ${user.activeRole}`, 'magenta');
      log(`      Default   : ${user.role}`, 'cyan');
    }

    log('\n═══════════════════════════════════════════════════════', 'cyan');
    log('✅ TÜM KULLANICILAR HAZIR!', 'green');
    log('═══════════════════════════════════════════════════════\n', 'cyan');

    log('🔐 GİRİŞ BİLGİLERİ:', 'yellow');
    log('─'.repeat(50), 'yellow');
    users.forEach(u => {
      log(`   ${u.email.padEnd(30)} → Şifre: ${u.password}`, 'cyan');
      log(`   Roller: [${u.roles.join(', ')}]`, 'magenta');
    });

    log('\n💡 Bu kullanıcılar tüm rollere (user, recruiter, admin, superadmin) erişebilir!', 'green');
    log('💡 Login sayfasında role seçimi yapabilirsiniz.\n', 'green');

    await mongoose.disconnect();
    log('✅ İşlem tamamlandı!', 'green');
  } catch (error) {
    log(`\n❌ Hata: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

createMultiRoleUsers();





