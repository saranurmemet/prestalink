/**
 * Hızlı Login Test Script'i
 * Giriş sorunlarını teşhis eder
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function testLogin() {
  try {
    console.log('🔍 GİRİŞ SORUNU TEŞHİSİ\n');
    
    // 1. MongoDB bağlantısı
    console.log('1️⃣  MongoDB bağlantısı kontrol ediliyor...');
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI bulunamadı!');
      return;
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB bağlandı\n');

    // 2. Test kullanıcıları kontrol
    console.log('2️⃣  Test kullanıcıları kontrol ediliyor...\n');
    
    const testUsers = [
      { email: 'sara@prestalink.app', password: 'sara', role: 'user' },
      { email: 'zer.company@prestalink.app', password: 'zer2024', role: 'recruiter' },
    ];

    for (const test of testUsers) {
      console.log(`📧 ${test.email} kontrol ediliyor...`);
      const user = await User.findOne({ email: test.email });
      
      if (!user) {
        console.log(`   ❌ Kullanıcı bulunamadı!\n`);
        continue;
      }

      console.log(`   ✅ Kullanıcı bulundu: ${user.name}`);
      console.log(`   📋 Rol: ${user.role}`);
      console.log(`   🔑 Şifre hash var: ${!!user.password}`);
      
      // Şifre kontrolü
      if (user.password) {
        const isMatch = await bcrypt.compare(test.password, user.password);
        console.log(`   🔐 Şifre doğru: ${isMatch ? '✅' : '❌'}`);
        if (!isMatch) {
          console.log(`   ⚠️  Şifre eşleşmiyor! Beklenen: "${test.password}"`);
        }
      } else {
        console.log(`   ❌ Şifre hash yok!`);
      }
      
      // Rol kontrolü
      if (user.roles && user.roles.length > 0) {
        console.log(`   📋 Mevcut roller: ${user.roles.join(', ')}`);
        console.log(`   ✅ İstenen rol (${test.role}) mevcut: ${user.roles.includes(test.role) ? '✅' : '❌'}`);
      } else {
        console.log(`   📋 Tek rol: ${user.role}`);
        console.log(`   ✅ Rol eşleşiyor: ${user.role === test.role ? '✅' : '❌'}`);
      }
      
      console.log('');
    }

    // 3. JWT_SECRET kontrolü
    console.log('3️⃣  JWT_SECRET kontrol ediliyor...');
    if (process.env.JWT_SECRET) {
      console.log('✅ JWT_SECRET ayarlı\n');
    } else {
      console.log('❌ JWT_SECRET bulunamadı!\n');
    }

    // 4. Backend URL kontrolü
    console.log('4️⃣  Backend URL kontrol ediliyor...');
    const backendUrl = process.env.CLIENT_URL || 'http://localhost:5000';
    console.log(`   Backend URL: ${backendUrl}`);
    console.log(`   API Endpoint: ${backendUrl}/api/auth/login\n`);

    await mongoose.connection.close();
    console.log('✅ Teşhis tamamlandı');
  } catch (error) {
    console.error('❌ Hata:', error.message);
    console.error('❌ Stack:', error.stack);
    process.exit(1);
  }
}

testLogin();

