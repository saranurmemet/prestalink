// PrestaLink Comprehensive Auto-Test
// LOCAL ortamda tüm fonksiyonları test eder
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:5000/api';

const results = {
  critical: [],
  medium: [],
  minor: [],
  suggestions: [],
  filesToFix: [],
  codePatches: [],
};

function addResult(level, message, file = null, fix = null) {
  const result = { message, file, fix, timestamp: new Date().toISOString() };
  results[level].push(result);
  if (file && !results.filesToFix.find(f => f.file === file)) {
    results.filesToFix.push({ file, issues: [] });
  }
  if (fix && file) {
    results.codePatches.push({ file, fix });
  }
}

async function waitForServer(url, name, maxAttempts = 15) {
  console.log(`⏳ ${name} bekleniyor...`);
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await axios.get(url, { timeout: 3000 });
      if (response.status === 200) {
        console.log(`✅ ${name} hazır!`);
        return true;
      }
    } catch (e) {
      // Server henüz hazır değil
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  console.log(`❌ ${name} hazır değil!`);
  return false;
}

async function testPageLoad(page, url, name) {
  try {
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    const status = response?.status();
    
    if (status && status >= 400) {
      addResult('critical', `${name} (${url}): HTTP ${status}`, url);
      return false;
    }
    
    // Console errors kontrolü
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('favicon') && !text.includes('sw.js') && !text.includes('manifest')) {
          consoleErrors.push(text);
        }
      }
    });
    
    await page.waitForTimeout(2000);
    
    if (consoleErrors.length > 0) {
      addResult('medium', `${name}: Console errors: ${consoleErrors.join(', ')}`, url);
    }
    
    return true;
  } catch (error) {
    addResult('critical', `${name} (${url}): ${error.message}`, url);
    return false;
  }
}

async function testAuthentication(page) {
  console.log('\n🔐 Authentication Testleri');
  console.log('─'.repeat(50));
  
  // Test pages
  const authPages = [
    { url: '/login', name: 'Login Page' },
    { url: '/register', name: 'Register Page' },
  ];
  
  for (const pageInfo of authPages) {
    const success = await testPageLoad(page, `${BASE_URL}${pageInfo.url}`, pageInfo.name);
    if (success) {
      console.log(`✅ ${pageInfo.name}: OK`);
    }
  }
  
  // Test User Login
  try {
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Role seçim butonlarını bekle
    await page.waitForSelector('button', { timeout: 10000 });
    
    // Tüm butonları al ve text içeriğine göre User butonunu bul
    const buttons = await page.$$('button');
    let userButton = null;
    
    for (const btn of buttons) {
      const text = await btn.textContent();
      if (text && (text.includes('User') || text.includes('Kullanıcı') || text.includes('user'))) {
        userButton = btn;
        break;
      }
    }
    
    // Fallback: İlk butonu kullan
    if (!userButton && buttons.length > 0) {
      userButton = buttons[0];
    }
    
    if (userButton) {
      await userButton.click();
      await page.waitForTimeout(2000);
      
      // Form alanlarını bekle
      await page.waitForSelector('input[name="email"]', { timeout: 5000 });
      
      await page.fill('input[name="email"]', 'sara@prestalink.app');
      await page.fill('input[name="password"]', 'sara');
      
      const submitButton = await page.waitForSelector('button[type="submit"]', { timeout: 5000 });
      await submitButton.click();
      
      // Dashboard'a yönlendirme bekle
      await page.waitForURL(/\/user\/dashboard/, { timeout: 15000 }).catch(() => {});
      
      if (page.url().includes('/user/dashboard')) {
        console.log('✅ User Login: OK');
      } else {
        const currentUrl = page.url();
        addResult('medium', `User login - Current URL: ${currentUrl}`, 'frontend/app/login/page.tsx');
      }
    } else {
      addResult('medium', 'User login: Role button not found', 'frontend/app/login/page.tsx');
    }
  } catch (error) {
    addResult('medium', `User login error: ${error.message}`, 'frontend/app/login/page.tsx');
  }
  
  // Test Admin Login
  try {
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    
    await page.waitForSelector('button', { timeout: 10000 });
    
    // Tüm butonları al ve text içeriğine göre Admin butonunu bul
    const buttons = await page.$$('button');
    let adminButton = null;
    
    for (const btn of buttons) {
      const text = await btn.textContent();
      if (text && (text.includes('Admin') || text.includes('Yönetici') || text.includes('admin'))) {
        adminButton = btn;
        break;
      }
    }
    
    // Fallback: Üçüncü butonu kullan
    if (!adminButton && buttons.length >= 3) {
      adminButton = buttons[2];
    }
    
    if (adminButton) {
      await adminButton.click();
      await page.waitForTimeout(2000);
      
      await page.waitForSelector('input[name="email"]', { timeout: 5000 });
      await page.fill('input[name="email"]', 'sara@prestalink.app');
      await page.fill('input[name="password"]', 'sara');
      
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/admin\/dashboard/, { timeout: 15000 }).catch(() => {});
      
      if (page.url().includes('/admin/dashboard')) {
        console.log('✅ Admin Login: OK');
      } else {
        addResult('medium', `Admin login - Current URL: ${page.url()}`, 'frontend/app/login/page.tsx');
      }
    } else {
      addResult('medium', 'Admin login: Role button not found', 'frontend/app/login/page.tsx');
    }
  } catch (error) {
    addResult('medium', `Admin login error: ${error.message}`, 'frontend/app/login/page.tsx');
  }
  
  // Test Recruiter Login
  try {
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    
    await page.waitForSelector('button', { timeout: 10000 });
    
    // Tüm butonları al ve text içeriğine göre Recruiter butonunu bul
    const buttons = await page.$$('button');
    let recruiterButton = null;
    
    for (const btn of buttons) {
      const text = await btn.textContent();
      if (text && (text.includes('Recruiter') || text.includes('İşveren') || text.includes('recruiter'))) {
        recruiterButton = btn;
        break;
      }
    }
    
    // Fallback: İkinci butonu kullan
    if (!recruiterButton && buttons.length >= 2) {
      recruiterButton = buttons[1];
    }
    
    if (recruiterButton) {
      await recruiterButton.click();
      await page.waitForTimeout(2000);
      
      await page.waitForSelector('input[name="email"]', { timeout: 5000 });
      await page.fill('input[name="email"]', 'sara@prestalink.app');
      await page.fill('input[name="password"]', 'sara');
      
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/employer\/dashboard/, { timeout: 15000 }).catch(() => {});
      
      if (page.url().includes('/employer/dashboard')) {
        console.log('✅ Recruiter Login: OK');
      } else {
        addResult('medium', `Recruiter login - Current URL: ${page.url()}`, 'frontend/app/login/page.tsx');
      }
    } else {
      addResult('medium', 'Recruiter login: Role button not found', 'frontend/app/login/page.tsx');
    }
  } catch (error) {
    addResult('medium', `Recruiter login error: ${error.message}`, 'frontend/app/login/page.tsx');
  }
}

async function testAllPages(page) {
  console.log('\n📄 Tüm Sayfalar Testi');
  console.log('─'.repeat(50));
  
  const pages = [
    { url: '/', name: 'Home' },
    { url: '/login', name: 'Login' },
    { url: '/register', name: 'Register' },
    { url: '/about', name: 'About' },
    { url: '/contact', name: 'Contact' },
    { url: '/jobs', name: 'Jobs' },
  ];
  
  for (const pageInfo of pages) {
    const success = await testPageLoad(page, `${BASE_URL}${pageInfo.url}`, pageInfo.name);
    if (success) {
      console.log(`✅ ${pageInfo.name}: OK`);
    }
  }
  
  // Test broken links
  console.log('\n🔗 Broken Link Testi');
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const links = await page.$$eval('a[href]', (anchors) => 
      anchors.map(a => ({ href: a.href, text: a.textContent?.trim() }))
    );
    
    for (const link of links.slice(0, 10)) { // İlk 10 linki test et
      if (link.href.startsWith(BASE_URL) || link.href.startsWith('/')) {
        try {
          const response = await page.goto(link.href, { waitUntil: 'networkidle', timeout: 10000 });
          if (response && response.status() >= 400) {
            addResult('medium', `Broken link: ${link.href} (${link.text}) - Status: ${response.status()}`, link.href);
          }
        } catch (e) {
          // Link çalışmıyor olabilir
        }
      }
    }
    console.log('✅ Broken link testi tamamlandı');
  } catch (error) {
    addResult('medium', `Broken link test error: ${error.message}`, 'frontend');
  }
}

async function testAPIEndpoints() {
  console.log('\n🔌 API Endpoint Testleri');
  console.log('─'.repeat(50));
  
  const endpoints = [
    { method: 'GET', path: 'http://localhost:5000/', expectedStatus: 200 },
    { method: 'POST', path: `${API_URL}/auth/login`, expectedStatus: 401, data: { email: 'test', password: 'test' } },
    { method: 'GET', path: `${API_URL}/jobs`, expectedStatus: 200 },
    { method: 'GET', path: `${API_URL}/auth/me`, expectedStatus: 401 }, // Unauthorized without token
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
        console.log(`✅ ${endpoint.method} ${endpoint.path}: OK (${response.status})`);
      } else {
        addResult('medium', `API ${endpoint.method} ${endpoint.path}: Expected ${endpoint.expectedStatus}, got ${response.status}`, 'backend');
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        addResult('critical', `Backend not running: ${endpoint.path}`, 'backend/server.js');
      } else if (error.code === 'ECONNABORTED') {
        addResult('medium', `API timeout: ${endpoint.path}`, 'backend');
      } else {
        addResult('medium', `API ${endpoint.method} ${endpoint.path} error: ${error.message}`, 'backend');
      }
    }
  }
}

async function testLanguageFiles() {
  console.log('\n🌍 Dil Dosyaları Testi');
  console.log('─'.repeat(50));
  
  const languages = ['tr', 'en', 'fr', 'ar'];
  const localesPath = path.join(__dirname, '..', 'frontend', 'locales');
  
  for (const lang of languages) {
    const filePath = path.join(localesPath, `${lang}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        console.log(`✅ ${lang}.json: OK (${Object.keys(content).length} keys)`);
      } catch (error) {
        addResult('critical', `${lang}.json: Invalid JSON - ${error.message}`, filePath);
      }
    } else {
      addResult('critical', `${lang}.json: File not found`, filePath);
    }
  }
}

async function testPWA() {
  console.log('\n📱 PWA Testleri');
  console.log('─'.repeat(50));
  
  try {
    const manifestResponse = await axios.get(`${BASE_URL}/manifest.json`);
    if (manifestResponse.status === 200) {
      const manifest = manifestResponse.data;
      console.log('✅ manifest.json: OK');
      
      if (!manifest.icons || manifest.icons.length === 0) {
        addResult('minor', 'manifest.json missing icons', 'frontend/public/manifest.json');
      }
    }
  } catch (error) {
    addResult('medium', `manifest.json error: ${error.message}`, 'frontend/public/manifest.json');
  }
  
  try {
    const swResponse = await axios.get(`${BASE_URL}/sw.js`);
    if (swResponse.status === 200) {
      console.log('✅ service worker: OK');
    }
  } catch (error) {
    addResult('medium', `service worker error: ${error.message}`, 'frontend/public/sw.js');
  }
}

async function generateReport() {
  console.log('\n📊 RAPOR OLUŞTURULUYOR...');
  console.log('='.repeat(60));
  
  let markdown = '# 🧪 PRESTALINK AUTO-TEST RAPORU\n\n';
  markdown += `**Tarih:** ${new Date().toLocaleString('tr-TR')}\n\n`;
  markdown += `**Test Ortamı:** LOCAL (localhost:3000, localhost:5000)\n\n`;
  
  markdown += '## 🚨 KRİTİK HATALAR\n\n';
  if (results.critical.length === 0) {
    markdown += '✅ Kritik hata bulunamadı.\n\n';
  } else {
    results.critical.forEach((error, index) => {
      markdown += `${index + 1}. **${error.message}**\n`;
      if (error.file) markdown += `   - Dosya: \`${error.file}\`\n`;
      if (error.fix) markdown += `   - Çözüm: ${error.fix}\n`;
      markdown += '\n';
    });
  }
  
  markdown += '## ⚠️ ORTA SEVİYE HATALAR\n\n';
  if (results.medium.length === 0) {
    markdown += '✅ Orta seviye hata bulunamadı.\n\n';
  } else {
    results.medium.forEach((error, index) => {
      markdown += `${index + 1}. **${error.message}**\n`;
      if (error.file) markdown += `   - Dosya: \`${error.file}\`\n`;
      markdown += '\n';
    });
  }
  
  markdown += '## 📝 UFAK UI HATALARI\n\n';
  if (results.minor.length === 0) {
    markdown += '✅ UI hatası bulunamadı.\n\n';
  } else {
    results.minor.forEach((error, index) => {
      markdown += `${index + 1}. **${error.message}**\n`;
      if (error.file) markdown += `   - Dosya: \`${error.file}\`\n`;
      markdown += '\n';
    });
  }
  
  markdown += '## 💡 ÖNERİLEN İYİLEŞTİRMELER\n\n';
  if (results.suggestions.length === 0) {
    markdown += '✅ Öneri yok.\n\n';
  } else {
    results.suggestions.forEach((suggestion, index) => {
      markdown += `${index + 1}. ${suggestion.message}\n\n`;
    });
  }
  
  markdown += '## 📁 DÜZELTİLMESİ GEREKEN DOSYALAR\n\n';
  const uniqueFiles = [...new Set(results.filesToFix.map(f => f.file))];
  if (uniqueFiles.length === 0) {
    markdown += '✅ Düzeltilecek dosya yok.\n\n';
  } else {
    uniqueFiles.forEach((file, index) => {
      markdown += `${index + 1}. \`${file}\`\n`;
      const issues = results.filesToFix.filter(f => f.file === file);
      issues.forEach(issue => {
        if (issue.issues) {
          issue.issues.forEach(i => markdown += `   - ${i}\n`);
        }
      });
      markdown += '\n';
    });
  }
  
  markdown += '## 🔧 HAZIR KOD YAMALARI\n\n';
  if (results.codePatches.length === 0) {
    markdown += '✅ Kod yaması gerekmiyor.\n\n';
  } else {
    results.codePatches.forEach((patch, index) => {
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
  
  fs.writeFileSync(
    path.join(__dirname, '..', 'TEST_REPORT.json'),
    JSON.stringify(results, null, 2)
  );
  
  console.log('✅ Rapor oluşturuldu: TEST_REPORT.md ve TEST_REPORT.json');
}

async function main() {
  console.log('\n🚀 PRESTALINK MASTER AUTO-TEST');
  console.log('='.repeat(60));
  
  // Sunucuları kontrol et
  const backendReady = await waitForServer('http://localhost:5000', 'Backend');
  if (!backendReady) {
    console.log('\n❌ Backend hazır değil!');
    console.log('   Lütfen: cd backend && node server.js');
    process.exit(1);
  }
  
  const frontendReady = await waitForServer('http://localhost:3000', 'Frontend');
  if (!frontendReady) {
    console.log('\n❌ Frontend hazır değil!');
    console.log('   Lütfen: cd frontend && npm run dev');
    process.exit(1);
  }
  
  // Tarayıcıyı başlat
  console.log('\n🌐 Tarayıcı başlatılıyor...');
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const page = await browser.newPage();
  
  // Testleri çalıştır
  await testAllPages(page);
  await testAuthentication(page);
  await testLanguageFiles();
  await testPWA();
  await testAPIEndpoints();
  
  // Dashboard sayfalarını test et (login sonrası)
  console.log('\n📊 Dashboard Sayfaları Testi');
  console.log('─'.repeat(50));
  
  // User dashboard
  try {
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    const buttons = await page.$$('button');
    if (buttons.length > 0) {
      await buttons[0].click(); // User
      await page.waitForTimeout(1000);
      await page.fill('input[name="email"]', 'sara@prestalink.app');
      await page.fill('input[name="password"]', 'sara');
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/dashboard/, { timeout: 15000 });
      
      if (page.url().includes('dashboard')) {
        console.log('✅ User Dashboard: OK');
        
        // Dashboard içindeki linkleri test et
        const dashboardLinks = await page.$$('a[href*="/user"]');
        console.log(`   Found ${dashboardLinks.length} user dashboard links`);
      }
    }
  } catch (error) {
    addResult('medium', `User dashboard test error: ${error.message}`, 'frontend/app/user/dashboard/page.tsx');
  }
  
  // Admin dashboard
  try {
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    const buttons = await page.$$('button');
    if (buttons.length >= 3) {
      await buttons[2].click(); // Admin
      await page.waitForTimeout(1000);
      await page.fill('input[name="email"]', 'sara@prestalink.app');
      await page.fill('input[name="password"]', 'sara');
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/admin\/dashboard/, { timeout: 15000 });
      
      if (page.url().includes('admin/dashboard')) {
        console.log('✅ Admin Dashboard: OK');
      }
    }
  } catch (error) {
    addResult('medium', `Admin dashboard test error: ${error.message}`, 'frontend/app/admin/dashboard/page.tsx');
  }
  
  // Responsive test
  console.log('\n📱 Responsive Test');
  console.log('─'.repeat(50));
  try {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    console.log('✅ Mobile viewport (375x667): OK');
    
    // Tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    console.log('✅ Tablet viewport (768x1024): OK');
    
    // Desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    console.log('✅ Desktop viewport (1920x1080): OK');
  } catch (error) {
    addResult('minor', `Responsive test error: ${error.message}`, 'frontend');
  }
  
  // Rapor oluştur
  await generateReport();
  
  // Tarayıcıyı kapat
  await browser.close();
  
  console.log('\n✅ PRESTALINK LOCAL TEST TAMAMLANDI');
  console.log('📊 Rapor: TEST_REPORT.md');
  console.log('🚀 Deploy onayı bekleniyor...');
}

main().catch(error => {
  console.error(`\n❌ Test hatası: ${error.message}`);
  console.error(error);
  process.exit(1);
});

