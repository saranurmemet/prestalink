require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Notification = require('../models/Notification');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Kapsamlı kullanıcı profilleri
const userProfiles = {
  'mehmet@prestalink.app': {
    name: 'Mehmet Demir',
    gender: 'male',
    bio: 'Experienced Quality Control Specialist with 6+ years in automotive and precision manufacturing. CNC operator certified with expertise in metrology, inspection systems, and ISO 9001 standards. Fluent in Turkish, English, French and Arabic. Seeking opportunities in Europe for career advancement.',
    languages: ['TR', 'EN', 'FR', 'AR'],
    country: 'Turkey',
    city: 'Istanbul',
    experienceLevel: '5+ years',
    profession: 'Quality Control Specialist',
    certificates: [
      'ISO 9001:2015 Quality Management Systems (TÜV SÜD, 2023)',
      'CNC Programming & Operation Certificate (TOBB ETU, 2022)',
      'Coordinate Measuring Machine (CMM) Training (Zeiss Academy, 2022)',
      'Six Sigma Green Belt Certification (ASQ, 2021)',
      'Advanced Manufacturing Techniques (Siemens Technical Academy, 2021)',
      'Occupational Health & Safety Training (Ministry of Labor, 2023)'
    ],
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
    name: 'Ahmet Yılmaz',
    gender: 'male',
    bio: 'Software Engineer with 5 years of experience in full-stack development. Specialized in React, Node.js, and cloud technologies. Passionate about building scalable applications and working in international teams. Looking for opportunities in European tech companies.',
    languages: ['TR', 'EN', 'DE'],
    country: 'Turkey',
    city: 'Ankara',
    experienceLevel: '3-5 years',
    profession: 'Software Engineer',
    certificates: [
      'AWS Certified Solutions Architect (2023)',
      'React Advanced Patterns Certification (2022)',
      'Node.js Backend Development Certificate (2021)',
      'MongoDB Certified Developer (2021)',
      'Docker & Kubernetes Fundamentals (2022)',
      'Agile & Scrum Master Certification (2020)'
    ],
    cvContent: `AHMET YILMAZ
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
    name: 'Sara Kaya',
    gender: 'female',
    bio: 'Experienced Nurse with 4 years in intensive care and emergency departments. Certified in BLS, ACLS, and PALS. Fluent in French and Arabic. Dedicated to providing high-quality patient care. Looking for opportunities in European healthcare facilities.',
    languages: ['FR', 'AR', 'EN', 'TR'],
    country: 'Algeria',
    city: 'Algiers',
    experienceLevel: '3-5 years',
    profession: 'Registered Nurse',
    certificates: [
      'BLS (Basic Life Support) Certification (2023)',
      'ACLS (Advanced Cardiac Life Support) Certification (2023)',
      'PALS (Pediatric Advanced Life Support) Certification (2022)',
      'Critical Care Nursing Certificate (2021)',
      'Emergency Nursing Certification (2020)',
      'Infection Control & Prevention Training (2023)'
    ],
    cvContent: `SARA KAYA
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
    name: 'Sarad Admin',
    gender: 'female',
    bio: 'HR Professional with 7 years of experience in recruitment and talent acquisition. Specialized in international recruitment, especially for European markets. Expert in employer branding, candidate sourcing, and talent management. Fluent in French, Arabic, and English.',
    languages: ['FR', 'AR', 'EN', 'TR'],
    country: 'Algeria',
    city: 'Oran',
    experienceLevel: '5+ years',
    profession: 'HR & Recruitment Specialist',
    certificates: [
      'SHRM Certified Professional (SHRM-CP) (2023)',
      'Talent Acquisition Specialist Certification (2022)',
      'HR Analytics & Data-Driven Recruitment (2022)',
      'Employer Branding Certificate (2021)',
      'International Recruitment Strategies (2021)',
      'LinkedIn Recruiter Certification (2020)'
    ],
    cvContent: `SARAD ADMIN
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

// İş ilanları (farklı roller için)
const jobListings = [
  {
    title: 'Senior Quality Control Engineer',
    description: 'We are seeking an experienced Quality Control Engineer to join our manufacturing team. The ideal candidate will have expertise in ISO 9001, CMM operations, and quality management systems.',
    salary: '€3,500 - €4,500/month',
    location: 'Berlin, Germany',
    requiredExperience: '5+ years',
    requiredLanguage: 'English, German',
    workType: 'full-time',
    employerEmail: 'sarad@prestalink.app' // Sarad recruiter olarak
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
    employerEmail: 'ahmet@prestalink.app' // Ahmet recruiter olarak
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
  }
];

async function createComprehensiveProfiles() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    log('✅ MongoDB bağlandı\n', 'green');

    log('═══════════════════════════════════════════════════════', 'cyan');
    log('👥 KAPSAMLI PROFİL OLUŞTURMA', 'cyan');
    log('═══════════════════════════════════════════════════════\n', 'cyan');

    // 1. Kullanıcı profillerini güncelle
    log('📝 1. Kullanıcı Profilleri Güncelleniyor...\n', 'yellow');
    
    const users = await User.find({
      email: { $in: Object.keys(userProfiles) }
    });

    for (const user of users) {
      const profile = userProfiles[user.email];
      if (!profile) continue;

      log(`   👤 ${user.name} profili güncelleniyor...`, 'cyan');

      // Profil bilgilerini güncelle
      user.bio = profile.bio;
      user.languages = profile.languages;
      user.country = profile.country;
      user.city = profile.city;
      user.experienceLevel = profile.experienceLevel;
      user.certificates = profile.certificates;

      // Profil fotoğrafı (Mehmet hariç)
      if (user.email !== 'mehmet@prestalink.app') {
        const photoName = user.email.split('@')[0];
        user.profilePhoto = `/uploads/profilePhotos/${photoName}.png`;
      }

      // CV URL (simüle edilmiş)
      user.cvUrl = `/uploads/cvs/${user.email.split('@')[0]}_cv.pdf`;

      await user.save();
      log(`      ✅ Profil güncellendi`, 'green');
      log(`      📸 Fotoğraf: ${user.profilePhoto || 'Mevcut'}`, 'blue');
      log(`      📄 CV: ${user.cvUrl}`, 'blue');
      log(`      🏷️  Meslek: ${profile.profession}`, 'blue');
      log(`      📜 Sertifikalar: ${profile.certificates.length} adet\n`, 'blue');
    }

    // 2. İş ilanları oluştur
    log('📋 2. İş İlanları Oluşturuluyor...\n', 'yellow');

    const employerMap = {};
    for (const user of users) {
      employerMap[user.email] = user._id;
    }

    const createdJobs = [];
    for (const jobData of jobListings) {
      const employerId = employerMap[jobData.employerEmail];
      if (!employerId) continue;

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
      log(`   ✅ ${job.title} - ${job.location}`, 'green');
    }

    log(`\n   📊 Toplam ${createdJobs.length} iş ilanı oluşturuldu\n`, 'cyan');

    // 3. Başvurular oluştur
    log('📝 3. İş Başvuruları Oluşturuluyor...\n', 'yellow');

    const candidateUsers = users.filter(u => 
      u.email === 'mehmet@prestalink.app' || 
      u.email === 'ahmet@prestalink.app' || 
      u.email === 'sara@prestalink.app'
    );

    const applicationStatuses = ['pending', 'reviewing', 'viewed', 'interview', 'accepted'];
    let applicationCount = 0;

    for (const candidate of candidateUsers) {
      // Her aday için 2-3 başvuru
      const jobsToApply = createdJobs.slice(0, 3);
      
      for (let i = 0; i < jobsToApply.length; i++) {
        const job = jobsToApply[i];
        const status = applicationStatuses[i % applicationStatuses.length];

        await Application.create({
          userId: candidate._id,
          jobId: job._id,
          cvUrl: candidate.cvUrl,
          certificates: candidate.certificates || [],
          status: status,
          messages: []
        });

        applicationCount++;
        log(`   ✅ ${candidate.name} → ${job.title} (${status})`, 'green');
      }
    }

    log(`\n   📊 Toplam ${applicationCount} başvuru oluşturuldu\n`, 'cyan');

    // 4. Bildirimler oluştur
    log('🔔 4. Bildirimler Oluşturuluyor...\n', 'yellow');

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
        message: 'Congratulations! Your interview for Quality Assurance Manager is scheduled for next week.',
        read: false
      },
      // Ahmet için
      {
        targetUserId: employerMap['ahmet@prestalink.app'],
        title: 'New Job Match',
        message: 'We found 3 new job opportunities matching your profile as a Software Engineer.',
        read: false
      },
      {
        targetUserId: employerMap['ahmet@prestalink.app'],
        title: 'Application Status Update',
        message: 'Your application for Full-Stack Software Developer has moved to the interview stage.',
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
        read: true
      }
    ];

    for (const notif of notifications) {
      await Notification.create(notif);
    }

    log(`   ✅ ${notifications.length} bildirim oluşturuldu\n`, 'green');

    // Özet
    log('═══════════════════════════════════════════════════════', 'cyan');
    log('✅ TÜM PROFİLLER OLUŞTURULDU!', 'green');
    log('═══════════════════════════════════════════════════════\n', 'cyan');

    log('📊 ÖZET:', 'yellow');
    log(`   👥 Profil Güncellenen Kullanıcı: ${users.length}`, 'cyan');
    log(`   📋 Oluşturulan İş İlanı: ${createdJobs.length}`, 'cyan');
    log(`   📝 Oluşturulan Başvuru: ${applicationCount}`, 'cyan');
    log(`   🔔 Oluşturulan Bildirim: ${notifications.length}\n`, 'cyan');

    await mongoose.disconnect();
    log('✅ İşlem tamamlandı!', 'green');
  } catch (error) {
    log(`\n❌ Hata: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

createComprehensiveProfiles();




