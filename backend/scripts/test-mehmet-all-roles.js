const http = require('http');

const API_URL = process.env.API_URL || 'http://localhost:5000/api';
const EMAIL = 'mehmet@prestalink.app';
const PASSWORD = 'mehmet';

const roles = ['user', 'recruiter', 'admin'];

function makeRequest(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject({ statusCode: res.statusCode, data: parsed });
          }
        } catch (e) {
          reject({ statusCode: res.statusCode, message: body });
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function testLogin(role) {
  try {
    const endpoint = role === 'user' ? 'user/login' : role === 'recruiter' ? 'recruiter/login' : 'admin/login';
    const response = await makeRequest(`${API_URL}/auth/${endpoint}`, {
      email: EMAIL,
      password: PASSWORD,
    });
    
    console.log(`[SUCCESS] ${role.toUpperCase()} login - Token: ${response.token.substring(0, 30)}...`);
    console.log(`  User: ${response.user.name} (${response.user.role})`);
    return { success: true, role, token: response.token, user: response.user };
  } catch (error) {
    console.log(`[FAILED] ${role.toUpperCase()} login - ${error.data?.message || error.message || 'Unknown error'}`);
    return { success: false, role, error: error.data?.message || error.message || 'Unknown error' };
  }
}

async function testAllRoles() {
  console.log('Testing Mehmet login for all roles...\n');
  const results = await Promise.all(roles.map(role => testLogin(role)));
  
  console.log('\n=== SUMMARY ===');
  results.forEach(result => {
    if (result.success) {
      console.log(`✓ ${result.role.toUpperCase()}: SUCCESS`);
    } else {
      console.log(`✗ ${result.role.toUpperCase()}: FAILED - ${result.error}`);
    }
  });
  
  const successCount = results.filter(r => r.success).length;
  console.log(`\nTotal: ${successCount}/${roles.length} successful logins`);
  
  process.exit(successCount === roles.length ? 0 : 1);
}

testAllRoles();

