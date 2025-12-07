require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Job = require('../models/Job');

const salaryConversions = {
  '€48K - €58K': '€4,000 - €4,800/ay',
  '€42K - €50K': '€3,500 - €4,200/ay',
  '€60K - €75K': '€5,000 - €6,250/ay',
  '€38K - €45K': '€3,200 - €3,750/ay',
};

async function updateSalaries() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected\n');

    const jobs = await Job.find({});
    console.log(`Found ${jobs.length} jobs to check\n`);

    let updated = 0;
    for (const job of jobs) {
      if (job.salary && salaryConversions[job.salary]) {
        const oldSalary = job.salary;
        job.salary = salaryConversions[job.salary];
        await job.save();
        console.log(`✓ Updated: ${job.title} - ${oldSalary} → ${job.salary}`);
        updated++;
      }
    }

    console.log(`\n✅ Updated ${updated} jobs`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

updateSalaries();

