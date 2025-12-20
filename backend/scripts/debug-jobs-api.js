const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Job = require('../models/Job');

async function debugJobs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB bağlandı\n');

    // Tüm iş ilanlarını al
    const allJobs = await Job.find().sort({ createdAt: -1 });
    console.log(`📊 Veritabanında toplam iş ilanı: ${allJobs.length}\n`);

    // getJobs fonksiyonundaki duplicate removal mantığını simüle et
    const uniqueJobsMap = new Map();
    allJobs.forEach((job) => {
      const key = `${job.title}|${job.location}|${job.salary}`;
      if (!uniqueJobsMap.has(key)) {
        uniqueJobsMap.set(key, job);
      } else {
        const existing = uniqueJobsMap.get(key);
        if (new Date(job.createdAt) > new Date(existing.createdAt)) {
          uniqueJobsMap.set(key, job);
        }
      }
    });

    const uniqueJobs = Array.from(uniqueJobsMap.values());
    console.log(`📋 Duplicate removal sonrası: ${uniqueJobs.length} iş ilanı\n`);

    if (uniqueJobs.length === 0 && allJobs.length > 0) {
      console.log('❌ SORUN: Duplicate removal tüm iş ilanlarını filtreliyor!\n');
      console.log('🔍 İlk 3 iş ilanının detayları:');
      allJobs.slice(0, 3).forEach((job, i) => {
        const key = `${job.title}|${job.location}|${job.salary}`;
        console.log(`\n${i + 1}. ${job.title}`);
        console.log(`   Key: ${key}`);
        console.log(`   Location: ${job.location}`);
        console.log(`   Salary: ${job.salary || 'N/A'}`);
      });
    } else {
      console.log('✅ İş ilanları doğru şekilde işleniyor');
      console.log('\n📋 İlk 3 iş ilanı:');
      uniqueJobs.slice(0, 3).forEach((job, i) => {
        console.log(`${i + 1}. ${job.title} - ${job.location}`);
      });
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
}

debugJobs();

