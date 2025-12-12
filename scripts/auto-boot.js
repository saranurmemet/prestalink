// PrestaLink Auto-Boot Script
// Backend ve Frontend'i otomatik başlatır, tarayıcıyı açar
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const os = require('os');

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

function execCommand(command, cwd = null) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr, stdout });
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

async function waitForServer(url, name, maxAttempts = 30) {
  log(`⏳ ${name} bekleniyor...`, 'yellow');
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await axios.get(url, { timeout: 3000 });
      if (response.status === 200) {
        log(`✅ ${name} hazır!`, 'green');
        return true;
      }
    } catch (e) {
      // Server henüz hazır değil
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  log(`❌ ${name} hazır değil!`, 'red');
  return false;
}

async function checkAndInstallDependencies(dir, name) {
  log(`\n📦 ${name} bağımlılıkları kontrol ediliyor...`, 'cyan');
  
  const packageJsonPath = path.join(dir, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    log(`❌ ${name}: package.json bulunamadı!`, 'red');
    return false;
  }
  
  const nodeModulesPath = path.join(dir, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    log(`⏳ ${name}: node_modules yok, yükleniyor...`, 'yellow');
    try {
      await execCommand('npm install', dir);
      log(`✅ ${name}: Bağımlılıklar yüklendi`, 'green');
    } catch (error) {
      log(`❌ ${name}: Bağımlılık yükleme hatası: ${error.stderr}`, 'red');
      return false;
    }
  } else {
    log(`✅ ${name}: Bağımlılıklar mevcut`, 'green');
  }
  
  return true;
}

async function checkBackendEnv() {
  log(`\n🔍 Backend .env kontrol ediliyor...`, 'cyan');
  const envPath = path.join(__dirname, '..', 'backend', '.env');
  const envExamplePath = path.join(__dirname, '..', 'backend', '.env.example');
  
  if (!fs.existsSync(envPath)) {
    log(`⚠️  Backend .env dosyası yok!`, 'yellow');
    if (fs.existsSync(envExamplePath)) {
      log(`📝 .env.example'dan .env oluşturuluyor...`, 'yellow');
      const exampleContent = fs.readFileSync(envExamplePath, 'utf8');
      fs.writeFileSync(envPath, exampleContent);
      log(`✅ .env dosyası oluşturuldu (lütfen değerleri doldurun)`, 'green');
    } else {
      log(`⚠️  .env.example da yok, varsayılan .env oluşturuluyor...`, 'yellow');
      const defaultEnv = `MONGO_URI=mongodb://localhost:27017/prestalink
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5000
HOST=0.0.0.0
NODE_ENV=development
CLIENT_URL=http://localhost:3000
`;
      fs.writeFileSync(envPath, defaultEnv);
      log(`✅ Varsayılan .env oluşturuldu`, 'green');
    }
  } else {
    log(`✅ Backend .env mevcut`, 'green');
  }
}

async function checkFrontendEnv() {
  log(`\n🔍 Frontend .env kontrol ediliyor...`, 'cyan');
  const envPath = path.join(__dirname, '..', 'frontend', '.env');
  const envLocalPath = path.join(__dirname, '..', 'frontend', '.env.local');
  const envExamplePath = path.join(__dirname, '..', 'frontend', '.env.example');
  
  const targetPath = envLocalPath; // Next.js .env.local kullanır
  
  if (!fs.existsSync(targetPath) && !fs.existsSync(envPath)) {
    log(`⚠️  Frontend .env dosyası yok!`, 'yellow');
    if (fs.existsSync(envExamplePath)) {
      log(`📝 .env.example'dan .env.local oluşturuluyor...`, 'yellow');
      const exampleContent = fs.readFileSync(envExamplePath, 'utf8');
      fs.writeFileSync(targetPath, exampleContent);
      log(`✅ .env.local dosyası oluşturuldu`, 'green');
    } else {
      log(`⚠️  .env.example da yok, varsayılan .env.local oluşturuluyor...`, 'yellow');
      const defaultEnv = `NEXT_PUBLIC_API_URL=http://localhost:5000/api
`;
      fs.writeFileSync(targetPath, defaultEnv);
      log(`✅ Varsayılan .env.local oluşturuldu`, 'green');
    }
  } else {
    log(`✅ Frontend .env mevcut`, 'green');
  }
}

async function startBackend() {
  log(`\n🚀 Backend başlatılıyor...`, 'cyan');
  const backendDir = path.join(__dirname, '..', 'backend');
  
  // Bağımlılıkları kontrol et
  const depsOk = await checkAndInstallDependencies(backendDir, 'Backend');
  if (!depsOk) {
    return false;
  }
  
  // .env kontrolü
  await checkBackendEnv();
  
  // Backend'i ayrı terminal penceresinde başlat
  const platform = os.platform();
  let command;
  
  if (platform === 'win32') {
    command = `start "PrestaLink Backend" cmd /k "cd /d "${backendDir}" && node server.js"`;
  } else if (platform === 'darwin') {
    command = `osascript -e 'tell app "Terminal" to do script "cd ${backendDir} && node server.js"'`;
  } else {
    command = `gnome-terminal -- bash -c "cd ${backendDir} && node server.js; exec bash"`;
  }
  
  exec(command, (error) => {
    if (error) {
      log(`⚠️  Backend terminal açılamadı, normal modda başlatılıyor...`, 'yellow');
      // Fallback: normal spawn
      const backendProcess = spawn('node', ['server.js'], {
        cwd: backendDir,
        stdio: 'pipe',
        shell: true,
      });
    }
  });
  
  // Backend'in hazır olmasını bekle
  const ready = await waitForServer('http://localhost:5000', 'Backend', 20);
  return ready;
}

async function startFrontend() {
  log(`\n🚀 Frontend başlatılıyor...`, 'cyan');
  const frontendDir = path.join(__dirname, '..', 'frontend');
  
  // Bağımlılıkları kontrol et
  const depsOk = await checkAndInstallDependencies(frontendDir, 'Frontend');
  if (!depsOk) {
    return false;
  }
  
  // .env kontrolü
  await checkFrontendEnv();
  
  // Frontend'i ayrı terminal penceresinde başlat
  const platform = os.platform();
  let command;
  
  if (platform === 'win32') {
    command = `start "PrestaLink Frontend" cmd /k "cd /d "${frontendDir}" && npm run dev"`;
  } else if (platform === 'darwin') {
    command = `osascript -e 'tell app "Terminal" to do script "cd ${frontendDir} && npm run dev"'`;
  } else {
    command = `gnome-terminal -- bash -c "cd ${frontendDir} && npm run dev; exec bash"`;
  }
  
  exec(command, (error) => {
    if (error) {
      log(`⚠️  Frontend terminal açılamadı, normal modda başlatılıyor...`, 'yellow');
      // Fallback: normal spawn
      const frontendProcess = spawn('npm', ['run', 'dev'], {
        cwd: frontendDir,
        stdio: 'pipe',
        shell: true,
      });
    }
  });
  
  // Frontend'in hazır olmasını bekle (Next.js daha uzun sürebilir)
  log(`⏳ Frontend başlatılıyor, lütfen bekleyin (60 saniye)...`, 'yellow');
  const ready = await waitForServer('http://localhost:3000', 'Frontend', 60);
  return ready;
}

function openBrowser(url) {
  log(`\n🌐 Tarayıcı açılıyor: ${url}`, 'cyan');
  const platform = os.platform();
  
  let command;
  if (platform === 'win32') {
    command = `start ${url}`;
  } else if (platform === 'darwin') {
    command = `open ${url}`;
  } else {
    command = `xdg-open ${url}`;
  }
  
  exec(command, (error) => {
    if (error) {
      log(`❌ Tarayıcı açılamadı: ${error.message}`, 'red');
    } else {
      log(`✅ Tarayıcı açıldı!`, 'green');
    }
  });
}

async function testAPIEndpoints() {
  log(`\n🧪 API Endpoint Testleri`, 'cyan');
  log('─'.repeat(50), 'cyan');
  
  const endpoints = [
    { method: 'GET', path: 'http://localhost:5000/', expectedStatus: 200 },
    { method: 'GET', path: 'http://localhost:5000/api/jobs', expectedStatus: 200 },
    { method: 'POST', path: 'http://localhost:5000/api/auth/login', expectedStatus: 401, data: { email: 'test', password: 'test' } },
  ];
  
  for (const endpoint of endpoints) {
    try {
      const config = {
        method: endpoint.method,
        url: endpoint.path,
        validateStatus: () => true,
        timeout: 5000,
      };
      
      if (endpoint.data) {
        config.data = endpoint.data;
        config.headers = { 'Content-Type': 'application/json' };
      }
      
      const response = await axios(config);
      
      if (response.status === endpoint.expectedStatus) {
        log(`✅ ${endpoint.method} ${endpoint.path}: OK (${response.status})`, 'green');
      } else {
        log(`⚠️  ${endpoint.method} ${endpoint.path}: Expected ${endpoint.expectedStatus}, got ${response.status}`, 'yellow');
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        log(`❌ ${endpoint.method} ${endpoint.path}: Backend not running`, 'red');
      } else {
        log(`⚠️  ${endpoint.method} ${endpoint.path}: ${error.message}`, 'yellow');
      }
    }
  }
}

async function main() {
  log('\n🚀 PRESTALINK AUTO-BOOT', 'cyan');
  log('='.repeat(60), 'cyan');
  
  // 1. Backend başlat
  const backendReady = await startBackend();
  if (!backendReady) {
    log('\n❌ Backend başlatılamadı!', 'red');
    process.exit(1);
  }
  
  // 2. Frontend başlat
  const frontendReady = await startFrontend();
  if (!frontendReady) {
    log('\n❌ Frontend başlatılamadı!', 'red');
    process.exit(1);
  }
  
  // 3. Tarayıcıyı aç
  await new Promise(resolve => setTimeout(resolve, 3000)); // 3 saniye bekle
  openBrowser('http://localhost:3000');
  
  // 4. API testleri
  await testAPIEndpoints();
  
  // Başarı mesajı
  log('\n' + '='.repeat(60), 'cyan');
  log('✅ PRESTALINK AUTO-BOOT + LOCAL BROWSER LAUNCH BAŞARILI', 'green');
  log('🌐 UYGULAMA OTOMATİK TARAYICIDA AÇILDI', 'green');
  log('='.repeat(60), 'cyan');
  log('\n📍 Test URL\'leri:', 'cyan');
  log('   - Ana Sayfa: http://localhost:3000', 'white');
  log('   - Login: http://localhost:3000/login', 'white');
  log('   - Register: http://localhost:3000/register', 'white');
  log('   - Admin Dashboard: http://localhost:3000/admin/dashboard', 'white');
  log('   - User Dashboard: http://localhost:3000/user/dashboard', 'white');
  log('   - Recruiter Dashboard: http://localhost:3000/employer/dashboard', 'white');
  log('\n💡 Sunucular çalışmaya devam edecek. Durdurmak için Ctrl+C', 'yellow');
}

main().catch(error => {
  log(`\n❌ Hata: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});

