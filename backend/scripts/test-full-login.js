const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testFullLoginFlow() {
  console.log('🧪 Testing Full Login Flow\n');
  console.log('='.repeat(60));

  const testCases = [
    { email: 'sara@prestalink.app', password: 'sara', role: 'recruiter', expectedDashboard: '/employer/dashboard' },
    { email: 'mehmet@prestalink.app', password: 'mehmet', role: 'user', expectedDashboard: '/user/dashboard' },
    { email: 'sarad@prestalink.app', password: 'sarad', role: 'admin', expectedDashboard: '/admin/dashboard' }
  ];

  for (const testCase of testCases) {
    console.log(`\n👤 Testing: ${testCase.email} (${testCase.role})`);
    console.log('-'.repeat(60));

    try {
      // Test with role-specific endpoint
      const endpoint = `/auth/${testCase.role}/login`;
      console.log(`   Endpoint: ${endpoint}`);

      const response = await axios.post(`${API_URL}${endpoint}`, {
        email: testCase.email,
        password: testCase.password,
      });

      const { user, token, availableRoles } = response.data;

      console.log(`   ✅ Login Status: SUCCESS`);
      console.log(`   ✅ User Email: ${user.email}`);
      console.log(`   ✅ User Role: ${user.role}`);
      console.log(`   ✅ Expected Role: ${testCase.role}`);
      
      if (user.role === testCase.role) {
        console.log(`   ✅ Role Matches: YES`);
      } else {
        console.log(`   ❌ Role Mismatch: Expected ${testCase.role}, Got ${user.role}`);
      }
      
      console.log(`   ✅ Token Received: ${token ? 'YES' : 'NO'}`);
      console.log(`   ✅ Available Roles: ${availableRoles.join(', ')}`);
      console.log(`   ✅ Expected Dashboard: ${testCase.expectedDashboard}`);
      
    } catch (error) {
      console.log(`   ❌ Login Failed`);
      if (error.response) {
        console.log(`      Status: ${error.response.status}`);
        console.log(`      Message: ${error.response.data?.message}`);
      } else {
        console.log(`      Error: ${error.message}`);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ All tests completed!\n');
}

testFullLoginFlow();
