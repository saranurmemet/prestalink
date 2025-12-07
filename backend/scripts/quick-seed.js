// Quick seed script - Only creates Mehmet users for testing
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Job = require('../models/Job');

const seed = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    if (!process.env.MONGO_URI) {
      throw new Error('❌ Missing MONGO_URI in .env file');
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected\n');

    // Mehmet için tüm rolleri oluştur
    const mehmetUsers = [
      {
        name: 'Mehmet',
        email: 'mehmet_user@prestalink.app',
        phone: '+905551234570',
        password: 'mehmet',
        role: 'user',
        languages: ['EN', 'TR'],
      },
      {
        name: 'Mehmet',
        email: 'mehmet_recruiter@prestalink.app',
        phone: '+905551234571',
        password: 'mehmet',
        role: 'recruiter',
        languages: ['EN', 'TR'],
      },
      {
        name: 'Mehmet',
        email: 'mehmet_admin@prestalink.app',
        phone: '+905551234572',
        password: 'mehmet',
        role: 'admin',
        languages: ['EN', 'TR'],
      },
    ];

    console.log('👤 Creating Mehmet users...\n');
    
    for (const data of mehmetUsers) {
      const existing = await User.findOne({ email: data.email });
      if (existing) {
        console.log(`⚠️  User ${data.email} already exists (skipping)`);
        continue;
      }
      await User.create(data);
      console.log(`✅ Created ${data.role} -> ${data.email}`);
    }

    // Recruiter için demo işler oluştur
    const recruiter = await User.findOne({ email: 'mehmet_recruiter@prestalink.app' });
    if (recruiter) {
      const jobCount = await Job.countDocuments({ employerId: recruiter._id });
      if (jobCount === 0) {
        await Job.create([
          {
            title: 'CNC Specialist',
            description: 'Leading automotive supplier in Germany seeking experienced CNC specialist.',
            salary: '€4,000 - €4,800/ay',
            location: 'Munich, DE',
            requiredExperience: '3+ years',
            requiredLanguage: 'DE',
            employerId: recruiter._id,
          },
          {
            title: 'Software Engineer',
            description: 'Fast-growing tech startup in Berlin looking for talented software engineer.',
            salary: '€5,000 - €6,250/ay',
            location: 'Berlin, DE',
            requiredExperience: '4+ years',
            requiredLanguage: 'EN',
            employerId: recruiter._id,
          },
        ]);
        console.log('\n✅ Created 2 demo jobs for mehmet_recruiter@prestalink.app');
      }
    }

    await mongoose.disconnect();
    console.log('\n✅ Seeding completed successfully!\n');
    console.log('🎯 Test with:');
    console.log('   Email: mehmet@prestalink.app');
    console.log('   Password: mehmet');
    console.log('   Roles: User, Recruiter, Admin\n');
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 MongoDB connection failed!');
      console.error('   Make sure MongoDB is running or check MONGO_URI in .env file');
    }
    process.exitCode = 1;
  }
};

seed();




