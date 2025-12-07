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

    // Test users - Her kullanıcı tüm rollere erişebilir (email + role kombinasyonu)
    const testUsers = [
      { name: 'Ahmet', email: 'ahmet@prestalink.app', phone: '+905551234567', password: 'ahmet', languages: ['EN', 'TR', 'AR'] },
      { name: 'Sara', email: 'sara@prestalink.app', phone: '+905551234568', password: 'sara', languages: ['EN', 'FR'] },
      { name: 'Sarad', email: 'sarad@prestalink.app', phone: '+905551234569', password: 'sarad', languages: ['EN', 'FR', 'AR'] },
      { name: 'Mehmet', email: 'mehmet@prestalink.app', phone: '+905551234570', password: 'mehmet', languages: ['EN', 'TR'] },
    ];

    const roles = ['user', 'recruiter', 'admin'];
    
    // Her kullanıcı için her rol için ayrı kayıt oluştur
    const users = [];
    testUsers.forEach(userData => {
      roles.forEach(role => {
        users.push({
          ...userData,
          email: `${userData.email.split('@')[0]}_${role}@prestalink.app`, // ahmet_user@prestalink.app, ahmet_recruiter@prestalink.app, etc.
          role: role,
        });
      });
    });

    // Legacy test users (backward compatibility)
    users.push(
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
      }
    );

    for (const data of users) {
      const existing = await User.findOne({ email: data.email });
      if (existing) {
        console.log(`User ${data.email} already exists`);
        continue;
      }
      await User.create(data);
      console.log(`Created ${data.role} -> ${data.email}`);
    }

    // Create demo jobs for recruiter (sara_recruiter@prestalink.app)
    const recruiter = await User.findOne({ email: 'sara_recruiter@prestalink.app' });
    if (recruiter) {
      const demoJobs = [
        {
          title: 'CNC Specialist',
          description: 'Leading automotive supplier in Germany seeking experienced CNC specialist. Operate and maintain precision machining equipment. Full relocation support, housing assistance, and visa sponsorship included. Professional development opportunities available.',
          salary: '€48K - €58K',
          location: 'Munich, DE',
          requiredExperience: '3+ years',
          requiredLanguage: 'DE',
        },
        {
          title: 'Hospitality Manager',
          description: 'Luxury 5-star resort in French Riviera seeking bilingual hospitality manager. Oversee guest services, staff management, and daily operations. Competitive benefits package with accommodation. Beautiful coastal location with excellent work-life balance.',
          salary: '€42K - €50K',
          location: 'Nice, FR',
          requiredExperience: '5+ years',
          requiredLanguage: 'FR / EN',
        },
        {
          title: 'Software Engineer',
          description: 'Fast-growing tech startup in Berlin looking for talented software engineer. Work with modern tech stack (React, Node.js, TypeScript). Remote-friendly with flexible hours. Equity participation and career growth opportunities.',
          salary: '€60K - €75K',
          location: 'Berlin, DE',
          requiredExperience: '4+ years',
          requiredLanguage: 'EN',
        },
        {
          title: 'Marketing Specialist',
          description: 'Digital marketing agency in Amsterdam seeking creative marketing specialist. Develop and execute campaigns for international clients. Dynamic work environment with creative freedom. Relocation support and professional training provided.',
          salary: '€38K - €45K',
          location: 'Amsterdam, NL',
          requiredExperience: '2+ years',
          requiredLanguage: 'EN',
        },
      ];

      // Check and create jobs only if they don't exist (by title + location + salary)
      for (const jobData of demoJobs) {
        const existing = await Job.findOne({
          title: jobData.title,
          location: jobData.location,
          salary: jobData.salary,
          employerId: recruiter._id,
        });
        if (!existing) {
          await Job.create({
            ...jobData,
            employerId: recruiter._id,
          });
          console.log(`Created job: ${jobData.title} - ${jobData.location}`);
        } else {
          console.log(`Job already exists: ${jobData.title} - ${jobData.location}`);
        }
      }
    }

    // Also create jobs for legacy recruiter (backward compatibility)
    const legacyRecruiter = await User.findOne({ email: 'recruiter@prestalink.dev' });
    if (legacyRecruiter) {
      const legacyJobs = [
        {
          title: 'CNC Specialist',
          description: 'Automotive supplier in Germany looking for CNC expert.',
          salary: '€48K - €58K',
          location: 'Munich, DE',
          requiredExperience: '3+ years',
          requiredLanguage: 'DE',
        },
        {
          title: 'Hospitality Manager',
          description: 'Luxury resort in France seeking bilingual manager.',
          salary: '€42K - €50K',
          location: 'Nice, FR',
          requiredExperience: '5+ years',
          requiredLanguage: 'FR / EN',
        },
      ];

      // Check and create jobs only if they don't exist (by title + location + salary)
      for (const jobData of legacyJobs) {
        const existing = await Job.findOne({
          title: jobData.title,
          location: jobData.location,
          salary: jobData.salary,
          employerId: legacyRecruiter._id,
        });
        if (!existing) {
          await Job.create({
            ...jobData,
            employerId: legacyRecruiter._id,
          });
          console.log(`Created legacy job: ${jobData.title} - ${jobData.location}`);
        } else {
          console.log(`Legacy job already exists: ${jobData.title} - ${jobData.location}`);
        }
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

