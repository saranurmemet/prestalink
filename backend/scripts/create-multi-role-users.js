const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Notification = require('../models/Notification');

const users = [
  {
    name: 'Mehmet Demir',
    email: 'mehmet@prestalink.app',
    password: 'mehmet',
    phone: '+905551234567',
    roles: ['user', 'recruiter', 'admin'],
    activeRole: 'user',
    gender: 'male',
    profilePhoto: 'https://i.pravatar.cc/400?img=12',
    bio: 'Experienced quality control specialist with 6+ years in automotive and precision manufacturing. CNC operator certified with expertise in metrology, inspection systems, and ISO 9001 standards. Fluent in Turkish, English, French and Arabic. Seeking opportunities in Europe for career advancement.',
    languages: ['TR', 'EN', 'FR', 'AR'],
    country: 'Turkey',
    experienceLevel: '5+ years'
  },
  {
    name: 'Ahmet Yılmaz',
    email: 'ahmet@prestalink.app',
    password: 'ahmet',
    phone: '+905559876543',
    roles: ['user', 'recruiter', 'admin'],
    activeRole: 'user',
    gender: 'male',
    profilePhoto: 'https://i.pravatar.cc/400?img=15',
    bio: 'Software engineer with 5 years of experience in full-stack development. Specialized in React, Node.js, and cloud technologies. Passionate about building scalable applications and working in international teams.',
    languages: ['TR', 'EN', 'DE'],
    country: 'Turkey',
    experienceLevel: '5+ years'
  },
  {
    name: 'Sara Kaya',
    email: 'sara@prestalink.app',
    password: 'sara',
    phone: '+213555111111',
    roles: ['user', 'recruiter', 'admin'],
    activeRole: 'user',
    gender: 'female',
    profilePhoto: 'https://i.pravatar.cc/400?img=47',
    bio: 'Experienced nurse with 4 years in intensive care and emergency departments. Certified in BLS, ACLS, and PALS. Fluent in French and Arabic. Looking for opportunities in European healthcare facilities.',
    languages: ['FR', 'AR', 'EN'],
    country: 'Algeria',
    experienceLevel: '3-5 years'
  },
  {
    name: 'Sarad Admin',
    email: 'sarad@prestalink.app',
    password: 'sarad',
    phone: '+213555222222',
    roles: ['user', 'recruiter', 'admin'],
    activeRole: 'admin',
    gender: 'female',
    profilePhoto: 'https://i.pravatar.cc/400?img=48',
    bio: 'HR professional with 7 years of experience in recruitment and talent acquisition. Specialized in international recruitment, especially for European markets. Fluent in French, Arabic, and English.',
    languages: ['FR', 'AR', 'EN'],
    country: 'Algeria',
    experienceLevel: '5+ years'
  }
];

const certificates = [
  'ISO 9001:2015 Quality Management Systems (TÜV SÜD, 2023)',
  'CNC Programming & Operation Certificate (TOBB ETU, 2022)',
  'Coordinate Measuring Machine (CMM) Training (Zeiss Academy, 2022)',
  'Six Sigma Green Belt Certification (ASQ, 2021)',
  'Advanced Manufacturing Techniques (Siemens Technical Academy, 2021)',
  'Occupational Health & Safety Training (Ministry of Labor, 2023)',
  'First Aid & Emergency Response Training (Red Crescent, 2022)',
  'Advanced Metrology & CMM Operation (National Metrology Institute, 2021)'
];

async function createMultiRoleUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected\n');

    // Tüm kullanıcıları sil ve yeniden oluştur
    await User.deleteMany({ email: { $in: users.map(u => u.email) } });
    console.log('🗑️  Old users deleted\n');

    // İş ilanlarını al
    const jobs = await Job.find({ status: 'active' }).limit(10);
    console.log(`📋 ${jobs.length} job listings found\n`);

    for (const userData of users) {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`👤 Creating: ${userData.name}`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

      // Kullanıcıyı oluştur
      const user = await User.create({
        ...userData,
        certificates: certificates
      });

      console.log(`✅ User created with ID: ${user._id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Roles: ${user.roles.join(', ')}`);
      console.log(`   Active Role: ${user.activeRole}`);
      console.log(`   Certificates: ${user.certificates.length}`);

      // 3 iş başvurusu oluştur
      const applicationStatuses = ['pending', 'reviewing', 'interview'];
      
      for (let i = 0; i < Math.min(jobs.length, 3); i++) {
        const job = jobs[i];
        const status = applicationStatuses[i % applicationStatuses.length];

        await Application.create({
          userId: user._id,
          jobId: job._id,
          status: status,
          cvUrl: `/uploads/cv/${user.name.toLowerCase().replace(' ', '_')}_cv.txt`,
          coverLetter: `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${job.title} position. With my background in ${userData.experienceLevel} experience and proficiency in ${userData.languages.join(', ')}, I am confident I would be a valuable addition to your team.\n\nThank you for considering my application.\n\nBest regards,\n${user.name}`,
          appliedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        });
      }

      console.log(`✅ 3 job applications created`);

      // 6 bildirim oluştur
      const notifications = [
        {
          targetUserId: user._id,
          title: 'Application Accepted',
          message: 'Your application for Quality Control Specialist has been accepted. Next step: Interview.',
          read: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        },
        {
          targetUserId: user._id,
          title: 'Interview Scheduled',
          message: 'Your interview is scheduled for tomorrow at 10:00 AM.',
          read: false,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
        },
        {
          targetUserId: user._id,
          title: 'Document Required',
          message: 'Please upload your diploma certificate to complete your application.',
          read: false,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
        },
        {
          targetUserId: user._id,
          title: 'New Job Match',
          message: 'We found 5 new job opportunities matching your profile.',
          read: true,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
        },
        {
          targetUserId: user._id,
          title: 'Profile Updated',
          message: 'Your profile has been successfully updated with new certifications.',
          read: true,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
        },
        {
          targetUserId: user._id,
          title: 'Welcome to PrestaLink',
          message: 'Welcome! Complete your profile to increase your chances of getting hired.',
          read: true,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
        }
      ];

      await Notification.insertMany(notifications);
      console.log(`✅ 6 notifications created (3 unread, 3 read)`);

      console.log(`\n✨ ${userData.name} - COMPLETE\n`);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 ALL USERS CREATED SUCCESSFULLY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('LOGIN CREDENTIALS:');
    users.forEach(u => {
      console.log(`   📧 ${u.email} / 🔑 ${u.password.split('@')[0]}`);
      console.log(`      Roles: ${u.roles.join(', ')}\n`);
    });

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createMultiRoleUsers();
