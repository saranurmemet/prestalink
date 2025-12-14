// PrestaLink API Test Script
// Backend API endpoint'lerini test eder
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000/api';
const BASE_URL = 'http://localhost:5000';

const results = {
  passed: [],
  failed: [],
  warnings: [],
};

function log(message, type = 'info') {
  const colors = {
    success: '\x1b[32m',
    error: '\x1b[31m',
    warning: '\x1b[33m',
    info: '\x1b[36m',
    reset: '\x1b[0m',
  };
  console.log(`${colors[type]}${message}${colors.reset}`);
}

async function testEndpoint(method, url, data = null, expectedStatus = 200, description = '') {
  try {
    const config = {
      method,
      url,
      validateStatus: () => true,
      timeout: 5000,
    };
    
    if (data) {
      config.data = data;
      config.headers = { 'Content-Type': 'application/json' };
    }
    
    const response = await axios(config);
    
    if (response.status === expectedStatus) {
      log(`✅ ${method} ${url} - OK (${response.status})`, 'success');
      results.passed.push({ method, url, status: response.status, description });
      return true;
    } else {
      log(`⚠️  ${method} ${url} - Expected ${expectedStatus}, got ${response.status}`, 'warning');
      results.warnings.push({ method, url, expected: expectedStatus, got: response.status, description });
      return false;
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      log(`❌ ${method} ${url} - Backend not running`, 'error');
      results.failed.push({ method, url, error: 'Backend not running', description });
    } else {
      log(`❌ ${method} ${url} - ${error.message}`, 'error');
      results.failed.push({ method, url, error: error.message, description });
    }
    return false;
  }
}

async function testBackendHealth() {
  log('\n🏥 Backend Health Check', 'info');
  log('─'.repeat(50), 'info');
  
  await testEndpoint('GET', BASE_URL, null, 200, 'Backend root endpoint');
}

async function testAuthEndpoints() {
  log('\n🔐 Authentication Endpoints', 'info');
  log('─'.repeat(50), 'info');
  
  // Test login endpoints (401 bekliyoruz - invalid credentials)
  await testEndpoint('POST', `${API_URL}/auth/login`, { email: 'test@test.com', password: 'wrong' }, 401, 'General login endpoint');
  await testEndpoint('POST', `${API_URL}/auth/user/login`, { email: 'test@test.com', password: 'wrong' }, 401, 'User login endpoint');
  await testEndpoint('POST', `${API_URL}/auth/recruiter/login`, { email: 'test@test.com', password: 'wrong' }, 401, 'Recruiter login endpoint');
  await testEndpoint('POST', `${API_URL}/auth/admin/login`, { email: 'test@test.com', password: 'wrong' }, 401, 'Admin login endpoint');
  
  // Test register endpoint (400 veya 201 bekliyoruz)
  await testEndpoint('POST', `${API_URL}/auth/register`, {
    email: 'test@test.com',
    password: 'test123',
    name: 'Test User',
    role: 'user'
  }, [201, 400], 'Register endpoint');
}

async function testJobEndpoints() {
  log('\n💼 Job Endpoints', 'info');
  log('─'.repeat(50), 'info');
  
  // Public job listing
  await testEndpoint('GET', `${API_URL}/jobs`, null, 200, 'Get all jobs');
  
  // Test job by ID (404 bekliyoruz - invalid ID)
  await testEndpoint('GET', `${API_URL}/jobs/invalid-id`, null, 404, 'Get job by invalid ID');
}

async function testApplicationEndpoints() {
  log('\n📝 Application Endpoints', 'info');
  log('─'.repeat(50), 'info');
  
  // Applications require auth, so 401 bekliyoruz
  await testEndpoint('GET', `${API_URL}/applications/user/invalid-id`, null, 401, 'Get user applications (no auth)');
  await testEndpoint('POST', `${API_URL}/applications`, null, 401, 'Create application (no auth)');
}

async function testSaraLogin() {
  log('\n👤 Sara Login Test (All Roles)', 'info');
  log('─'.repeat(50), 'info');
  
  const roles = [
    { endpoint: '/auth/user/login', role: 'user', name: 'User' },
    { endpoint: '/auth/recruiter/login', role: 'recruiter', name: 'Recruiter' },
    { endpoint: '/auth/admin/login', role: 'admin', name: 'Admin' },
  ];
  
  for (const roleTest of roles) {
    try {
      const response = await axios.post(
        `${API_URL}${roleTest.endpoint}`,
        { email: 'sara@prestalink.app', password: 'sara' },
        { validateStatus: () => true, timeout: 5000 }
      );
      
      if (response.status === 200 && response.data.token) {
        log(`✅ ${roleTest.name} Login: OK`, 'success');
        results.passed.push({
          method: 'POST',
          url: `${API_URL}${roleTest.endpoint}`,
          status: 200,
          description: `Sara ${roleTest.name} login successful`
        });
      } else if (response.status === 401) {
        log(`❌ ${roleTest.name} Login: Invalid credentials`, 'error');
        results.failed.push({
          method: 'POST',
          url: `${API_URL}${roleTest.endpoint}`,
          error: 'Invalid credentials',
          description: `Sara ${roleTest.name} login failed`
        });
      } else {
        log(`⚠️  ${roleTest.name} Login: Unexpected status ${response.status}`, 'warning');
        results.warnings.push({
          method: 'POST',
          url: `${API_URL}${roleTest.endpoint}`,
          expected: 200,
          got: response.status,
          description: `Sara ${roleTest.name} login`
        });
      }
    } catch (error) {
      log(`❌ ${roleTest.name} Login: ${error.message}`, 'error');
      results.failed.push({
        method: 'POST',
        url: `${API_URL}${roleTest.endpoint}`,
        error: error.message,
        description: `Sara ${roleTest.name} login`
      });
    }
  }
}

async function generateReport() {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: results.passed.length + results.failed.length + results.warnings.length,
      passed: results.passed.length,
      failed: results.failed.length,
      warnings: results.warnings.length,
    },
    results,
  };
  
  // JSON report
  fs.writeFileSync(
    path.join(__dirname, '..', 'API_TEST_REPORT.json'),
    JSON.stringify(report, null, 2)
  );
  
  // Markdown report
  let markdown = `# PrestaLink API Test Report\n\n`;
  markdown += `**Test Tarihi:** ${new Date().toLocaleString('tr-TR')}\n\n`;
  markdown += `## Özet\n\n`;
  markdown += `- ✅ Başarılı: ${results.passed.length}\n`;
  markdown += `- ❌ Başarısız: ${results.failed.length}\n`;
  markdown += `- ⚠️  Uyarı: ${results.warnings.length}\n`;
  markdown += `- 📊 Toplam: ${report.summary.total}\n\n`;
  
  if (results.passed.length > 0) {
    markdown += `## ✅ Başarılı Testler\n\n`;
    results.passed.forEach((test, index) => {
      markdown += `${index + 1}. **${test.method} ${test.url}**\n`;
      markdown += `   - Status: ${test.status}\n`;
      if (test.description) markdown += `   - Açıklama: ${test.description}\n`;
      markdown += `\n`;
    });
  }
  
  if (results.failed.length > 0) {
    markdown += `## ❌ Başarısız Testler\n\n`;
    results.failed.forEach((test, index) => {
      markdown += `${index + 1}. **${test.method} ${test.url}**\n`;
      markdown += `   - Hata: ${test.error}\n`;
      if (test.description) markdown += `   - Açıklama: ${test.description}\n`;
      markdown += `\n`;
    });
  }
  
  if (results.warnings.length > 0) {
    markdown += `## ⚠️  Uyarılar\n\n`;
    results.warnings.forEach((test, index) => {
      markdown += `${index + 1}. **${test.method} ${test.url}**\n`;
      markdown += `   - Beklenen: ${test.expected}, Gelen: ${test.got}\n`;
      if (test.description) markdown += `   - Açıklama: ${test.description}\n`;
      markdown += `\n`;
    });
  }
  
  fs.writeFileSync(
    path.join(__dirname, '..', 'API_TEST_REPORT.md'),
    markdown
  );
  
  log('\n✅ Rapor oluşturuldu: API_TEST_REPORT.md ve API_TEST_REPORT.json', 'success');
}

async function main() {
  log('\n🚀 PRESTALINK API TEST', 'info');
  log('='.repeat(60), 'info');
  
  // Backend kontrolü
  try {
    await axios.get(BASE_URL, { timeout: 3000 });
    log('✅ Backend çalışıyor', 'success');
  } catch (error) {
    log('❌ Backend çalışmıyor! Lütfen backend\'i başlatın: cd backend && node server.js', 'error');
    process.exit(1);
  }
  
  // Testleri çalıştır
  await testBackendHealth();
  await testAuthEndpoints();
  await testJobEndpoints();
  await testApplicationEndpoints();
  await testSaraLogin();
  
  // Rapor oluştur
  await generateReport();
  
  // Özet
  log('\n' + '='.repeat(60), 'info');
  log('📊 TEST ÖZETİ', 'info');
  log('─'.repeat(60), 'info');
  log(`✅ Başarılı: ${results.passed.length}`, 'success');
  log(`❌ Başarısız: ${results.failed.length}`, results.failed.length > 0 ? 'error' : 'success');
  log(`⚠️  Uyarı: ${results.warnings.length}`, results.warnings.length > 0 ? 'warning' : 'success');
  log('='.repeat(60), 'info');
}

main().catch(error => {
  log(`\n❌ Test hatası: ${error.message}`, 'error');
  console.error(error);
  process.exit(1);
});











