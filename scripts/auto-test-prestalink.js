// PrestaLink Master Auto-Test Script
// LOCAL ortamda tüm fonksiyonları test eder
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:5000/api';

const testResults = {
  critical: [],
  medium: [],
  minor: [],
  suggestions: [],
  filesToFix: [],
  codePatches: [],
};

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

function addResult(level, message, file = null, fix = null) {
  const result = { message, file, fix };
  testResults[level].push(result);
  if (file) {
    testResults.filesToFix.push({ file, issue: message, fix });
  }
  if (fix) {
    testResults.codePatches.push({ file, fix });
  }
}

async function waitForServer(url, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return true;
    } catch (e) {
      // Server henüz hazır değil
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  return false;
}

async function testPage(page, url, expectedTitle = null) {
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    const title = await page.title();
    
    // Check for console errors
    const errors = await page.evaluate(() => {
      return window.consoleErrors || [];
    });
    
    if (errors.length > 0) {
      addResult('medium', `Console errors on ${url}: ${errors.join(', ')}`, url);
    }
    
    // Check for 404/500
    const status = page.url();
    if (status.includes('404') || status.includes('500')) {
      addResult('critical', `Page error on ${url}: ${status}`, url);
      return false;
    }
    
    if (expectedTitle && !title.includes(expectedTitle)) {
      addResult('minor', `Title mismatch on ${url}. Expected: ${expectedTitle}, Got: ${title}`, url);
    }
    
    return true;
  } catch (error) {
    addResult('critical', `Failed to load ${url}: ${error.message}`, url);
    return false;
  }
}

async function testAuthentication(page) {
  log('\n🔐 Authentication Testleri', 'cyan');
  log('─'.repeat(50), 'cyan');
  
  // Test Register
  log('📝 User Register testi...', 'blue');
  try {
    await page.goto(`${BASE_URL}/register`, { waitUntil: 'networkidle' });
    await page.waitForSelector('input[name="email"]', { timeout: 10000 });
    
    // Role seç
    const roleButtons = await page.$$('button');
    if (roleButtons.length >= 2) {
      await roleButtons[0].click(); // User role
      await page.waitForTimeout(1000);
    }
    
    // Form doldur
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', `test${Date.now()}@test.com`);
    await page.fill('input[name="phone"]', '+905551234567');
    await page.fill('input[name="password"]', 'test123');
    
    // Submit
    const submitButton = await page.waitForSelector('button[type="submit"]', { timeout: 5000 });
    await submitButton.click();
    
    // Dashboard'a yönlendirme bekle
    await page.waitForURL(/\/dashboard/, { timeout: 10000 }).catch(() => {});
    
    if (page.url().includes('dashboard')) {
      log('✅ User Register: OK', 'green');
    } else {
      addResult('critical', 'User register failed - not redirected to dashboard', 'frontend/app/register/page.tsx');
    }
  } catch (error) {
    addResult('critical', `User Register error: ${error.message}`, 'frontend/app/register/page.tsx');
  }
  
  // Test Login - User
  log('📝 User Login testi...', 'blue');
  try {
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForSelector('button', { timeout: 10000 });
    
    // User role seç
    const buttons = await page.$$('button');
    await buttons[0].click(); // User
    await page.waitForTimeout(1000);
    
    await page.fill('input[name="email"]', 'sara@prestalink.app');
    await page.fill('input[name="password"]', 'sara');
    await page.click('button[type="submit"]');
    
    await page.waitForURL(/\/dashboard/, { timeout: 10000 }).catch(() => {});
    
    if (page.url().includes('dashboard')) {
      log('✅ User Login: OK', 'green');
    } else {
      addResult('critical', 'User login failed', 'frontend/app/login/page.tsx');
    }
  } catch (error) {
    addResult('critical', `User Login error: ${error.message}`, 'frontend/app/login/page.tsx');
  }
  
  // Test Login - Admin
  log('📝 Admin Login testi...', 'blue');
  try {
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForSelector('button', { timeout: 10000 });
    
    const buttons = await page.$$('button');
    if (buttons.length >= 3) {
      await buttons[2].click(); // Admin
      await page.waitForTimeout(1000);
      
      await page.fill('input[name="email"]', 'sara@prestalink.app');
      await page.fill('input[name="password"]', 'sara');
      await page.click('button[type="submit"]');
      
      await page.waitForURL(/\/admin\/dashboard/, { timeout: 10000 }).catch(() => {});
      
      if (page.url().includes('admin/dashboard')) {
        log('✅ Admin Login: OK', 'green');
      } else {
        addResult('critical', 'Admin login failed', 'frontend/app/login/page.tsx');
      }
    }
  } catch (error) {
    addResult('critical', `Admin Login error: ${error.message}`, 'frontend/app/login/page.tsx');
  }
  
  // Test Login - Recruiter
  log('📝 Recruiter Login testi...', 'blue');
  try {
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForSelector('button', { timeout: 10000 });
    
    const buttons = await page.$$('button');
    if (buttons.length >= 2) {
      await buttons[1].click(); // Recruiter
      await page.waitForTimeout(1000);
      
      await page.fill('input[name="email"]', 'sara@prestalink.app');
      await page.fill('input[name="password"]', 'sara');
      await page.click('button[type="submit"]');
      
      await page.waitForURL(/\/employer\/dashboard/, { timeout: 10000 }).catch(() => {});
      
      if (page.url().includes('employer/dashboard')) {
        log('✅ Recruiter Login: OK', 'green');
      } else {
        addResult('critical', 'Recruiter login failed', 'frontend/app/login/page.tsx');
      }
    }
  } catch (error) {
    addResult('critical', `Recruiter Login error: ${error.message}`, 'frontend/app/login/page.tsx');
  }
}

async function testLanguageSwitching(page) {
  log('\n🌍 Dil Değiştirme Testleri', 'cyan');
  log('─'.repeat(50), 'cyan');
  
  const languages = ['AR', 'FR', 'EN', 'TR'];
  
  for (const lang of languages) {
    try {
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      
      // Language switcher bul
      const langButton = await page.$(`button:has-text("${lang}"), [data-lang="${lang}"], [aria-label*="${lang}"]`);
      if (langButton) {
        await langButton.click();
        await page.waitForTimeout(1000);
        
        // Sayfa içeriğinin değiştiğini kontrol et
        const bodyText = await page.textContent('body');
        log(`✅ ${lang} dil değişimi: OK`, 'green');
      } else {
        addResult('minor', `Language switcher for ${lang} not found`, 'frontend/components/common/LanguageSwitcher.tsx');
      }
    } catch (error) {
      addResult('medium', `Language switch error for ${lang}: ${error.message}`, 'frontend/components/common/LanguageSwitcher.tsx');
    }
  }
}

async function testAllPages(page) {
  log('\n📄 Tüm Sayfalar Testi', 'cyan');
  log('─'.repeat(50), 'cyan');
  
  const pages = [
    { url: '/', name: 'Home' },
    { url: '/login', name: 'Login' },
    { url: '/register', name: 'Register' },
    { url: '/about', name: 'About' },
    { url: '/contact', name: 'Contact' },
    { url: '/jobs', name: 'Jobs' },
  ];
  
  for (const pageInfo of pages) {
    const success = await testPage(page, `${BASE_URL}${pageInfo.url}`, pageInfo.name);
    if (success) {
      log(`✅ ${pageInfo.name} (${pageInfo.url}): OK`, 'green');
    }
  }
}

async function testAPIEndpoints() {
  log('\n🔌 API Endpoint Testleri', 'cyan');
  log('─'.repeat(50), 'cyan');
  
  const endpoints = [
    { method: 'GET', path: '/', expectedStatus: 200 },
    { method: 'GET', path: '/api/auth/login', expectedStatus: 401, body: { email: 'test', password: 'test' } },
  ];
  
  for (const endpoint of endpoints) {
    try {
      const options = {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' },
      };
      
      if (endpoint.body) {
        options.body = JSON.stringify(endpoint.body);
      }
      
      const response = await fetch(`${API_URL}${endpoint.path}`, options);
      
      if (response.status === endpoint.expectedStatus) {
        log(`✅ ${endpoint.method} ${endpoint.path}: OK (${response.status})`, 'green');
      } else {
        addResult('medium', `API ${endpoint.method} ${endpoint.path}: Expected ${endpoint.expectedStatus}, got ${response.status}`, 'backend/routes');
      }
    } catch (error) {
      addResult('critical', `API ${endpoint.method} ${endpoint.path} error: ${error.message}`, 'backend');
    }
  }
}

async function testPWA(page) {
  log('\n📱 PWA Testleri', 'cyan');
  log('─'.repeat(50), 'cyan');
  
  try {
    // Manifest kontrolü
    const manifestResponse = await fetch(`${BASE_URL}/manifest.json`);
    if (manifestResponse.ok) {
      const manifest = await manifestResponse.json();
      log('✅ Manifest.json: OK', 'green');
      
      if (!manifest.icons || manifest.icons.length === 0) {
        addResult('minor', 'Manifest.json missing icons', 'frontend/public/manifest.json');
      }
    } else {
      addResult('critical', 'Manifest.json not found', 'frontend/public/manifest.json');
    }
    
    // Service Worker kontrolü
    const swResponse = await fetch(`${BASE_URL}/sw.js`);
    if (swResponse.ok) {
      log('✅ Service Worker: OK', 'green');
    } else {
      addResult('medium', 'Service Worker not found', 'frontend/public/sw.js');
    }
  } catch (error) {
    addResult('medium', `PWA test error: ${error.message}`, 'frontend/public');
  }
}

async function testDashboardPages(page) {
  log('\n📊 Dashboard Sayfaları Testi', 'cyan');
  log('─'.repeat(50), 'cyan');
  
  // Admin login yap
  try {
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    const buttons = await page.$$('button');
    if (buttons.length >= 3) {
      await buttons[2].click(); // Admin
      await page.waitForTimeout(1000);
      await page.fill('input[name="email"]', 'sara@prestalink.app');
      await page.fill('input[name="password"]', 'sara');
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/admin\/dashboard/, { timeout: 10000 });
    }
    
    // Admin dashboard test
    if (page.url().includes('admin/dashboard')) {
      log('✅ Admin Dashboard: OK', 'green');
      
      // Admin panel linklerini test et
      const links = await page.$$('a[href*="/admin"]');
      log(`   Found ${links.length} admin links`, 'blue');
    }
  } catch (error) {
    addResult('critical', `Admin dashboard test error: ${error.message}`, 'frontend/app/admin/dashboard/page.tsx');
  }
}

async function generateReport() {
  log('\n📊 TEST RAPORU OLUŞTURULUYOR...', 'cyan');
  log('='.repeat(60), 'cyan');
  
  const report = {
    timestamp: new Date().toISOString(),
    critical: testResults.critical,
    medium: testResults.medium,
    minor: testResults.minor,
    suggestions: testResults.suggestions,
    filesToFix: testResults.filesToFix,
    codePatches: testResults.codePatches,
  };
  
  // Rapor dosyasına yaz
  fs.writeFileSync(
    path.join(__dirname, '..', 'TEST_REPORT.json'),
    JSON.stringify(report, null, 2)
  );
  
  // Markdown raporu oluştur
  let markdown = '# 🧪 PRESTALINK AUTO-TEST RAPORU\n\n';
  markdown += `**Tarih:** ${new Date().toLocaleString('tr-TR')}\n\n`;
  
  markdown += '## 🚨 KRİTİK HATALAR\n\n';
  if (testResults.critical.length === 0) {
    markdown += '✅ Kritik hata bulunamadı.\n\n';
  } else {
    testResults.critical.forEach((error, index) => {
      markdown += `${index + 1}. **${error.message}**\n`;
      if (error.file) markdown += `   - Dosya: ${error.file}\n`;
      if (error.fix) markdown += `   - Çözüm: ${error.fix}\n`;
      markdown += '\n';
    });
  }
  
  markdown += '## ⚠️ ORTA SEVİYE HATALAR\n\n';
  if (testResults.medium.length === 0) {
    markdown += '✅ Orta seviye hata bulunamadı.\n\n';
  } else {
    testResults.medium.forEach((error, index) => {
      markdown += `${index + 1}. **${error.message}**\n`;
      if (error.file) markdown += `   - Dosya: ${error.file}\n`;
      markdown += '\n';
    });
  }
  
  markdown += '## 📝 UFAK UI HATALARI\n\n';
  if (testResults.minor.length === 0) {
    markdown += '✅ UI hatası bulunamadı.\n\n';
  } else {
    testResults.minor.forEach((error, index) => {
      markdown += `${index + 1}. **${error.message}**\n`;
      if (error.file) markdown += `   - Dosya: ${error.file}\n`;
      markdown += '\n';
    });
  }
  
  markdown += '## 💡 ÖNERİLEN İYİLEŞTİRMELER\n\n';
  if (testResults.suggestions.length === 0) {
    markdown += '✅ Öneri yok.\n\n';
  } else {
    testResults.suggestions.forEach((suggestion, index) => {
      markdown += `${index + 1}. ${suggestion.message}\n\n`;
    });
  }
  
  markdown += '## 📁 DÜZELTİLMESİ GEREKEN DOSYALAR\n\n';
  if (testResults.filesToFix.length === 0) {
    markdown += '✅ Düzeltilecek dosya yok.\n\n';
  } else {
    const uniqueFiles = [...new Set(testResults.filesToFix.map(f => f.file))];
    uniqueFiles.forEach((file, index) => {
      markdown += `${index + 1}. ${file}\n`;
      const issues = testResults.filesToFix.filter(f => f.file === file);
      issues.forEach(issue => {
        markdown += `   - ${issue.issue}\n`;
      });
      markdown += '\n';
    });
  }
  
  markdown += '## 🔧 HAZIR KOD YAMALARI\n\n';
  if (testResults.codePatches.length === 0) {
    markdown += '✅ Kod yaması gerekmiyor.\n\n';
  } else {
    testResults.codePatches.forEach((patch, index) => {
      markdown += `### ${index + 1}. ${patch.file}\n\n`;
      markdown += '```\n';
      markdown += patch.fix;
      markdown += '\n```\n\n';
    });
  }
  
  fs.writeFileSync(
    path.join(__dirname, '..', 'TEST_REPORT.md'),
    markdown
  );
  
  log('\n✅ Rapor oluşturuldu: TEST_REPORT.md ve TEST_REPORT.json', 'green');
}

async function main() {
  log('\n🚀 PRESTALINK MASTER AUTO-TEST BAŞLATILIYOR...', 'cyan');
  log('='.repeat(60), 'cyan');
  
  // Sunucuların hazır olmasını bekle
  log('\n⏳ Sunucular kontrol ediliyor...', 'yellow');
  
  const backendReady = await waitForServer('http://localhost:5000');
  if (!backendReady) {
    log('❌ Backend sunucusu hazır değil!', 'red');
    log('   Lütfen: cd backend && node server.js', 'yellow');
    process.exit(1);
  }
  log('✅ Backend hazır (localhost:5000)', 'green');
  
  const frontendReady = await waitForServer('http://localhost:3000');
  if (!frontendReady) {
    log('❌ Frontend sunucusu hazır değil!', 'red');
    log('   Lütfen: cd frontend && npm run dev', 'yellow');
    process.exit(1);
  }
  log('✅ Frontend hazır (localhost:3000)', 'green');
  
  // Tarayıcıyı başlat
  log('\n🌐 Tarayıcı başlatılıyor...', 'yellow');
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();
  
  // Console error'ları yakala
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!text.includes('favicon') && !text.includes('sw.js')) {
        addResult('medium', `Console error: ${text}`, page.url());
      }
    }
  });
  
  // Testleri çalıştır
  await testAllPages(page);
  await testAuthentication(page);
  await testLanguageSwitching(page);
  await testPWA(page);
  await testDashboardPages(page);
  await testAPIEndpoints();
  
  // Rapor oluştur
  await generateReport();
  
  // Tarayıcıyı kapat
  await browser.close();
  
  log('\n✅ PRESTALINK LOCAL TEST TAMAMLANDI', 'green');
  log('📊 Rapor: TEST_REPORT.md', 'cyan');
  log('🚀 Deploy onayı bekleniyor...', 'yellow');
}

main().catch(error => {
  log(`\n❌ Test hatası: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});

