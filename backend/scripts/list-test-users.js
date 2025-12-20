const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Job = require('../models/Job');

async function listTestUsers() {
  try {
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI environment variable bulunamadı!');
      process.exit(1);
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB bağlandı\n');

    console.log('═══════════════════════════════════════════════════════');
    console.log('📋 TEST KULLANICILARI VE İŞVEREN BİLGİLERİ');
    console.log('═══════════════════════════════════════════════════════\n');

    // Test kullanıcıları (user role)
    const testUsers = await User.find({ role: 'user' }).select('name email password country city');
    console.log('👥 TEST KULLANICILARI (Aday):');
    console.log('─────────────────────────────────────────────────────');
    testUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🔑 Şifre: ${user.password ? '***' : 'N/A'}`);
      console.log(`   🌍 Ülke: ${user.country || 'N/A'}`);
      console.log(`   🏙️  Şehir: ${user.city || 'N/A'}`);
      console.log('');
    });

    // İşverenler (recruiter role)
    const employers = await User.find({ role: 'recruiter' }).select('name email password companyName country city');
    console.log('🏢 İŞVERENLER (Recruiter):');
    console.log('─────────────────────────────────────────────────────');
    for (const employer of employers) {
      const jobCount = await Job.countDocuments({ employerId: employer._id });
      console.log(`📌 ${employer.companyName || employer.name}`);
      console.log(`   📧 Email: ${employer.email}`);
      console.log(`   🔑 Şifre: ${employer.password ? '***' : 'N/A'}`);
      console.log(`   🏢 Şirket: ${employer.companyName || 'N/A'}`);
      console.log(`   🌍 Ülke: ${employer.country || 'N/A'}`);
      console.log(`   🏙️  Şehir: ${employer.city || 'N/A'}`);
      console.log(`   📊 İş İlanı Sayısı: ${jobCount}`);
      console.log('');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
}

listTestUsers();

