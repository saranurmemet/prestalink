require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Application = require('../models/Application');

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

async function checkCVContents() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    log('✅ MongoDB bağlandı\n', 'green');

    const demoEmails = ['mehmet@prestalink.app', 'ahmet@prestalink.app', 'sara@prestalink.app', 'sarad@prestalink.app'];
    const users = await User.find({ email: { $in: demoEmails } });

    log('═══════════════════════════════════════════════════════', 'cyan');
    log('📋 CV İÇERİKLERİ KONTROL EDİLİYOR', 'cyan');
    log('═══════════════════════════════════════════════════════\n', 'cyan');

    for (const user of users) {
      log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, 'blue');
      log(`👤 ${user.email}`, 'yellow');
      log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`, 'blue');
      
      log(`   İsim: ${user.name}`, 'cyan');
      log(`   CV URL: ${user.cvUrl || 'YOK'}`, 'cyan');
      
      if (user.cvContent) {
        const firstLine = user.cvContent.split('\n')[0];
        log(`   CV İlk Satır: "${firstLine}"`, 'cyan');
        
        // Mehmet Demir kontrolü
        if (user.cvContent.includes('MEHMET DEMIR') || user.cvContent.includes('Mehmet Demir')) {
          if (user.email !== 'mehmet@prestalink.app') {
            log(`   ❌ HATA: CV içinde "Mehmet Demir" bulundu ama kullanıcı ${user.email}!`, 'red');
          } else {
            log(`   ✅ CV içinde "Mehmet Demir" doğru (kendi CV'si)`, 'green');
          }
        }
        
        // Kullanıcı adı kontrolü
        if (user.cvContent.includes(user.name.toUpperCase()) || user.cvContent.includes(user.name)) {
          log(`   ✅ CV içinde kullanıcı adı "${user.name}" bulundu`, 'green');
        } else {
          log(`   ⚠️  CV içinde kullanıcı adı "${user.name}" bulunamadı!`, 'yellow');
        }
        
        log(`   CV Uzunluk: ${user.cvContent.length} karakter`, 'blue');
      } else {
        log(`   ❌ CV İçeriği YOK!`, 'red');
      }

      // Başvuruları kontrol et
      const applications = await Application.find({ userId: user._id });
      log(`\n   📝 Başvuru Sayısı: ${applications.length}`, 'cyan');
      
      for (const app of applications) {
        if (app.cvUrl) {
          log(`      - CV URL: ${app.cvUrl}`, 'blue');
        }
      }
    }

    log('\n═══════════════════════════════════════════════════════', 'cyan');
    log('✅ KONTROL TAMAMLANDI', 'green');
    log('═══════════════════════════════════════════════════════\n', 'cyan');

    await mongoose.disconnect();
  } catch (error) {
    log(`\n❌ Hata: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

checkCVContents();

