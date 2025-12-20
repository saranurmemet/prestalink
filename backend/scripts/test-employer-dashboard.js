const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');

async function testEmployerDashboard() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB bağlandı\n');

    // ZER company'yi bul
    const zerCompany = await User.findOne({ email: 'zer.company@prestalink.app' });
    if (!zerCompany) {
      console.error('❌ ZER company bulunamadı!');
      process.exit(1);
    }

    console.log(`🏢 ZER Company ID: ${zerCompany._id}\n`);

    // ZER company'nin iş ilanlarını bul
    const jobs = await Job.find({ employerId: zerCompany._id });
    console.log(`📊 Toplam iş ilanı: ${jobs.length}\n`);

    if (jobs.length === 0) {
      console.log('❌ ZER company için iş ilanı bulunamadı!');
      process.exit(1);
    }

    // Her iş ilanı için başvuruları kontrol et
    console.log('📋 İş İlanları ve Başvurular:\n');
    for (const job of jobs.slice(0, 5)) {
      const applications = await Application.find({ jobId: job._id }).populate('userId', 'name email');
      console.log(`${job.title}`);
      console.log(`   📍 ${job.location}`);
      console.log(`   🆔 Job ID: ${job._id}`);
      console.log(`   🆔 Employer ID: ${job.employerId}`);
      console.log(`   👥 Başvuru sayısı: ${applications.length}`);
      if (applications.length > 0) {
        applications.forEach((app, i) => {
          const applicant = app.userId;
          console.log(`      ${i + 1}. ${applicant?.name || 'N/A'} (${applicant?.email || 'N/A'})`);
        });
      }
      console.log('');
    }

    // Test: employerId karşılaştırması
    console.log('🔍 Employer ID Karşılaştırması:');
    const firstJob = jobs[0];
    console.log(`   Job.employerId: ${firstJob.employerId}`);
    console.log(`   Job.employerId type: ${typeof firstJob.employerId}`);
    console.log(`   Job.employerId.toString(): ${firstJob.employerId.toString()}`);
    console.log(`   ZER Company._id: ${zerCompany._id}`);
    console.log(`   ZER Company._id.toString(): ${zerCompany._id.toString()}`);
    console.log(`   Eşit mi?: ${firstJob.employerId.toString() === zerCompany._id.toString()}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
}

testEmployerDashboard();

