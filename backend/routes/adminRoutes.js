const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');
const { sendToUserByEmail } = require('../controllers/pushController');

// Bootstrap endpoints - Secret key ile çalışır (authentication gerektirmez)
router.post('/bootstrap/create-algerian-user', async (req, res) => {
  try {
    // Secret key kontrolü
    const secretKey = req.headers['x-bootstrap-secret'] || req.body.secretKey;
    const expectedSecret = process.env.BOOTSTRAP_SECRET || 'prestalink-bootstrap-2024';
    
    if (secretKey !== expectedSecret) {
      return res.status(403).json({ message: 'Unauthorized - Invalid secret key' });
    }

    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ 
        message: 'Database not connected',
        readyState: mongoose.connection.readyState
      });
    }

    // Kullanıcı zaten var mı kontrol et
    const existingUser = await User.findOne({ email: 'amina.benali@prestalink.app' });
    
    const userData = {
      name: 'Amina Benali',
      email: 'amina.benali@prestalink.app',
      password: 'amina2024',
      phone: '+213555123456',
      role: 'user',
      roles: ['user'],
      activeRole: 'user',
      gender: 'female',
      country: 'Algeria',
      city: 'Algiers',
      languages: ['AR', 'FR', 'EN'],
      experienceLevel: '3-5 years',
      profession: 'Textile Worker',
      bio: 'Experienced textile worker with 4 years of hands-on experience in garment manufacturing and quality control. Proven track record in operating industrial sewing machines, maintaining production standards, and ensuring quality compliance. Strong attention to detail, excellent time management skills, and ability to work efficiently in fast-paced production environments. Seeking opportunities in Europe to advance career and contribute to international manufacturing teams.',
      profilePhoto: 'https://i.pravatar.cc/400?img=47',
      cvUrl: '/uploads/cvs/amina_benali_cv.pdf',
      cvContent: `AMINA BENALI
Algiers, Algeria
Phone: +213 555 123 456
Email: amina.benali@prestalink.app

PROFESSIONAL SUMMARY
Experienced textile worker with 4 years of hands-on experience in garment manufacturing and quality control. Proven track record in operating industrial sewing machines, maintaining production standards, and ensuring quality compliance. Strong attention to detail, excellent time management skills, and ability to work efficiently in fast-paced production environments. Seeking opportunities in Europe to advance career and contribute to international manufacturing teams.

WORK EXPERIENCE
Textile Production Specialist | Algerian Textiles Co. | 2022 - Present
- Operated industrial sewing machines for garment assembly
- Performed quality checks on finished products to ensure compliance
- Managed raw material inventory and ensured timely supply to production lines
- Collaborated with design team to implement new product specifications

Quality Control Assistant | North Africa Garments | 2020 - 2022
- Inspected fabrics and garments for defects and adherence to quality standards
- Documented inspection results and reported non-conformities
- Assisted in training new production staff on quality procedures

EDUCATION
High School Diploma | Lycée Emir Abdelkader, Algiers | 2019

CERTIFICATIONS
- Industrial Safety Certificate (2023)
- Textile Manufacturing Training Certificate (2022)
- Quality Control Certification (2021)

SKILLS
- Industrial Sewing Machine Operation
- Quality Control & Assurance
- Garment Manufacturing
- Production Line Management
- Fabric Inspection
- Attention to Detail
- Time Management
- Teamwork

LANGUAGES
Arabic (Native), French (Fluent), English (Intermediate)`,
      certificates: [
        'Industrial Safety Certificate (2023)',
        'Textile Manufacturing Training Certificate (2022)',
        'Quality Control Certification (2021)',
      ],
    };

    let user;
    if (existingUser) {
      // Update existing user
      Object.assign(existingUser, userData);
      await existingUser.save();
      user = existingUser;
    } else {
      // Create new user
      user = await User.create(userData);
    }

    res.json({
      success: true,
      message: existingUser ? 'User updated successfully' : 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        country: user.country,
        city: user.city,
        profession: user.profession,
      },
    });
  } catch (error) {
    console.error('Error creating Algerian user:', error);
    res.status(500).json({
      message: 'Failed to create user',
      error: error.message,
    });
  }
});

// Bootstrap endpoint - ZER Company deployment
router.post('/bootstrap/create-zer-company', async (req, res) => {
  try {
    // Secret key kontrolü
    const secretKey = req.headers['x-bootstrap-secret'] || req.body.secretKey;
    const expectedSecret = process.env.BOOTSTRAP_SECRET || 'prestalink-bootstrap-2024';
    
    if (secretKey !== expectedSecret) {
      return res.status(403).json({ message: 'Unauthorized - Invalid secret key' });
    }

    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ 
        message: 'Database not connected',
        readyState: mongoose.connection.readyState
      });
    }

    // Kullanıcı zaten var mı kontrol et
    const existingUser = await User.findOne({ email: 'zer.company@prestalink.app' });
    
    const userData = {
      name: 'ZER company',
      email: 'zer.company@prestalink.app',
      password: 'zer2024',
      phone: '+33123456789',
      role: 'recruiter',
      roles: ['recruiter'],
      activeRole: 'recruiter',
      companyName: 'ZER company',
      companyDescription: 'ZER company is a leading international recruitment and talent acquisition firm specializing in connecting skilled professionals with top-tier employers across Europe. With over 15 years of experience in the industry, we have successfully placed thousands of candidates in various sectors including manufacturing, technology, healthcare, and hospitality. Our mission is to bridge the gap between talented individuals seeking career opportunities and companies looking for exceptional talent. We pride ourselves on our comprehensive understanding of international labor markets, cultural integration support, and personalized approach to both candidates and employers. Our team of experienced recruiters works tirelessly to ensure the best match between candidates and positions, providing ongoing support throughout the recruitment process and beyond.',
      industry: 'Human Resources & Recruitment Services',
      country: 'France',
      city: 'Paris',
      profilePhoto: 'https://i.pravatar.cc/400?img=68',
      bio: 'Leading international recruitment firm with 15+ years of experience in talent acquisition and placement services across Europe. Specialized in connecting skilled professionals with top-tier employers in manufacturing, technology, healthcare, and hospitality sectors.',
      languages: ['FR', 'EN', 'AR', 'TR', 'DE'],
    };

    let user;
    if (existingUser) {
      // Update existing user
      Object.assign(existingUser, userData);
      await existingUser.save();
      user = existingUser;
    } else {
      // Create new user
      user = await User.create(userData);
    }

    // Profil tamamlanma kontrolü
    const isComplete = user && 
      user.companyName && 
      user.companyDescription && 
      user.industry && 
      user.country && 
      user.city && 
      user.email && 
      user.phone;

    res.json({
      success: true,
      message: existingUser ? 'ZER Company profile updated successfully' : 'ZER Company profile created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        companyName: user.companyName,
        country: user.country,
        city: user.city,
        industry: user.industry,
        role: user.role,
      },
      profileComplete: isComplete,
      profileFields: {
        companyName: !!user.companyName,
        companyDescription: !!user.companyDescription,
        industry: !!user.industry,
        country: !!user.country,
        city: !!user.city,
        email: !!user.email,
        phone: !!user.phone,
        profilePhoto: !!user.profilePhoto,
        bio: !!user.bio,
        languages: user.languages?.length > 0,
      },
    });
  } catch (error) {
    console.error('Error creating ZER Company profile:', error);
    res.status(500).json({
      message: 'Failed to create ZER Company profile',
      error: error.message,
    });
  }
});

// All admin routes require authentication
router.use(authMiddleware);

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
        profilePhoto: '/uploads/profile-photos/mehmet.png',
        cvUrl: '/uploads/cvs/mehmet_cv.pdf',
        cvContent: `MEHMET DEMIR
Quality Control Specialist

PROFESSIONAL SUMMARY
Experienced Quality Control Specialist with 6+ years of expertise in automotive and precision manufacturing. Certified CNC operator with strong background in metrology, inspection systems, and ISO 9001 standards. Fluent in Turkish, English, French, and Arabic.

WORK EXPERIENCE
Senior Quality Control Specialist | ABC Manufacturing | 2019 - Present
- Led quality inspection teams for automotive components
- Implemented ISO 9001 quality management systems
- Reduced defect rates by 35% through process improvements
- Trained 15+ team members on quality standards

Quality Inspector | XYZ Industries | 2017 - 2019
- Performed dimensional inspections using CMM equipment
- Maintained quality documentation and reports
- Collaborated with production teams to resolve quality issues

EDUCATION
Bachelor of Mechanical Engineering | Istanbul Technical University | 2016

SKILLS
- Quality Control & Assurance
- CNC Programming & Operation
- CMM Operation (Zeiss, Mitutoyo)
- ISO 9001 Implementation
- Six Sigma Methodologies
- Metrology & Precision Measurement
- Problem Solving & Root Cause Analysis

LANGUAGES
Turkish (Native), English (Fluent), French (Fluent), Arabic (Conversational)`
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
        profilePhoto: '/uploads/profile-photos/ahmet.png',
        cvUrl: '/uploads/cvs/ahmet_cv.pdf',
        cvContent: `AHMET SURIYE
Software Engineer

PROFESSIONAL SUMMARY
Full-stack Software Engineer with 5 years of experience building scalable web applications. Expert in React, Node.js, and cloud technologies. Passionate about clean code, best practices, and continuous learning.

WORK EXPERIENCE
Senior Software Engineer | TechCorp Solutions | 2021 - Present
- Developed and maintained microservices architecture using Node.js
- Built responsive frontend applications with React and TypeScript
- Reduced API response time by 40% through optimization
- Led team of 3 junior developers

Software Developer | StartupXYZ | 2019 - 2021
- Developed RESTful APIs using Express.js and MongoDB
- Implemented real-time features using WebSockets
- Collaborated with cross-functional teams in agile environment

EDUCATION
Bachelor of Computer Science | Middle East Technical University | 2019

TECHNICAL SKILLS
- Frontend: React, TypeScript, Next.js, Redux, Tailwind CSS
- Backend: Node.js, Express, NestJS, REST APIs, GraphQL
- Databases: MongoDB, PostgreSQL, Redis
- Cloud: AWS (EC2, S3, Lambda), Docker, Kubernetes
- Tools: Git, Docker, Jenkins, Jira, Postman

LANGUAGES
Turkish (Native), English (Fluent), German (Intermediate)`
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
        profilePhoto: '/uploads/profile-photos/sara.png',
        cvUrl: '/uploads/cvs/sara_cv.pdf',
        cvContent: `SARA SOLEY
Registered Nurse

PROFESSIONAL SUMMARY
Dedicated Registered Nurse with 4 years of experience in intensive care and emergency departments. Certified in BLS, ACLS, and PALS. Fluent in French, Arabic, English, and Turkish. Committed to providing compassionate, high-quality patient care.

WORK EXPERIENCE
ICU Nurse | Algiers Medical Center | 2021 - Present
- Provided critical care to patients in intensive care unit
- Monitored vital signs and administered medications
- Collaborated with multidisciplinary healthcare teams
- Trained 5 new nurses on ICU protocols

Emergency Department Nurse | City Hospital | 2019 - 2021
- Treated patients in emergency situations
- Performed triage and initial assessments
- Assisted in emergency procedures and surgeries
- Maintained accurate patient records

EDUCATION
Bachelor of Nursing | University of Algiers | 2019

CERTIFICATIONS
- BLS (Basic Life Support) - Current
- ACLS (Advanced Cardiac Life Support) - Current
- PALS (Pediatric Advanced Life Support) - Current
- Critical Care Nursing Certificate
- Emergency Nursing Certification

SKILLS
- Critical Care Nursing
- Emergency Response
- Patient Assessment & Monitoring
- Medication Administration
- Wound Care & Dressing
- Patient Education
- Multilingual Communication

LANGUAGES
French (Native), Arabic (Native), English (Fluent), Turkish (Conversational)`
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
        profilePhoto: '/uploads/profile-photos/sarad.png',
        cvUrl: '/uploads/cvs/sarad_cv.pdf',
        cvContent: `SARAD KAŞGARLI
HR & Recruitment Specialist

PROFESSIONAL SUMMARY
Strategic HR Professional with 7 years of experience in recruitment and talent acquisition. Specialized in international recruitment for European markets. Expert in employer branding, candidate sourcing, and building high-performing teams.

WORK EXPERIENCE
Senior Recruitment Specialist | Global Talent Solutions | 2020 - Present
- Managed end-to-end recruitment process for 200+ positions annually
- Developed and executed recruitment strategies for European markets
- Reduced time-to-hire by 30% through process optimization
- Built strong talent pipelines using LinkedIn, job boards, and networking
- Collaborated with hiring managers to define job requirements

HR Coordinator | International HR Services | 2017 - 2020
- Sourced and screened candidates for various positions
- Conducted interviews and coordinated hiring processes
- Maintained applicant tracking system (ATS)
- Organized recruitment events and job fairs

EDUCATION
Master of Human Resources Management | University of Oran | 2017
Bachelor of Business Administration | University of Oran | 2015

CERTIFICATIONS
- SHRM Certified Professional (SHRM-CP)
- Talent Acquisition Specialist Certification
- HR Analytics & Data-Driven Recruitment
- Employer Branding Certificate
- International Recruitment Strategies

SKILLS
- Talent Acquisition & Sourcing
- Interviewing & Assessment
- Employer Branding
- ATS Management (Greenhouse, Lever, Workday)
- LinkedIn Recruiter
- HR Analytics & Reporting
- Candidate Relationship Management
- International Recruitment

LANGUAGES
French (Native), Arabic (Native), English (Fluent), Turkish (Conversational)`
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
      if (profile.cvContent) user.cvContent = profile.cvContent;

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

    // 3. Başvurular oluştur - Her kullanıcı için farklı işlere başvuru
    const candidateUsers = users.filter(u => 
      ['mehmet@prestalink.app', 'ahmet@prestalink.app', 'sara@prestalink.app'].includes(u.email)
    );

    // Mehmet için - Quality Control işlerine
    const mehmet = candidateUsers.find(u => u.email === 'mehmet@prestalink.app');
    if (mehmet) {
      const mehmetJobs = createdJobs.filter(j => 
        j.title.includes('Quality') || j.title.includes('Engineer')
      );
      const mehmetStatuses = ['pending', 'reviewing', 'viewed', 'interview'];
      for (let i = 0; i < Math.min(mehmetJobs.length, 4); i++) {
        const job = mehmetJobs[i];
        const existing = await Application.findOne({ userId: mehmet._id, jobId: job._id });
        if (existing) continue;
        await Application.create({
          userId: mehmet._id,
          jobId: job._id,
          cvUrl: mehmet.cvUrl,
          certificates: mehmet.certificates || [],
          status: mehmetStatuses[i % mehmetStatuses.length],
          messages: []
        });
        results.applicationsCreated++;
      }
    }

    // Ahmet için - Software Developer işlerine
    const ahmet = candidateUsers.find(u => u.email === 'ahmet@prestalink.app');
    if (ahmet) {
      const ahmetJobs = createdJobs.filter(j => 
        j.title.includes('Software') || j.title.includes('Developer') || j.title.includes('React') || j.title.includes('Node')
      );
      const ahmetStatuses = ['pending', 'reviewing', 'viewed', 'interview', 'accepted'];
      for (let i = 0; i < Math.min(ahmetJobs.length, 5); i++) {
        const job = ahmetJobs[i];
        const existing = await Application.findOne({ userId: ahmet._id, jobId: job._id });
        if (existing) continue;
        await Application.create({
          userId: ahmet._id,
          jobId: job._id,
          cvUrl: ahmet.cvUrl,
          certificates: ahmet.certificates || [],
          status: ahmetStatuses[i % ahmetStatuses.length],
          messages: []
        });
        results.applicationsCreated++;
      }
    }

    // Sara için - Nurse işlerine
    const sara = candidateUsers.find(u => u.email === 'sara@prestalink.app');
    if (sara) {
      const saraJobs = createdJobs.filter(j => 
        j.title.includes('Nurse') || j.title.includes('ICU') || j.title.includes('Emergency')
      );
      const saraStatuses = ['pending', 'reviewing', 'viewed', 'interview', 'accepted'];
      for (let i = 0; i < Math.min(saraJobs.length, 3); i++) {
        const job = saraJobs[i];
        const existing = await Application.findOne({ userId: sara._id, jobId: job._id });
        if (existing) continue;
        await Application.create({
          userId: sara._id,
          jobId: job._id,
          cvUrl: sara.cvUrl,
          certificates: sara.certificates || [],
          status: saraStatuses[i % saraStatuses.length],
          messages: []
        });
        results.applicationsCreated++;
      }
    }

    // 4. Bildirimler oluştur - Her kullanıcı için 5-6 bildirim
    const notifications = [
      // Mehmet için (5 bildirim)
      {
        targetUserId: employerMap['mehmet@prestalink.app'],
        title: 'Application Received',
        message: 'Your application for Senior Quality Control Engineer has been received and is under review.',
        read: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        targetUserId: employerMap['mehmet@prestalink.app'],
        title: 'Interview Scheduled',
        message: 'Congratulations! Your interview for Quality Assurance Manager is scheduled for next week. Please check your email for details.',
        read: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        targetUserId: employerMap['mehmet@prestalink.app'],
        title: 'Application Viewed',
        message: 'Your application for Senior Quality Control Engineer has been viewed by the employer.',
        read: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        targetUserId: employerMap['mehmet@prestalink.app'],
        title: 'Profile Update Required',
        message: 'Please update your CV and certificates to improve your application chances.',
        read: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        targetUserId: employerMap['mehmet@prestalink.app'],
        title: 'Welcome to PrestaLink',
        message: 'Welcome! Your profile has been created. Start applying for jobs in Europe!',
        read: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      // Ahmet için (6 bildirim)
      {
        targetUserId: employerMap['ahmet@prestalink.app'],
        title: 'New Job Match',
        message: 'We found 5 new job opportunities matching your profile as a Software Engineer. Check them out!',
        read: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        targetUserId: employerMap['ahmet@prestalink.app'],
        title: 'Application Status Update',
        message: 'Your application for Full-Stack Software Developer has moved to the interview stage.',
        read: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        targetUserId: employerMap['ahmet@prestalink.app'],
        title: 'Application Accepted',
        message: 'Great news! Your application for Backend Node.js Developer has been accepted!',
        read: false,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        targetUserId: employerMap['ahmet@prestalink.app'],
        title: 'Interview Reminder',
        message: 'Your interview for Frontend React Developer is scheduled for tomorrow at 2 PM.',
        read: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        targetUserId: employerMap['ahmet@prestalink.app'],
        title: 'Profile Complete',
        message: 'Your profile has been completed successfully. You can now apply for jobs!',
        read: true,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      },
      {
        targetUserId: employerMap['ahmet@prestalink.app'],
        title: 'Welcome to PrestaLink',
        message: 'Welcome! Complete your profile to start applying for jobs in Europe.',
        read: true,
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
      },
      // Sara için (6 bildirim)
      {
        targetUserId: employerMap['sara@prestalink.app'],
        title: 'Application Accepted',
        message: 'Great news! Your application for ICU Registered Nurse has been accepted. Welcome to the team!',
        read: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        targetUserId: employerMap['sara@prestalink.app'],
        title: 'Document Required',
        message: 'Please upload your updated nursing license to complete your application.',
        read: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        targetUserId: employerMap['sara@prestalink.app'],
        title: 'New Opportunity',
        message: 'A new Emergency Department Nurse position in Lyon matches your profile. Apply now!',
        read: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        targetUserId: employerMap['sara@prestalink.app'],
        title: 'Interview Scheduled',
        message: 'Your interview for Emergency Department Nurse is scheduled for next Monday at 10 AM.',
        read: false,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        targetUserId: employerMap['sara@prestalink.app'],
        title: 'Application Viewed',
        message: 'Your application for ICU Registered Nurse has been viewed by the hospital.',
        read: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        targetUserId: employerMap['sara@prestalink.app'],
        title: 'Profile Complete',
        message: 'Your profile has been completed successfully. You can now apply for jobs!',
        read: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      // Sarad için (recruiter) - 6 bildirim
      {
        targetUserId: employerMap['sarad@prestalink.app'],
        title: 'New Application Received',
        message: 'You have received 5 new applications for the Senior Quality Control Engineer position.',
        read: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        targetUserId: employerMap['sarad@prestalink.app'],
        title: 'Job Posting Live',
        message: 'Your job posting for Full-Stack Software Developer is now live and receiving applications.',
        read: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        targetUserId: employerMap['sarad@prestalink.app'],
        title: 'Candidate Match Found',
        message: 'A highly qualified candidate (Mehmet Demir) has applied for your Quality Control position.',
        read: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        targetUserId: employerMap['sarad@prestalink.app'],
        title: 'New Application',
        message: 'You have received 3 new applications for the ICU Registered Nurse position.',
        read: false,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        targetUserId: employerMap['sarad@prestalink.app'],
        title: 'Weekly Summary',
        message: 'This week you received 12 new applications across all your job postings.',
        read: true,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      },
      {
        targetUserId: employerMap['sarad@prestalink.app'],
        title: 'Welcome to PrestaLink',
        message: 'Welcome! Your recruiter account has been set up. Start posting jobs!',
        read: true,
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
      },
      // Ahmet için (recruiter) - 5 bildirim
      {
        targetUserId: employerMap['ahmet@prestalink.app'],
        title: 'New Application',
        message: 'You have received 3 new applications for the Frontend React Developer position.',
        read: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        targetUserId: employerMap['ahmet@prestalink.app'],
        title: 'Job Posted Successfully',
        message: 'Your job posting for Backend Node.js Developer is now live.',
        read: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        targetUserId: employerMap['ahmet@prestalink.app'],
        title: 'Candidate Review',
        message: 'A candidate (Ahmet Suriye) has applied for your Backend Node.js Developer position.',
        read: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        targetUserId: employerMap['ahmet@prestalink.app'],
        title: 'Application Status',
        message: 'You have 8 pending applications to review across all your job postings.',
        read: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        targetUserId: employerMap['ahmet@prestalink.app'],
        title: 'Welcome to PrestaLink',
        message: 'Welcome! Your recruiter account is ready. Start posting jobs!',
        read: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
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

// Send notification to all users
router.post('/notify-all-users', authorizeRoles('admin', 'superadmin'), async (req, res) => {
  try {

    const { title, message, targetRole } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }

    // Get all users (optionally filter by role)
    const query = {};
    if (targetRole) {
      query.role = targetRole;
    }

    const users = await User.find(query).select('_id');
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    // Create notifications for all users
    const notifications = users.map(user => ({
      targetUserId: user._id,
      targetRole: targetRole || null,
      title,
      message,
      read: false,
    }));

    await Notification.insertMany(notifications);

    res.json({
      success: true,
      message: `Notification sent to ${notifications.length} users`,
      count: notifications.length,
    });
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({
      message: 'Failed to send notifications',
      error: error.message,
    });
  }
});

// Push: send to a single user by email (admin/superadmin)
router.post('/push/send', authorizeRoles('admin', 'superadmin'), sendToUserByEmail);

// Grant all roles to specific users (safe allowlist)
// Purpose: allow Mehmet + Sarad to log in as user/recruiter/admin/superadmin.
router.post('/users/grant-all-roles', authorizeRoles('admin', 'superadmin'), async (req, res) => {
  try {
    const allowlist = new Set(['mehmet@prestalink.app', 'sarad@prestalink.app']);
    const requestedEmails = Array.isArray(req.body?.emails) ? req.body.emails : Array.from(allowlist);

    const emails = requestedEmails
      .map((e) => String(e || '').trim().toLowerCase())
      .filter((e) => e && allowlist.has(e));

    if (!emails.length) {
      return res.status(400).json({
        message: 'No valid emails provided for role grant',
        allowed: Array.from(allowlist),
      });
    }

    const allRoles = ['user', 'recruiter', 'admin', 'superadmin'];
    const results = [];

    for (const email of emails) {
      const user = await User.findOne({ email });
      if (!user) {
        results.push({ email, updated: false, reason: 'not_found' });
        continue;
      }

      user.roles = allRoles;
      user.activeRole = user.activeRole || 'user';
      // Keep current role if it's valid, otherwise align to activeRole
      if (!allRoles.includes(user.role)) {
        user.role = user.activeRole;
      }

      await user.save();
      results.push({
        email,
        updated: true,
        roles: user.roles,
        activeRole: user.activeRole,
        role: user.role,
      });
    }

    res.json({ success: true, results });
  } catch (error) {
    console.error('grant-all-roles error:', error);
    res.status(500).json({ message: 'Failed to grant roles', error: error.message });
  }
});

// Bootstrap (seed-secret protected): allow granting roles before any admin exists
// NOTE: Keep allowlisted to avoid broad privilege escalation.
router.post('/bootstrap/grant-all-roles', async (req, res) => {
  try {
    const secretKey = req.headers['x-seed-secret'] || req.body?.secretKey;
    const expectedSecret = process.env.SEED_SECRET || 'prestalink-seed-2024';

    if (secretKey !== expectedSecret) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const allowlist = new Set(['mehmet@prestalink.app', 'sarad@prestalink.app']);
    const requestedEmails = Array.isArray(req.body?.emails) ? req.body.emails : Array.from(allowlist);

    const emails = requestedEmails
      .map((e) => String(e || '').trim().toLowerCase())
      .filter((e) => e && allowlist.has(e));

    if (!emails.length) {
      return res.status(400).json({
        message: 'No valid emails provided for role grant',
        allowed: Array.from(allowlist),
      });
    }

    const allRoles = ['user', 'recruiter', 'admin', 'superadmin'];
    const results = [];

    for (const email of emails) {
      const user = await User.findOne({ email });
      if (!user) {
        results.push({ email, updated: false, reason: 'not_found' });
        continue;
      }

      user.roles = allRoles;
      user.activeRole = user.activeRole || 'user';
      if (!allRoles.includes(user.role)) {
        user.role = user.activeRole;
      }

      await user.save();
      results.push({
        email,
        updated: true,
        roles: user.roles,
        activeRole: user.activeRole,
        role: user.role,
      });
    }

    res.json({ success: true, results });
  } catch (error) {
    console.error('bootstrap/grant-all-roles error:', error);
    res.status(500).json({ message: 'Failed to grant roles', error: error.message });
  }
});

router.post('/create-algerian-user', authorizeRoles('admin', 'superadmin'), async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ 
        message: 'Database not connected',
        readyState: mongoose.connection.readyState
      });
    }

    // Kullanıcı zaten var mı kontrol et
    const existingUser = await User.findOne({ email: 'amina.benali@prestalink.app' });
    
    const userData = {
      name: 'Amina Benali',
      email: 'amina.benali@prestalink.app',
      password: 'amina2024',
      phone: '+213555123456',
      role: 'user',
      roles: ['user'],
      activeRole: 'user',
      gender: 'female',
      country: 'Algeria',
      city: 'Algiers',
      languages: ['AR', 'FR', 'EN'],
      experienceLevel: '3-5 years',
      profession: 'Textile Worker',
      bio: 'Experienced textile worker with 4 years of hands-on experience in garment manufacturing and quality control. Proven track record in operating industrial sewing machines, maintaining production standards, and ensuring quality compliance. Strong attention to detail, excellent time management skills, and ability to work efficiently in fast-paced production environments. Seeking opportunities in Europe to advance career and contribute to international manufacturing teams.',
      profilePhoto: 'https://i.pravatar.cc/400?img=47',
      cvUrl: '/uploads/cvs/amina_benali_cv.pdf',
      cvContent: `AMINA BENALI
Algiers, Algeria
Phone: +213 555 123 456
Email: amina.benali@prestalink.app

PROFESSIONAL SUMMARY
Experienced textile worker with 4 years of hands-on experience in garment manufacturing and quality control. Proven track record in operating industrial sewing machines, maintaining production standards, and ensuring quality compliance. Strong attention to detail, excellent time management skills, and ability to work efficiently in fast-paced production environments. Seeking opportunities in Europe to advance career and contribute to international manufacturing teams.

WORK EXPERIENCE
Textile Production Specialist | Algerian Textiles Co. | 2022 - Present
- Operated industrial sewing machines for garment assembly
- Performed quality checks on finished products to ensure compliance
- Managed raw material inventory and ensured timely supply to production lines
- Collaborated with design team to implement new product specifications

Quality Control Assistant | North Africa Garments | 2020 - 2022
- Inspected fabrics and garments for defects and adherence to quality standards
- Documented inspection results and reported non-conformities
- Assisted in training new production staff on quality procedures

EDUCATION
High School Diploma | Lycée Emir Abdelkader, Algiers | 2019

CERTIFICATIONS
- Industrial Safety Certificate (2023)
- Textile Manufacturing Training Certificate (2022)
- Quality Control Certification (2021)

SKILLS
- Industrial Sewing Machine Operation
- Quality Control & Assurance
- Garment Manufacturing
- Production Line Management
- Fabric Inspection
- Attention to Detail
- Time Management
- Teamwork

LANGUAGES
Arabic (Native), French (Fluent), English (Intermediate)`,
      certificates: [
        'Industrial Safety Certificate (2023)',
        'Textile Manufacturing Training Certificate (2022)',
        'Quality Control Certification (2021)',
      ],
    };

    let user;
    if (existingUser) {
      // Update existing user
      Object.assign(existingUser, userData);
      await existingUser.save();
      user = existingUser;
    } else {
      // Create new user
      user = await User.create(userData);
    }

    res.json({
      success: true,
      message: existingUser ? 'User updated successfully' : 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        country: user.country,
        city: user.city,
        profession: user.profession,
      },
    });
  } catch (error) {
    console.error('Error creating Algerian user:', error);
    res.status(500).json({
      message: 'Failed to create/update user',
      error: error.message,
    });
  }
});

module.exports = router;
