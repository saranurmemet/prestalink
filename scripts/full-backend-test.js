// PrestaLink Full Backend Test Suite
// Comprehensive backend validation + seed data tests
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000/api';
const BASE_URL = 'http://localhost:5000';

const results = {
  tests: [],
  summary: { passed: 0, failed: 0, warnings: 0 },
  issues: []
};

function log(msg, type = 'info') {
  const colors = { success: '\x1b[32m', error: '\x1b[31m', warning: '\x1b[33m', info: '\x1b[36m', reset: '\x1b[0m' };
  console.log(`${colors[type]}${msg}${colors.reset}`);
}

async function test(name, fn) {
  try {
    const result = await fn();
    if (result.status === 'pass') {
      log(`✅ ${name}`, 'success');
      results.tests.push({ name, status: 'pass' });
      results.summary.passed++;
    } else if (result.status === 'warn') {
      log(`⚠️  ${name}: ${result.message}`, 'warning');
      results.tests.push({ name, status: 'warn', message: result.message });
      results.summary.warnings++;
      if (result.issue) results.issues.push(result.issue);
    } else {
      log(`❌ ${name}: ${result.message}`, 'error');
      results.tests.push({ name, status: 'fail', message: result.message });
      results.summary.failed++;
      if (result.issue) results.issues.push(result.issue);
    }
  } catch (error) {
    log(`❌ ${name}: ${error.message}`, 'error');
    results.tests.push({ name, status: 'fail', message: error.message });
    results.summary.failed++;
  }
}

async function main() {
  log('\n🚀 PRESTALINK FULL BACKEND TEST', 'info');
  log('='.repeat(60), 'info');

  // Check backend availability
  try {
    await axios.get(BASE_URL, { timeout: 3000 });
    log('✅ Backend çalışıyor\n', 'success');
  } catch (e) {
    log(`❌ Backend erişilemiyor: ${e.message}`, 'error');
    process.exit(1);
  }

  // Auth Tests
  log('\n🔐 AUTHENTICATION TESTS', 'info');
  log('─'.repeat(60), 'info');

  await test('Login with invalid credentials (user)', async () => {
    const res = await axios.post(`${API_URL}/auth/user/login`, 
      { email: 'wrong@test.com', password: 'wrong' },
      { validateStatus: () => true, timeout: 5000 }
    );
    return res.status === 401 ? { status: 'pass' } : { status: 'warn', message: `Expected 401, got ${res.status}` };
  });

  await test('Login with valid Sara credentials (user)', async () => {
    const res = await axios.post(`${API_URL}/auth/user/login`, 
      { email: 'sara@prestalink.app', password: 'sara' },
      { validateStatus: () => true, timeout: 5000 }
    );
    if (res.status === 200 && res.data.token) return { status: 'pass' };
    return { status: 'fail', message: `Login failed: ${res.status}`, issue: 'Sara user login not working' };
  });

  await test('Login with valid Sara credentials (recruiter)', async () => {
    const res = await axios.post(`${API_URL}/auth/recruiter/login`, 
      { email: 'sara@prestalink.app', password: 'sara' },
      { validateStatus: () => true, timeout: 5000 }
    );
    if (res.status === 200 && res.data.token) return { status: 'pass' };
    return { status: 'fail', message: `Login failed: ${res.status}`, issue: 'Sara recruiter login not working' };
  });

  await test('Login with valid Sara credentials (admin)', async () => {
    const res = await axios.post(`${API_URL}/auth/admin/login`, 
      { email: 'sara@prestalink.app', password: 'sara' },
      { validateStatus: () => true, timeout: 5000 }
    );
    if (res.status === 200 && res.data.token) return { status: 'pass' };
    return { status: 'fail', message: `Login failed: ${res.status}`, issue: 'Sara admin login not working' };
  });

  // Job Tests
  log('\n💼 JOB ENDPOINTS', 'info');
  log('─'.repeat(60), 'info');

  let jobsData = [];
  await test('Get all jobs (public)', async () => {
    const res = await axios.get(`${API_URL}/jobs`, { timeout: 5000 });
    if (res.status === 200 && Array.isArray(res.data)) {
      jobsData = res.data;
      return { status: 'pass' };
    }
    return { status: 'fail', message: 'Jobs endpoint failed' };
  });

  await test('Jobs should have at least 1 entry', async () => {
    if (jobsData.length > 0) return { status: 'pass' };
    return { status: 'warn', message: 'No jobs in database', issue: 'Jobs database appears empty' };
  });

  await test('Invalid job ID returns 404', async () => {
    const res = await axios.get(`${API_URL}/jobs/invalid-id-xyz`, 
      { validateStatus: () => true, timeout: 5000 }
    );
    return res.status === 404 ? { status: 'pass' } : { status: 'fail', message: `Expected 404, got ${res.status}` };
  });

  // Application Tests
  log('\n📝 APPLICATION ENDPOINTS', 'info');
  log('─'.repeat(60), 'info');

  await test('Applications without token returns 401', async () => {
    const res = await axios.get(`${API_URL}/applications/user/test`, 
      { validateStatus: () => true, timeout: 5000 }
    );
    return res.status === 401 ? { status: 'pass' } : { status: 'warn', message: `Expected 401, got ${res.status}` };
  });

  // Health & Infrastructure
  log('\n🏥 INFRASTRUCTURE', 'info');
  log('─'.repeat(60), 'info');

  await test('Backend responds to health check', async () => {
    const res = await axios.get(BASE_URL, { timeout: 5000 });
    return res.status === 200 ? { status: 'pass' } : { status: 'fail', message: `Health check failed: ${res.status}` };
  });

  // Code Quality Checks
  log('\n📁 CODE QUALITY', 'info');
  log('─'.repeat(60), 'info');

  await test('Backend server.js exists', async () => {
    if (fs.existsSync(path.join(__dirname, '..', 'backend', 'server.js'))) return { status: 'pass' };
    return { status: 'fail', message: 'server.js not found' };
  });

  await test('Backend package.json valid', async () => {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'backend', 'package.json'), 'utf8'));
      if (pkg.name && pkg.main) return { status: 'pass' };
    } catch (e) {
      return { status: 'fail', message: 'Invalid package.json' };
    }
  });

  await test('Frontend package.json valid', async () => {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'frontend', 'package.json'), 'utf8'));
      if (pkg.name && pkg.scripts) return { status: 'pass' };
    } catch (e) {
      return { status: 'fail', message: 'Invalid package.json' };
    }
  });

  // Environment
  log('\n🌍 ENVIRONMENT', 'info');
  log('─'.repeat(60), 'info');

  await test('Backend .env or config present', async () => {
    const backendPath = path.join(__dirname, '..', 'backend');
    const hasConfig = fs.existsSync(path.join(backendPath, '.env')) || 
                      fs.existsSync(path.join(backendPath, 'config', 'db.js'));
    return hasConfig ? { status: 'pass' } : { status: 'warn', message: 'No explicit env config found' };
  });

  await test('Frontend .env.local present', async () => {
    if (fs.existsSync(path.join(__dirname, '..', 'frontend', '.env.local'))) return { status: 'pass' };
    return { status: 'warn', message: '.env.local not found' };
  });

  // Report
  log('\n' + '='.repeat(60), 'info');
  log('📊 TEST SUMMARY', 'info');
  log('─'.repeat(60), 'info');
  log(`✅ Passed:  ${results.summary.passed}`, 'success');
  log(`❌ Failed:  ${results.summary.failed}`, results.summary.failed > 0 ? 'error' : 'success');
  log(`⚠️  Warnings: ${results.summary.warnings}`, results.summary.warnings > 0 ? 'warning' : 'success');
  log(`📊 Total:   ${results.summary.passed + results.summary.failed + results.summary.warnings}`, 'info');

  if (results.issues.length > 0) {
    log('\n🔴 ISSUES FOUND:', 'error');
    results.issues.forEach((issue, i) => log(`  ${i + 1}. ${issue}`, 'error'));
  }

  // Write report
  const timestamp = new Date().toISOString();
  const report = {
    timestamp,
    backend: { running: true, url: BASE_URL },
    summary: results.summary,
    tests: results.tests,
    issues: results.issues
  };

  fs.writeFileSync(
    path.join(__dirname, '..', 'FULL_TEST_REPORT.json'),
    JSON.stringify(report, null, 2)
  );

  let md = `# 🧪 PRESTALINK FULL BACKEND TEST REPORT\n\n**Timestamp:** ${new Date().toLocaleString('tr-TR')}\n\n`;
  md += `## 📊 Summary\n- ✅ Passed: ${results.summary.passed}\n- ❌ Failed: ${results.summary.failed}\n- ⚠️ Warnings: ${results.summary.warnings}\n\n`;
  md += `## ✅ Test Results\n${results.tests.map((t, i) => `${i + 1}. ${t.status.toUpperCase()} - ${t.name}${t.message ? ` (${t.message})` : ''}`).join('\n')}\n`;
  if (results.issues.length > 0) {
    md += `\n## 🔴 Issues\n${results.issues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}\n`;
  }

  fs.writeFileSync(
    path.join(__dirname, '..', 'FULL_TEST_REPORT.md'),
    md
  );

  log('\n✅ Raporlar oluşturuldu:', 'success');
  log('   - FULL_TEST_REPORT.md', 'info');
  log('   - FULL_TEST_REPORT.json', 'info');

  process.exit(results.summary.failed > 0 ? 1 : 0);
}

main().catch(error => {
  log(`\n❌ Hata: ${error.message}`, 'error');
  process.exit(1);
});
