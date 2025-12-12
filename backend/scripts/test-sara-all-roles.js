// Sara kullanıcısı ile tüm rollere giriş testi
const mongoose = require('mongoose');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

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

const testSaraLogin = async () => {
  try {
    log('\n🔐 Sara Kullanıcısı - Tüm Rollere Giriş Testi', 'cyan');
    log('='.repeat(60), 'cyan');

    // MongoDB bağlantısı
    log('\n📊 MongoDB bağlanıyor...', 'yellow');
    await mongoose.connect(process.env.MONGO_URI);
    log('✅ MongoDB bağlandı', 'green');

    // Sara kullanıcılarını kontrol et
    log('\n👤 Sara kullanıcıları kontrol ediliyor...', 'yellow');
    const saraUsers = await User.find({ email: /^sara_/ });
    
    if (saraUsers.length === 0) {
      log('❌ Sara kullanıcıları bulunamadı!', 'red');
      log('   Önce şu komutu çalıştırın: node scripts/add-missing-users.js', 'yellow');
      await mongoose.disconnect();
      process.exit(1);
    }

    log(`✅ ${saraUsers.length} Sara kullanıcısı bulundu:`, 'green');
    saraUsers.forEach(user => {
      log(`   - ${user.email} (${user.role})`, 'blue');
    });

    // Backend URL
    const port = process.env.PORT || 5000;
    const baseUrl = `http://localhost:${port}/api`;

    // Test edilecek roller
    const roles = [
      { name: 'User (İş Arayan)', endpoint: '/auth/user/login', role: 'user' },
      { name: 'Recruiter (İşveren)', endpoint: '/auth/recruiter/login', role: 'recruiter' },
      { name: 'Admin (Yönetici)', endpoint: '/auth/admin/login', role: 'admin' },
    ];

    log('\n🧪 Giriş testleri başlatılıyor...', 'yellow');
    log('─'.repeat(60), 'cyan');

    let successCount = 0;
    let failCount = 0;

    for (const roleTest of roles) {
      log(`\n📝 Test: ${roleTest.name}`, 'cyan');
      log(`   Endpoint: ${roleTest.endpoint}`, 'blue');
      log(`   Email: sara@prestalink.app`, 'blue');
      log(`   Şifre: sara`, 'blue');

      try {
        // Backend'e istek gönder
        const response = await axios.post(
          `${baseUrl}${roleTest.endpoint}`,
          {
            email: 'sara@prestalink.app',
            password: 'sara',
          },
          {
            timeout: 5000,
            validateStatus: (status) => status < 500, // 5xx hatalarını yakala
          }
        );

        if (response.status === 200 && response.data.token && response.data.user) {
          log(`   ✅ BAŞARILI!`, 'green');
          log(`   Kullanıcı: ${response.data.user.email}`, 'green');
          log(`   Rol: ${response.data.user.role}`, 'green');
          log(`   Token: ${response.data.token.substring(0, 20)}...`, 'green');
          
          // Rol kontrolü
          if (response.data.user.role === roleTest.role) {
            log(`   ✅ Rol doğru!`, 'green');
          } else {
            log(`   ⚠️  Rol uyuşmazlığı! Beklenen: ${roleTest.role}, Gelen: ${response.data.user.role}`, 'yellow');
          }
          
          successCount++;
        } else if (response.status === 401) {
          log(`   ❌ BAŞARISIZ: Kimlik doğrulama hatası`, 'red');
          log(`   Mesaj: ${response.data?.message || 'Invalid credentials'}`, 'red');
          failCount++;
        } else if (response.status === 403) {
          log(`   ❌ BAŞARISIZ: Yetki hatası`, 'red');
          log(`   Mesaj: ${response.data?.message || 'Forbidden'}`, 'red');
          failCount++;
        } else {
          log(`   ❌ BAŞARISIZ: Beklenmeyen durum kodu: ${response.status}`, 'red');
          log(`   Mesaj: ${JSON.stringify(response.data)}`, 'red');
          failCount++;
        }
      } catch (error) {
        if (error.code === 'ECONNREFUSED') {
          log(`   ❌ BAŞARISIZ: Backend çalışmıyor!`, 'red');
          log(`   Backend'i başlatın: cd backend && npm run dev`, 'yellow');
          failCount++;
        } else if (error.response) {
          log(`   ❌ BAŞARISIZ: ${error.response.status}`, 'red');
          log(`   Mesaj: ${error.response.data?.message || 'Bilinmeyen hata'}`, 'red');
          failCount++;
        } else {
          log(`   ❌ BAŞARISIZ: ${error.message}`, 'red');
          failCount++;
        }
      }
    }

    // Özet
    log('\n📊 TEST ÖZETİ', 'cyan');
    log('='.repeat(60), 'cyan');
    log(`✅ Başarılı: ${successCount}/${roles.length}`, successCount === roles.length ? 'green' : 'yellow');
    log(`❌ Başarısız: ${failCount}/${roles.length}`, failCount > 0 ? 'red' : 'green');

    if (successCount === roles.length) {
      log('\n🎉 Tüm testler başarılı! Sara ile tüm rollere giriş yapılabilir.', 'green');
    } else {
      log('\n⚠️  Bazı testler başarısız oldu. Yukarıdaki hataları kontrol edin.', 'yellow');
    }

    // MongoDB bağlantısını kapat
    await mongoose.disconnect();
    process.exit(successCount === roles.length ? 0 : 1);
  } catch (error) {
    log(`\n❌ Beklenmeyen hata: ${error.message}`, 'red');
    console.error(error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
};

testSaraLogin();


