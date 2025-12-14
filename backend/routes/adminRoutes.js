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
        name: 'Sara Yılmaz',
        email: 'sara@prestalink.app',
        phone: '+213555111111',
        password: 'sara',
        role: 'user',
        languages: ['FR', 'AR']
      },
      {
        name: 'Sarad Admin',
        email: 'sarad@prestalink.app',
        phone: '+213555222222',
        password: 'sarad',
        role: 'admin',
        languages: ['TR', 'EN', 'FR', 'AR']
      },
      {
        name: 'Ahmet Kaya',
        email: 'ahmet@prestalink.app',
        phone: '+905551234567',
        password: 'ahmet',
        role: 'recruiter',
        languages: ['TR', 'EN']
      },
      {
        name: 'Mehmet Demir',
        email: 'mehmet@prestalink.app',
        phone: '+213555333333',
        password: 'mehmet',
        role: 'user',
        languages: ['TR', 'FR']
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
        cvUrl: '/uploads/cvs/mehmet_cv.pdf'
      },
      'ahmet@prestalink.app': {
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
        description: 'We are seeking an experienced Quality Control Engineer to join our manufacturing team.',
        salary: '€3,500 - €4,500/month',
        location: 'Berlin, Germany',
        requiredExperience: '5+ years',
        requiredLanguage: 'English, German',
        workType: 'full-time',
        employerEmail: 'sarad@prestalink.app'
      },
      {
        title: 'Full-Stack Software Developer',
        description: 'Join our dynamic tech team! We are looking for a skilled full-stack developer.',
        salary: '€4,000 - €5,500/month',
        location: 'Amsterdam, Netherlands',
        requiredExperience: '3-5 years',
        requiredLanguage: 'English',
        workType: 'full-time',
        employerEmail: 'sarad@prestalink.app'
      },
      {
        title: 'ICU Registered Nurse',
        description: 'Urgent need for experienced ICU nurses. Must have BLS, ACLS certifications.',
        salary: '€3,200 - €4,000/month',
        location: 'Paris, France',
        requiredExperience: '3+ years',
        requiredLanguage: 'French, English',
        workType: 'full-time',
        employerEmail: 'sarad@prestalink.app'
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
      {
        targetUserId: employerMap['mehmet@prestalink.app'],
        title: 'Application Received',
        message: 'Your application for Senior Quality Control Engineer has been received and is under review.',
        read: false
      },
      {
        targetUserId: employerMap['sara@prestalink.app'],
        title: 'Application Accepted',
        message: 'Great news! Your application for ICU Registered Nurse has been accepted.',
        read: false
      },
      {
        targetUserId: employerMap['sarad@prestalink.app'],
        title: 'New Application Received',
        message: 'You have received 3 new applications for the Senior Quality Control Engineer position.',
        read: false
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
