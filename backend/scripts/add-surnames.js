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
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function addSurnames() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    log('✅ MongoDB bağlandı\n', 'green');

    const surnameUpdates = [
      { email: 'ahmet@prestalink.app', name: 'Ahmet Suriye' },
      { email: 'sara@prestalink.app', name: 'Sara Soley' },
      { email: 'sarad@prestalink.app', name: 'Sarad Kaşgarlı' }
    ];

    log('═══════════════════════════════════════════════════════', 'cyan');
    log('👤 SOY İSİMLER EKLENİYOR', 'cyan');
    log('═══════════════════════════════════════════════════════\n', 'cyan');

    for (const update of surnameUpdates) {
      const user = await User.findOne({ email: update.email });
      
      if (user) {
        const oldName = user.name;
        user.name = update.name;
        await user.save();
        
        log(`   ✅ ${oldName} → ${update.name}`, 'green');
      } else {
        log(`   ❌ ${update.email} kullanıcısı bulunamadı`, 'red');
      }
    }

    // Tüm kullanıcıları listele
    const allUsers = await User.find({
      email: { $in: ['mehmet@prestalink.app', 'ahmet@prestalink.app', 'sara@prestalink.app', 'sarad@prestalink.app'] }
    }).select('email name').sort({ email: 1 });

    log('\n📊 GÜNCEL KULLANICI LİSTESİ:', 'cyan');
    log('─'.repeat(50), 'cyan');
    allUsers.forEach((user, index) => {
      log(`   ${(index + 1).toString().padStart(2)}. ${user.name.padEnd(25)} - ${user.email}`, 'green');
    });

    log('\n✅ Soy isimler eklendi!', 'green');
    await mongoose.disconnect();
  } catch (error) {
    log(`\n❌ Hata: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

addSurnames();





