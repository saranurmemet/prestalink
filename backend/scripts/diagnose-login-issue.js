const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const User = require('../models/User');

dotenv.config();

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

async function checkMongoConnection() {
  log('\n📊 MongoDB Bağlantı Kontrolü', 'cyan');
  log('─'.repeat(50), 'cyan');
  
  if (!process.env.MONGO_URI) {
    log('❌ MONGO_URI environment variable tanımlı değil!', 'red');
    log('   Backend/.env dosyasında MONGO_URI ekleyin.', 'yellow');
    return false;
  }
  
  try {
    await mongoose.connect(process.env.MONGO_URI);
    log('✅ MongoDB bağlantısı başarılı', 'green');
    log(`   Host: ${mongoose.connection.host}`, 'blue');
    return true;
  } catch (error) {
    log('❌ MongoDB bağlantı hatası:', 'red');
    log(`   ${error.message}`, 'red');
    return false;
  }
}

async function checkUsers() {
  log('\n👥 Kullanıcı Kontrolü', 'cyan');
  log('─'.repeat(50), 'cyan');
  
  try {
    const users = await User.find({});
    log(`✅ Toplam ${users.length} kullanıcı bulundu`, 'green');
    
    if (users.length === 0) {
      log('⚠️  Veritabanında kullanıcı yok!', 'yellow');
      log('   Seed script çalıştırın: npm run seed', 'yellow');
      return false;
    }
    
    // Rol bazlı kullanıcı sayıları
    const roleCounts = {};
    users.forEach(user => {
      roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;
    });
    
    log('\n   Rol Dağılımı:', 'blue');
    Object.entries(roleCounts).forEach(([role, count]) => {
      log(`   - ${role}: ${count} kullanıcı`, 'blue');
    });
    
    // Test kullanıcıları kontrol et
    const testUsers = users.filter(u => 
      u.email.includes('mehmet') || 
      u.email.includes('sara') ||
      u.email.includes('test')
    );
    
    if (testUsers.length > 0) {
      log('\n   Test Kullanıcıları:', 'blue');
      testUsers.slice(0, 5).forEach(user => {
        log(`   - ${user.email} (${user.role})`, 'blue');
      });
    }
    
    return true;
  } catch (error) {
    log('❌ Kullanıcı kontrolü hatası:', 'red');
    log(`   ${error.message}`, 'red');
    return false;
  }
}

async function checkBackendServer() {
  log('\n🌐 Backend Sunucu Kontrolü', 'cyan');
  log('─'.repeat(50), 'cyan');
  
  const port = process.env.PORT || 5000;
  const baseUrl = `http://localhost:${port}`;
  
  try {
    const response = await axios.get(`${baseUrl}/`, { timeout: 3000 });
    log('✅ Backend sunucu çalışıyor', 'green');
    log(`   URL: ${baseUrl}`, 'blue');
    log(`   Response: ${JSON.stringify(response.data)}`, 'blue');
    return true;
  } catch (error) {
    log('❌ Backend sunucuya bağlanılamıyor', 'red');
    log(`   URL: ${baseUrl}`, 'yellow');
    if (error.code === 'ECONNREFUSED') {
      log('   Backend çalışmıyor olabilir. Şu komutu çalıştırın:', 'yellow');
      log('   cd backend && npm run dev', 'yellow');
    } else {
      log(`   Hata: ${error.message}`, 'red');
    }
    return false;
  }
}

async function checkLoginEndpoint() {
  log('\n🔐 Login Endpoint Kontrolü', 'cyan');
  log('─'.repeat(50), 'cyan');
  
  const port = process.env.PORT || 5000;
  const baseUrl = `http://localhost:${port}/api`;
  
  const endpoints = [
    '/auth/login',
    '/auth/user/login',
    '/auth/recruiter/login',
    '/auth/admin/login',
  ];
  
  let allWorking = true;
  
  for (const endpoint of endpoints) {
    try {
      // Sadece endpoint'in var olup olmadığını kontrol et (401 bekliyoruz)
      const response = await axios.post(
        `${baseUrl}${endpoint}`,
        { email: 'test@test.com', password: 'test' },
        { validateStatus: (status) => status < 500, timeout: 3000 }
      );
      
      if (response.status === 401 || response.status === 400) {
        log(`✅ ${endpoint} - Çalışıyor (${response.status})`, 'green');
      } else {
        log(`⚠️  ${endpoint} - Beklenmeyen durum: ${response.status}`, 'yellow');
        allWorking = false;
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        log(`❌ ${endpoint} - Backend çalışmıyor`, 'red');
        allWorking = false;
      } else {
        log(`❌ ${endpoint} - Hata: ${error.message}`, 'red');
        allWorking = false;
      }
    }
  }
  
  return allWorking;
}

async function checkEnvironmentVariables() {
  log('\n⚙️  Environment Variables Kontrolü', 'cyan');
  log('─'.repeat(50), 'cyan');
  
  const required = ['MONGO_URI', 'JWT_SECRET'];
  const optional = ['PORT', 'CLIENT_URL', 'NODE_ENV'];
  
  let allPresent = true;
  
  log('\n   Gerekli Değişkenler:', 'blue');
  required.forEach(key => {
    if (process.env[key]) {
      log(`   ✅ ${key} - Tanımlı`, 'green');
    } else {
      log(`   ❌ ${key} - Eksik!`, 'red');
      allPresent = false;
    }
  });
  
  log('\n   Opsiyonel Değişkenler:', 'blue');
  optional.forEach(key => {
    if (process.env[key]) {
      log(`   ✅ ${key} - ${process.env[key]}`, 'green');
    } else {
      log(`   ⚠️  ${key} - Tanımlı değil (varsayılan kullanılacak)`, 'yellow');
    }
  });
  
  if (process.env.CLIENT_URL) {
    log(`\n   CORS İzin Verilen URL'ler:`, 'blue');
    process.env.CLIENT_URL.split(',').forEach(url => {
      log(`   - ${url.trim()}`, 'blue');
    });
  } else {
    log(`\n   ⚠️  CLIENT_URL tanımlı değil - Varsayılan: http://localhost:3000`, 'yellow');
  }
  
  return allPresent;
}

async function testLogin() {
  log('\n🧪 Test Login', 'cyan');
  log('─'.repeat(50), 'cyan');
  
  try {
    const testUser = await User.findOne({ email: /mehmet.*user/ });
    
    if (!testUser) {
      log('⚠️  Test kullanıcısı bulunamadı', 'yellow');
      log('   Seed script çalıştırın: npm run seed', 'yellow');
      return false;
    }
  
    const port = process.env.PORT || 5000;
    const baseUrl = `http://localhost:${port}/api`;
    
    try {
      const response = await axios.post(
        `${baseUrl}/auth/user/login`,
        { 
          email: 'mehmet@prestalink.app', 
          password: 'mehmet' 
        },
        { timeout: 5000 }
      );
      
      if (response.data.token && response.data.user) {
        log('✅ Test login başarılı!', 'green');
        log(`   Kullanıcı: ${response.data.user.email}`, 'blue');
        log(`   Rol: ${response.data.user.role}`, 'blue');
        return true;
      } else {
        log('⚠️  Login yanıtı beklenmeyen formatta', 'yellow');
        return false;
      }
    } catch (error) {
      if (error.response) {
        log(`❌ Login hatası: ${error.response.status}`, 'red');
        log(`   Mesaj: ${error.response.data?.message || 'Bilinmeyen hata'}`, 'red');
      } else {
        log(`❌ Login hatası: ${error.message}`, 'red');
      }
      return false;
    }
  } catch (error) {
    log(`❌ Test login hatası: ${error.message}`, 'red');
    return false;
  }
}

async function main() {
  log('\n🔍 PRSTAlink Giriş Sorunu Tanılama', 'cyan');
  log('='.repeat(50), 'cyan');
  
  const results = {
    mongo: false,
    users: false,
    backend: false,
    endpoints: false,
    env: false,
    login: false,
  };
  
  // MongoDB bağlantısı
  results.mongo = await checkMongoConnection();
  
  if (results.mongo) {
    // Kullanıcı kontrolü
    results.users = await checkUsers();
  }
  
  // Backend sunucu kontrolü
  results.backend = await checkBackendServer();
  
  if (results.backend) {
    // Endpoint kontrolü
    results.endpoints = await checkLoginEndpoint();
    
    if (results.mongo && results.users) {
      // Test login
      results.login = await testLogin();
    }
  }
  
  // Environment variables
  results.env = await checkEnvironmentVariables();
  
  // Özet
  log('\n📋 ÖZET', 'cyan');
  log('='.repeat(50), 'cyan');
  
  const checks = [
    { name: 'MongoDB Bağlantısı', result: results.mongo },
    { name: 'Kullanıcılar', result: results.users },
    { name: 'Backend Sunucu', result: results.backend },
    { name: 'Login Endpoints', result: results.endpoints },
    { name: 'Environment Variables', result: results.env },
    { name: 'Test Login', result: results.login },
  ];
  
  checks.forEach(check => {
    const icon = check.result ? '✅' : '❌';
    const color = check.result ? 'green' : 'red';
    log(`${icon} ${check.name}`, color);
  });
  
  const allPassed = Object.values(results).every(r => r);
  
  if (allPassed) {
    log('\n✅ Tüm kontroller başarılı! Giriş sistemi çalışıyor olmalı.', 'green');
  } else {
    log('\n❌ Bazı sorunlar tespit edildi. Yukarıdaki hataları düzeltin.', 'red');
    
    log('\n🔧 Önerilen Çözümler:', 'yellow');
    
    if (!results.mongo) {
      log('1. MongoDB bağlantısını kontrol edin:', 'yellow');
      log('   - Local MongoDB: mongod çalıştırın', 'yellow');
      log('   - MongoDB Atlas: Connection string\'i kontrol edin', 'yellow');
      log('   - backend/.env dosyasında MONGO_URI ekleyin', 'yellow');
    }
    
    if (!results.users) {
      log('2. Kullanıcıları oluşturun:', 'yellow');
      log('   cd backend && npm run seed', 'yellow');
    }
    
    if (!results.backend) {
      log('3. Backend sunucusunu başlatın:', 'yellow');
      log('   cd backend && npm run dev', 'yellow');
    }
    
    if (!results.env) {
      log('4. Environment variables ekleyin:', 'yellow');
      log('   backend/.env dosyası oluşturun ve gerekli değişkenleri ekleyin', 'yellow');
    }
  }
  
  // Cleanup
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
  
  process.exit(allPassed ? 0 : 1);
}

main().catch(error => {
  log(`\n❌ Beklenmeyen hata: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});


