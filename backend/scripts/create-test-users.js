const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');

const createTestUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/prestalink');
    console.log('✅ MongoDB bağlandı\n');

    const testUsers = [
      // SARA - User rolü
      {
        name: 'Sara Yılmaz',
        email: 'sara@prestalink.app',
        phone: '+213555111111',
        password: 'sara',
        role: 'user',
        languages: ['FR', 'AR']
      },
      // SARAD - Admin rolü
      {
        name: 'Sarad Admin',
        email: 'sarad@prestalink.app',
        phone: '+213555222222',
        password: 'sarad',
        role: 'admin',
        languages: ['TR', 'EN', 'FR', 'AR']
      },
      // AHMET - Recruiter rolü
      {
        name: 'Ahmet Kaya',
        email: 'ahmet@prestalink.app',
        phone: '+905551234567',
        password: 'ahmet',
        role: 'recruiter',
        languages: ['TR', 'EN']
      },
      // MEHMET - User rolü
      {
        name: 'Mehmet Demir',
        email: 'mehmet@prestalink.app',
        phone: '+213555333333',
        password: 'mehmet',
        role: 'user',
        languages: ['TR', 'FR']
      }
    ];

    console.log('🔄 Test kullanıcıları oluşturuluyor...\n');

    // Önce tüm eski kullanıcıları sil
    await User.deleteMany({});
    console.log('🗑️  Eski kullanıcılar temizlendi\n');

    for (const userData of testUsers) {
      try {
        await User.create(userData);
        console.log(`✅ ${userData.name} oluşturuldu (${userData.role})`);
        console.log(`   📧 Email: ${userData.email}`);
        console.log(`   🔑 Şifre: ${userData.password}`);
        console.log(`   👤 Rol: ${userData.role}`);
        console.log('');
      } catch (error) {
        console.log(`❌ ${userData.name} oluşturulamadı: ${error.message}`);
      }
    }

    console.log('\n✅ Tüm test kullanıcıları hazır!\n');
    console.log('📋 KULLANICI BİLGİLERİ:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1️⃣  SARA (User)');
    console.log('   Email: sara@prestalink.app');
    console.log('   Şifre: sara');
    console.log('');
    console.log('2️⃣  SARAD (Admin)');
    console.log('   Email: sarad@prestalink.app');
    console.log('   Şifre: sarad');
    console.log('');
    console.log('3️⃣  AHMET (Recruiter)');
    console.log('   Email: ahmet@prestalink.app');
    console.log('   Şifre: ahmet');
    console.log('');
    console.log('4️⃣  MEHMET (User)');
    console.log('   Email: mehmet@prestalink.app');
    console.log('   Şifre: mehmet');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
};

createTestUsers();
