// Clean duplicate jobs from database
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Job = require('../models/Job');

const cleanDuplicates = async () => {
  try {
    console.log('🔄 MongoDB bağlanıyor...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB bağlandı\n');

    // Find all jobs
    const allJobs = await Job.find({});
    console.log(`📊 Toplam ${allJobs.length} iş ilanı bulundu\n`);

    // Group by title, location, and salary to find duplicates
    const jobMap = new Map();
    const duplicates = [];

    allJobs.forEach((job) => {
      const key = `${job.title}|${job.location}|${job.salary}`;
      if (jobMap.has(key)) {
        duplicates.push(job._id);
      } else {
        jobMap.set(key, job._id);
      }
    });

    console.log(`🔍 ${duplicates.length} tekrar eden iş ilanı bulundu\n`);

    if (duplicates.length > 0) {
      // Delete duplicates (keep the first one, delete the rest)
      const result = await Job.deleteMany({ _id: { $in: duplicates } });
      console.log(`✅ ${result.deletedCount} tekrar eden iş ilanı silindi\n`);
    }

    const remainingJobs = await Job.countDocuments({});
    console.log(`📊 Kalan iş ilanı sayısı: ${remainingJobs}\n`);
    console.log('✅ Temizleme tamamlandı!\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
};

cleanDuplicates();


















