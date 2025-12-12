const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Job = require('../models/Job');

const seed = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('Missing MONGO_URI');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Mongo connected');

    const users = [
      {
        name: 'Test Candidate',
        email: 'candidate@prestalink.dev',
        phone: '+900000000001',
        password: 'Test123!',
        role: 'user',
        languages: ['EN', 'TR'],
      },
      {
        name: 'Test Recruiter',
        email: 'recruiter@prestalink.dev',
        phone: '+900000000002',
        password: 'Test123!',
        role: 'recruiter',
        languages: ['EN', 'FR'],
      },
      {
        name: 'Test Admin',
        email: 'admin@prestalink.dev',
        phone: '+900000000003',
        password: 'Test123!',
        role: 'admin',
        languages: ['EN'],
      },
    ];

    for (const data of users) {
      const existing = await User.findOne({ email: data.email });
      if (existing) {
        console.log(`User ${data.email} already exists`);
        continue;
      }
      await User.create(data);
      console.log(`Created ${data.role} -> ${data.email}`);
    }

    const recruiter = await User.findOne({ email: 'recruiter@prestalink.dev' });
    if (recruiter) {
      const jobCount = await Job.countDocuments({ employerId: recruiter._id });
      if (jobCount === 0) {
        await Job.create([
          {
            title: 'CNC Specialist',
            description: 'Automotive supplier in Germany looking for CNC expert.',
            salary: '€48K - €58K',
            location: 'Munich, DE',
            requiredExperience: '3+ years',
            requiredLanguage: 'DE',
            employerId: recruiter._id,
          },
          {
            title: 'Hospitality Manager',
            description: 'Luxury resort in France seeking bilingual manager.',
            salary: '€42K - €50K',
            location: 'Nice, FR',
            requiredExperience: '5+ years',
            requiredLanguage: 'FR / EN',
            employerId: recruiter._id,
          },
        ]);
        console.log('Seeded demo jobs');
      }
    }

    await mongoose.disconnect();
    console.log('Seeding done');
  } catch (error) {
    console.error('Seed error:', error);
    process.exitCode = 1;
  }
};

seed();

