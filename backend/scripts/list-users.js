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

async function listUsers() {
  try {
    // MongoDB bağlantısı
    await mongoose.connect(process.env.MONGO_URI);
    log('✅ MongoDB bağlandı\n', 'green');

    // Tüm kullanıcıları getir
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });

    log('═══════════════════════════════════════════════════════', 'cyan');
    log('📊 VERİTABANI KULLANICI RAPORU', 'cyan');
    log('═══════════════════════════════════════════════════════', 'cyan');
    log(`\n📈 Toplam Kullanıcı Sayısı: ${users.length}\n`, 'yellow');

    if (users.length === 0) {
      log('⚠️  Veritabanında kullanıcı bulunamadı!', 'yellow');
      await mongoose.disconnect();
      return;
    }

    // Rol bazlı sayılar
    const roleCounts = {};
    users.forEach(user => {
      const role = user.role || 'user';
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    });

    log('📋 ROL DAĞILIMI:', 'blue');
    log('─'.repeat(50), 'blue');
    Object.entries(roleCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([role, count]) => {
        const percentage = ((count / users.length) * 100).toFixed(1);
        log(`   ${role.padEnd(15)} : ${count.toString().padStart(3)} kullanıcı (${percentage}%)`, 'cyan');
      });

    log('\n👥 KULLANICI LİSTESİ:', 'blue');
    log('─'.repeat(80), 'blue');

    users.forEach((user, index) => {
      const role = user.role || 'user';
      const roles = user.roles && user.roles.length > 0 ? user.roles.join(', ') : role;
      const activeRole = user.activeRole || role;
      
      log(`\n${(index + 1).toString().padStart(3)}. ${user.name}`, 'green');
      log(`     Email      : ${user.email}`, 'white');
      log(`     Rol        : ${role}`, role === 'admin' || role === 'superadmin' ? 'red' : role === 'recruiter' ? 'yellow' : 'cyan');
      if (user.roles && user.roles.length > 1) {
        log(`     Roller     : [${roles}]`, 'magenta');
        log(`     Aktif Rol  : ${activeRole}`, 'magenta');
      }
      log(`     Telefon    : ${user.phone || 'N/A'}`, 'white');
      log(`     Oluşturma  : ${user.createdAt ? new Date(user.createdAt).toLocaleString('tr-TR') : 'N/A'}`, 'white');
      if (user.lastLogin) {
        log(`     Son Giriş  : ${new Date(user.lastLogin).toLocaleString('tr-TR')}`, 'white');
      }
    });

    log('\n═══════════════════════════════════════════════════════', 'cyan');
    log('✅ Rapor tamamlandı!', 'green');
    log('═══════════════════════════════════════════════════════\n', 'cyan');

    await mongoose.disconnect();
  } catch (error) {
    log(`\n❌ Hata: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

listUsers();





