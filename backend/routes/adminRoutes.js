const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Notification = require('../models/Notification');

// Seed endpoint - Sadece production'da bir kez çalıştırılmalı
router.post('/seed-users', async (req, res) => {
  try {
    // Güvenlik: Sadece production'da ve belirli bir secret key ile
    const secretKey = req.headers['x-seed-secret'] || req.body.secretKey;
    const expectedSecret = process.env.SEED_SECRET || 'prestalink-seed-2024';
    
    if (secretKey !== expectedSecret) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ 
        message: 'Database not connected',
        readyState: mongoose.connection.readyState
      });
    }

    const testUsers = [
      {
        name: 'Sara Soley',
        email: 'sara@prestalink.app',
        phone: '+213555111111',
        password: 'sara',
        role: 'user',
        languages: ['FR', 'AR'],
        gender: 'female'
      },
      {
        name: 'Sarad Kaşgarlı',
        email: 'sarad@prestalink.app',
        phone: '+213555222222',
        password: 'sarad',
        role: 'admin',
        languages: ['TR', 'EN', 'FR', 'AR'],
        gender: 'female'
      },
      {
        name: 'Ahmet Suriye',
        email: 'ahmet@prestalink.app',
        phone: '+905551234567',
        password: 'ahmet',
        role: 'recruiter',
        languages: ['TR', 'EN'],
        gender: 'male'
      },
      {
        name: 'Mehmet Demir',
        email: 'mehmet@prestalink.app',
        phone: '+213555333333',
        password: 'mehmet',
        role: 'user',
        languages: ['TR', 'FR'],
        gender: 'male'
      }
    ];

    const results = [];
    
    for (const userData of testUsers) {
      try {
        const existing = await User.findOne({ email: userData.email });
        if (existing) {
          results.push({ 
            email: userData.email, 
            status: 'exists', 
            message: 'User already exists' 
          });
          continue;
        }
        
        const user = await User.create(userData);
        results.push({ 
          email: userData.email, 
          status: 'created', 
          message: 'User created successfully' 
        });
      } catch (error) {
        results.push({ 
          email: userData.email, 
          status: 'error', 
          message: error.message 
        });
      }
    }

    res.json({
      success: true,
      message: 'Seed operation completed',
      results: results,
      users: results.filter(r => r.status === 'created').length
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ 
      message: 'Seed failed', 
      error: error.message 
    });
  }
});

// Comprehensive profiles endpoint - CV, fotoğraflar, bildirimler, iş ilanları
router.post('/seed-comprehensive-profiles', async (req, res) => {
  try {
    const secretKey = req.headers['x-seed-secret'] || req.body.secretKey;
    const expectedSecret = process.env.SEED_SECRET || 'prestalink-seed-2024';
    
    if (secretKey !== expectedSecret) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ 
        message: 'Database not connected',
        readyState: mongoose.connection.readyState
      });
    }

    // Kapsamlı profil verileri
    const userProfiles = {
      'mehmet@prestalink.app': {
        name: 'Mehmet Demir',
        gender: 'male',
        bio: 'Experienced Quality Control Specialist with 6+ years in automotive and precision manufacturing. CNC operator certified with expertise in metrology, inspection systems, and ISO 9001 standards. Fluent in Turkish, English, French and Arabic. Seeking opportunities in Europe for career advancement.',
        languages: ['TR', 'EN', 'FR', 'AR'],
        country: 'Turkey',
        city: 'Istanbul',
        experienceLevel: '5+ years',
        certificates: [
          'ISO 9001:2015 Quality Management Systems (TÜV SÜD, 2023)',
          'CNC Programming & Operation Certificate (TOBB ETU, 2022)',
          'Coordinate Measuring Machine (CMM) Training (Zeiss Academy, 2022)',
          'Six Sigma Green Belt Certification (ASQ, 2021)',
          'Advanced Manufacturing Techniques (Siemens Technical Academy, 2021)',
          'Occupational Health & Safety Training (Ministry of Labor, 2023)'
        ],
        profilePhoto: '/uploads/profilePhotos/mehmet.png',
        cvUrl: '/uploads/cvs/mehmet_cv.pdf'
      },
      'ahmet@prestalink.app': {
        name: 'Ahmet Suriye',
        gender: 'male',
        bio: 'Software Engineer with 5 years of experience in full-stack development. Specialized in React, Node.js, and cloud technologies. Passionate about building scalable applications and working in international teams. Looking for opportunities in European tech companies.',
        languages: ['TR', 'EN', 'DE'],
        country: 'Turkey',
        city: 'Ankara',
        experienceLevel: '3-5 years',
        certificates: [
          'AWS Certified Solutions Architect (2023)',
          'React Advanced Patterns Certification (2022)',
          'Node.js Backend Development Certificate (2021)',
          'MongoDB Certified Developer (2021)',
          'Docker & Kubernetes Fundamentals (2022)',
          'Agile & Scrum Master Certification (2020)'
        ],
        profilePhoto: '/uploads/profilePhotos/ahmet.png',
        cvUrl: '/uploads/cvs/ahmet_cv.pdf'
      },
      'sara@prestalink.app': {
        name: 'Sara Soley',
        gender: 'female',
        bio: 'Experienced Nurse with 4 years in intensive care and emergency departments. Certified in BLS, ACLS, and PALS. Fluent in French and Arabic. Dedicated to providing high-quality patient care. Looking for opportunities in European healthcare facilities.',
        languages: ['FR', 'AR', 'EN', 'TR'],
        country: 'Algeria',
        city: 'Algiers',
        experienceLevel: '3-5 years',
        certificates: [
          'BLS (Basic Life Support) Certification (2023)',
          'ACLS (Advanced Cardiac Life Support) Certification (2023)',
          'PALS (Pediatric Advanced Life Support) Certification (2022)',
          'Critical Care Nursing Certificate (2021)',
          'Emergency Nursing Certification (2020)',
          'Infection Control & Prevention Training (2023)'
        ],
        profilePhoto: '/uploads/profilePhotos/sara.png',
        cvUrl: '/uploads/cvs/sara_cv.pdf'
      },
      'sarad@prestalink.app': {
        name: 'Sarad Kaşgarlı',
        gender: 'female',
        bio: 'HR Professional with 7 years of experience in recruitment and talent acquisition. Specialized in international recruitment, especially for European markets. Expert in employer branding, candidate sourcing, and talent management. Fluent in French, Arabic, and English.',
        languages: ['FR', 'AR', 'EN', 'TR'],
        country: 'Algeria',
        city: 'Oran',
        experienceLevel: '5+ years',
        certificates: [
          'SHRM Certified Professional (SHRM-CP) (2023)',
          'Talent Acquisition Specialist Certification (2022)',
          'HR Analytics & Data-Driven Recruitment (2022)',
          'Employer Branding Certificate (2021)',
          'International Recruitment Strategies (2021)',
          'LinkedIn Recruiter Certification (2020)'
        ],
        profilePhoto: '/uploads/profilePhotos/sarad.png',
        cvUrl: '/uploads/cvs/sarad_cv.pdf'
      }
    };

    const results = {
      profilesUpdated: 0,
      jobsCreated: 0,
      applicationsCreated: 0,
      notificationsCreated: 0
    };

    // 1. Profilleri güncelle
    const users = await User.find({
      email: { $in: Object.keys(userProfiles) }
    });

    for (const user of users) {
      const profile = userProfiles[user.email];
      if (!profile) continue;

      if (profile.name) user.name = profile.name;
      if (profile.gender) user.gender = profile.gender;
      user.bio = profile.bio;
      user.languages = profile.languages;
      user.country = profile.country;
      user.city = profile.city;
      user.experienceLevel = profile.experienceLevel;
      user.certificates = profile.certificates;
      if (profile.profilePhoto) user.profilePhoto = profile.profilePhoto;
      if (profile.cvUrl) user.cvUrl = profile.cvUrl;

      await user.save();
      results.profilesUpdated++;
    }

    // 2. İş ilanları oluştur
    const employerMap = {};
    for (const user of users) {
      employerMap[user.email] = user._id;
    }

    const jobListings = [
      {
        title: 'Senior Quality Control Engineer',
        description: 'We are seeking an experienced Quality Control Engineer to join our manufacturing team. The ideal candidate will have expertise in ISO 9001, CMM operations, and quality management systems.',
        salary: '€3,500 - €4,500/month',
        location: 'Berlin, Germany',
        requiredExperience: '5+ years',
        requiredLanguage: 'English, German',
        workType: 'full-time',
        employerEmail: 'sarad@prestalink.app'
      },
      {
        title: 'Full-Stack Software Developer',
        description: 'Join our dynamic tech team! We are looking for a skilled full-stack developer with experience in React and Node.js. Remote work options available.',
        salary: '€4,000 - €5,500/month',
        location: 'Amsterdam, Netherlands',
        requiredExperience: '3-5 years',
        requiredLanguage: 'English',
        workType: 'full-time',
        employerEmail: 'sarad@prestalink.app'
      },
      {
        title: 'ICU Registered Nurse',
        description: 'Urgent need for experienced ICU nurses. Must have BLS, ACLS certifications. Competitive salary and benefits package. Relocation assistance available.',
        salary: '€3,200 - €4,000/month',
        location: 'Paris, France',
        requiredExperience: '3+ years',
        requiredLanguage: 'French, English',
        workType: 'full-time',
        employerEmail: 'sarad@prestalink.app'
      },
      {
        title: 'HR Recruitment Specialist',
        description: 'We are expanding our HR team and looking for an experienced recruitment specialist with international experience. Focus on European talent acquisition.',
        salary: '€3,800 - €4,800/month',
        location: 'Brussels, Belgium',
        requiredExperience: '5+ years',
        requiredLanguage: 'English, French',
        workType: 'full-time',
        employerEmail: 'ahmet@prestalink.app'
      },
      {
        title: 'Quality Assurance Manager',
        description: 'Lead our quality assurance team. Must have strong background in manufacturing quality control, ISO standards, and team management.',
        salary: '€4,500 - €6,000/month',
        location: 'Munich, Germany',
        requiredExperience: '7+ years',
        requiredLanguage: 'English, German',
        workType: 'full-time',
        employerEmail: 'ahmet@prestalink.app'
      },
      {
        title: 'Frontend React Developer',
        description: 'Looking for a talented React developer to join our frontend team. Experience with TypeScript and modern React patterns required.',
        salary: '€3,500 - €4,800/month',
        location: 'Barcelona, Spain',
        requiredExperience: '2-4 years',
        requiredLanguage: 'English, Spanish',
        workType: 'full-time',
        employerEmail: 'ahmet@prestalink.app'
      },
      {
        title: 'Emergency Department Nurse',
        description: 'Join our emergency department team. Experience in emergency care and triage required. Fast-paced environment with excellent growth opportunities.',
        salary: '€3,000 - €3,800/month',
        location: 'Lyon, France',
        requiredExperience: '2+ years',
        requiredLanguage: 'French, English',
        workType: 'full-time',
        employerEmail: 'sarad@prestalink.app'
      },
      {
        title: 'Backend Node.js Developer',
        description: 'We need an experienced Node.js developer to build scalable backend services. Experience with MongoDB, Express, and microservices architecture preferred.',
        salary: '€4,200 - €5,500/month',
        location: 'Vienna, Austria',
        requiredExperience: '3-5 years',
        requiredLanguage: 'English, German',
        workType: 'full-time',
        employerEmail: 'ahmet@prestalink.app'
      }
    ];

    const createdJobs = [];
    for (const jobData of jobListings) {
      const employerId = employerMap[jobData.employerEmail];
      if (!employerId) continue;

      const existing = await Job.findOne({ title: jobData.title, employerId });
      if (existing) continue;

      const job = await Job.create({
        title: jobData.title,
        description: jobData.description,
        salary: jobData.salary,
        location: jobData.location,
        requiredExperience: jobData.requiredExperience,
        requiredLanguage: jobData.requiredLanguage,
        workType: jobData.workType,
        employerId: employerId,
        closed: false
      });

      createdJobs.push(job);
      results.jobsCreated++;
    }

    // 3. Başvurular oluştur
    const candidateUsers = users.filter(u => 
      ['mehmet@prestalink.app', 'ahmet@prestalink.app', 'sara@prestalink.app'].includes(u.email)
    );

    for (const candidate of candidateUsers) {
      const jobsToApply = createdJobs.slice(0, 2);
      for (const job of jobsToApply) {
        const existing = await Application.findOne({ userId: candidate._id, jobId: job._id });
        if (existing) continue;

        await Application.create({
          userId: candidate._id,
          jobId: job._id,
          cvUrl: candidate.cvUrl,
          certificates: candidate.certificates || [],
          status: 'pending',
          messages: []
        });
        results.applicationsCreated++;
      }
    }

    // 4. Bildirimler oluştur
    const notifications = [
      // Mehmet için
      {
        targetUserId: employerMap['mehmet@prestalink.app'],
        title: 'Application Received',
        message: 'Your application for Senior Quality Control Engineer has been received and is under review.',
        read: false
      },
      {
        targetUserId: employerMap['mehmet@prestalink.app'],
        title: 'Interview Scheduled',
        message: 'Congratulations! Your interview for Quality Assurance Manager is scheduled for next week. Please check your email for details.',
        read: false
      },
      {
        targetUserId: employerMap['mehmet@prestalink.app'],
        title: 'Profile Update Required',
        message: 'Please update your CV and certificates to improve your application chances.',
        read: true
      },
      // Ahmet için
      {
        targetUserId: employerMap['ahmet@prestalink.app'],
        title: 'New Job Match',
        message: 'We found 5 new job opportunities matching your profile as a Software Engineer. Check them out!',
        read: false
      },
      {
        targetUserId: employerMap['ahmet@prestalink.app'],
        title: 'Application Status Update',
        message: 'Your application for Full-Stack Software Developer has moved to the interview stage.',
        read: false
      },
      {
        targetUserId: employerMap['ahmet@prestalink.app'],
        title: 'Welcome to PrestaLink',
        message: 'Welcome! Complete your profile to start applying for jobs in Europe.',
        read: true
      },
      // Sara için
      {
        targetUserId: employerMap['sara@prestalink.app'],
        title: 'Application Accepted',
        message: 'Great news! Your application for ICU Registered Nurse has been accepted. Welcome to the team!',
        read: false
      },
      {
        targetUserId: employerMap['sara@prestalink.app'],
        title: 'Document Required',
        message: 'Please upload your updated nursing license to complete your application.',
        read: false
      },
      {
        targetUserId: employerMap['sara@prestalink.app'],
        title: 'New Opportunity',
        message: 'A new Emergency Department Nurse position in Lyon matches your profile. Apply now!',
        read: false
      },
      {
        targetUserId: employerMap['sara@prestalink.app'],
        title: 'Profile Complete',
        message: 'Your profile has been completed successfully. You can now apply for jobs!',
        read: true
      },
      // Sarad için (recruiter)
      {
        targetUserId: employerMap['sarad@prestalink.app'],
        title: 'New Application Received',
        message: 'You have received 5 new applications for the Senior Quality Control Engineer position.',
        read: false
      },
      {
        targetUserId: employerMap['sarad@prestalink.app'],
        title: 'Job Posting Live',
        message: 'Your job posting for Full-Stack Software Developer is now live and receiving applications.',
        read: false
      },
      {
        targetUserId: employerMap['sarad@prestalink.app'],
        title: 'Candidate Match Found',
        message: 'A highly qualified candidate (Mehmet Demir) has applied for your Quality Control position.',
        read: false
      },
      {
        targetUserId: employerMap['sarad@prestalink.app'],
        title: 'Weekly Summary',
        message: 'This week you received 12 new applications across all your job postings.',
        read: true
      },
      // Ahmet için (recruiter)
      {
        targetUserId: employerMap['ahmet@prestalink.app'],
        title: 'New Application',
        message: 'You have received 3 new applications for the Frontend React Developer position.',
        read: false
      },
      {
        targetUserId: employerMap['ahmet@prestalink.app'],
        title: 'Job Posted Successfully',
        message: 'Your job posting for Backend Node.js Developer is now live.',
        read: true
      }
    ];

    for (const notif of notifications) {
      if (!notif.targetUserId) continue;
      await Notification.create(notif);
      results.notificationsCreated++;
    }

    res.json({
      success: true,
      message: 'Comprehensive profiles created',
      results: results
    });
  } catch (error) {
    console.error('Comprehensive profiles error:', error);
    res.status(500).json({ 
      message: 'Failed', 
      error: error.message 
    });
  }
});

module.exports = router;
