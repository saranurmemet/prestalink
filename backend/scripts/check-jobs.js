const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Job = require('../models/Job');
const User = require('../models/User');

async function checkJobs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB bağlandı\n');

    const jobCount = await Job.countDocuments();
    console.log('📊 Toplam iş ilanı sayısı:', jobCount);

    if (jobCount === 0) {
      console.log('\n❌ Veritabanında iş ilanı yok!');
      console.log('💡 ZER company iş ilanlarını oluşturmak için:');
      console.log('   node scripts/create-zer-company-jobs.js\n');
    } else {
      console.log('\n📋 İş İlanları:');
      const jobs = await Job.find().limit(10).populate('employerId', 'name companyName email');
      jobs.forEach((job, i) => {
        console.log(`${i + 1}. ${job.title}`);
        console.log(`   📍 ${job.location}`);
        console.log(`   💰 ${job.salary || 'N/A'}`);
        console.log(`   🏢 İşveren: ${job.employerId?.companyName || job.employerId?.name || 'N/A'}`);
        console.log(`   📧 Email: ${job.employerId?.email || 'N/A'}`);
        console.log('');
      });
    }

    // ZER company kontrolü
    const zerCompany = await User.findOne({ email: 'zer.company@prestalink.app' });
    if (zerCompany) {
      const zerJobs = await Job.countDocuments({ employerId: zerCompany._id });
      console.log(`🏢 ZER company iş ilanı sayısı: ${zerJobs}`);
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
}

checkJobs();

