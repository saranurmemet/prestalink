#!/usr/bin/env node

/**
 * Profile Picture Upload Test
 * Test script to verify the profile picture upload functionality
 */

const http = require('http');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Test configuration
const API_URL = 'http://localhost:5000/api/auth/me';
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1Nzc2ODc5YWJjZGVmMDAxMjM0NTY3OCIsInJvbGUiOiJ1c2VyIn0.test_token_replace_with_real'; // Replace with actual token

console.log('🧪 Profile Picture Upload Test\n');
console.log(`API Endpoint: ${API_URL}`);
console.log(`Token: ${TEST_TOKEN.substring(0, 20)}...`);

// Create FormData with test data
const form = new FormData();
form.append('name', 'Test User');
form.append('phone', '+1234567890');
form.append('country', 'Turkey');
form.append('bio', 'Test biography');
form.append('languages[]', 'EN');
form.append('languages[]', 'TR');

// Create a simple test image (1x1 pixel PNG)
const pngData = Buffer.from([
  0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
  0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
  0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
  0x54, 0x08, 0x99, 0x63, 0xF8, 0x0F, 0x00, 0x00,
  0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01, 0x00,
  0x01, 0x7B, 0xD0, 0x92, 0xA8, 0x00, 0x00, 0x00,
  0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60,
  0x82
]);

form.append('profilePhoto', pngData, 'test-photo.png');

// Parse URL
const urlObj = new URL(API_URL);
const options = {
  hostname: urlObj.hostname,
  port: urlObj.port,
  path: urlObj.pathname,
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${TEST_TOKEN}`,
    ...form.getHeaders()
  }
};

console.log('\n📤 Sending request...\n');

// Make request
const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`\nResponse Headers:`);
    Object.entries(res.headers).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });

    console.log(`\nResponse Body:`);
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log(data);
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    if (res.statusCode === 200) {
      console.log('✅ SUCCESS: Profile updated with picture!');
      console.log('   Profile picture URL should be in response.user.profilePhoto');
    } else if (res.statusCode === 401) {
      console.log('❌ FAILED: Authentication error');
      console.log('   Please provide a valid JWT token');
    } else if (res.statusCode === 404) {
      console.log('❌ FAILED: User not found');
    } else {
      console.log(`❌ FAILED: HTTP ${res.statusCode}`);
    }
    console.log('='.repeat(50));
  });
});

req.on('error', (e) => {
  console.error(`❌ Request error: ${e.message}`);
  console.log('\nMake sure:');
  console.log('1. Backend server is running on port 5000');
  console.log('2. Replace TEST_TOKEN with a valid JWT token');
  console.log('3. The user exists in database');
});

// Send form
form.pipe(req);
