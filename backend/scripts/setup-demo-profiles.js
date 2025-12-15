/**
 * ⚠️ ÖNEMLİ: PROFİL FOTOĞRAFLARI KİLİTLİDİR
 * 
 * Bu dosyadaki profil fotoğrafı URL'leri DEĞİŞTİRİLEMEZ.
 * Profil fotoğrafları demo kullanıcıları için kritik öneme sahiptir.
 * 
 * Profil fotoğraflarını geri getirmek için:
 *   npm run lock-photos
 * veya
 *   node scripts/lock-profile-photos.js
 * 
 * Detaylar için: backend/scripts/README_PROFILE_PHOTOS.md
 */

require('dotenv').config();
const mongoose = require('mongoose');
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

// 4 Demo Kullanıcı Profilleri
const demoUsers = {
  'mehmet@prestalink.app': {
    name: 'Mehmet Demir',
    gender: 'male',
    phone: '+905551234567',
    bio: 'Experienced Quality Control Specialist with 6+ years in automotive and precision manufacturing. CNC operator certified with expertise in metrology, inspection systems, and ISO 9001 standards. Fluent in Turkish, English, French and Arabic. Seeking opportunities in Europe for career advancement.',
    languages: ['TR', 'EN', 'FR', 'AR'],
    country: 'Turkey',
    city: 'Istanbul',
    experienceLevel: '5+ years',
    profession: 'Quality Control Specialist',
    profilePhoto: '/uploads/profile-photos/mehmet.png',
    certificates: [
      'ISO 9001:2015 Quality Management Systems (TÜV SÜD, 2023)',
      'CNC Programming & Operation Certificate (TOBB ETU, 2022)',
      'Coordinate Measuring Machine (CMM) Training (Zeiss Academy, 2022)',
      'Six Sigma Green Belt Certification (ASQ, 2021)',
      'Advanced Manufacturing Techniques (Siemens Technical Academy, 2021)',
      'Occupational Health & Safety Training (Ministry of Labor, 2023)'
    ],
    cvUrl: '/uploads/cvs/mehmet_demir_cv.pdf',
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
- Managed quality audits and compliance documentation

Quality Inspector | XYZ Industries | 2017 - 2019
- Performed dimensional inspections using CMM equipment
- Maintained quality documentation and reports
- Collaborated with production teams to resolve quality issues
- Achieved 99.8% quality compliance rate

EDUCATION
Bachelor of Mechanical Engineering | Istanbul Technical University | 2016
- Specialization in Manufacturing Engineering
- Graduated with honors (GPA: 3.8/4.0)

TECHNICAL SKILLS
- Quality Control & Assurance
- CNC Programming & Operation (Siemens, Fanuc)
- CMM Operation (Zeiss, Mitutoyo)
- ISO 9001 Implementation & Auditing
- Six Sigma Methodologies (Green Belt)
- Metrology & Precision Measurement
- Statistical Process Control (SPC)
- Root Cause Analysis & Problem Solving
- CAD/CAM Software (SolidWorks, Mastercam)

CERTIFICATIONS
- ISO 9001:2015 Quality Management Systems (TÜV SÜD, 2023)
- CNC Programming & Operation Certificate (TOBB ETU, 2022)
- Coordinate Measuring Machine (CMM) Training (Zeiss Academy, 2022)
- Six Sigma Green Belt Certification (ASQ, 2021)
- Advanced Manufacturing Techniques (Siemens Technical Academy, 2021)
- Occupational Health & Safety Training (Ministry of Labor, 2023)

LANGUAGES
- Turkish (Native)
- English (Fluent - C1)
- French (Fluent - B2)
- Arabic (Conversational - B1)

REFERENCES
Available upon request.`
  },
  'ahmet@prestalink.app': {
    name: 'Ahmet Suriye',
    gender: 'male',
    phone: '+905559876543',
    bio: 'Software Engineer with 5 years of experience in full-stack development. Specialized in React, Node.js, and cloud technologies. Passionate about building scalable applications and working in international teams. Looking for opportunities in European tech companies.',
    languages: ['TR', 'EN', 'DE'],
    country: 'Turkey',
    city: 'Ankara',
    experienceLevel: '3-5 years',
    profession: 'Software Engineer',
    profilePhoto: '/uploads/profile-photos/ahmet.png',
    certificates: [
      'AWS Certified Solutions Architect (2023)',
      'React Advanced Patterns Certification (2022)',
      'Node.js Backend Development Certificate (2021)',
      'MongoDB Certified Developer (2021)',
      'Docker & Kubernetes Fundamentals (2022)',
      'Agile & Scrum Master Certification (2020)'
    ],
    cvUrl: '/uploads/cvs/ahmet_suriye_cv.pdf',
    cvContent: `AHMET SURIYE
Software Engineer

PROFESSIONAL SUMMARY
Full-stack Software Engineer with 5 years of experience building scalable web applications. Expert in React, Node.js, and cloud technologies. Passionate about clean code, best practices, and continuous learning. Proven track record of delivering high-quality software solutions.

WORK EXPERIENCE
Senior Software Engineer | TechCorp Solutions | 2021 - Present
- Developed and maintained microservices architecture using Node.js and Express
- Built responsive frontend applications with React, TypeScript, and Next.js
- Reduced API response time by 40% through optimization and caching strategies
- Led team of 3 junior developers, conducting code reviews and mentoring
- Implemented CI/CD pipelines using Jenkins and Docker
- Collaborated with product managers and designers in agile environment

Software Developer | StartupXYZ | 2019 - 2021
- Developed RESTful APIs using Express.js and MongoDB
- Implemented real-time features using WebSockets and Socket.io
- Built admin dashboard with React and Redux for state management
- Optimized database queries, reducing load time by 50%
- Participated in daily standups and sprint planning meetings

EDUCATION
Bachelor of Computer Science | Middle East Technical University | 2019
- Specialization in Software Engineering
- Relevant coursework: Data Structures, Algorithms, Database Systems, Web Development

TECHNICAL SKILLS
Frontend:
- React, TypeScript, Next.js, Redux, Zustand
- Tailwind CSS, Material-UI, Styled Components
- React Query, Axios, WebSocket

Backend:
- Node.js, Express, NestJS
- REST APIs, GraphQL
- JWT Authentication, OAuth 2.0

Databases:
- MongoDB, PostgreSQL, Redis
- Mongoose, Prisma ORM

Cloud & DevOps:
- AWS (EC2, S3, Lambda, RDS)
- Docker, Kubernetes
- CI/CD (Jenkins, GitHub Actions)

Tools:
- Git, GitHub, Jira, Postman
- VS Code, WebStorm

CERTIFICATIONS
- AWS Certified Solutions Architect (2023)
- React Advanced Patterns Certification (2022)
- Node.js Backend Development Certificate (2021)
- MongoDB Certified Developer (2021)
- Docker & Kubernetes Fundamentals (2022)
- Agile & Scrum Master Certification (2020)

PROJECTS
- E-commerce Platform: Built full-stack application serving 10K+ users
- Real-time Chat Application: Implemented using WebSockets and Redis
- API Gateway: Designed microservices architecture with load balancing

LANGUAGES
- Turkish (Native)
- English (Fluent - C1)
- German (Intermediate - B1)

REFERENCES
Available upon request.`
  },
  'sara@prestalink.app': {
    name: 'Sara Soley',
    gender: 'female',
    phone: '+213555123456',
    bio: 'Experienced Nurse with 4 years in intensive care and emergency departments. Certified in BLS, ACLS, and PALS. Fluent in French and Arabic. Dedicated to providing high-quality patient care. Looking for opportunities in European healthcare facilities.',
    languages: ['FR', 'AR', 'EN', 'TR'],
    country: 'Algeria',
    city: 'Algiers',
    experienceLevel: '3-5 years',
    profession: 'Registered Nurse',
    profilePhoto: '/uploads/profile-photos/sara.png',
    certificates: [
      'BLS (Basic Life Support) Certification (2023)',
      'ACLS (Advanced Cardiac Life Support) Certification (2023)',
      'PALS (Pediatric Advanced Life Support) Certification (2022)',
      'Critical Care Nursing Certificate (2021)',
      'Emergency Nursing Certification (2020)',
      'Infection Control & Prevention Training (2023)'
    ],
    cvUrl: '/uploads/cvs/sara_soley_cv.pdf',
    cvContent: `SARA SOLEY
Registered Nurse

PROFESSIONAL SUMMARY
Dedicated Registered Nurse with 4 years of experience in intensive care and emergency departments. Certified in BLS, ACLS, and PALS. Fluent in French, Arabic, English, and Turkish. Committed to providing compassionate, high-quality patient care in fast-paced healthcare environments.

WORK EXPERIENCE
ICU Nurse | Algiers Medical Center | 2021 - Present
- Provided critical care to patients in intensive care unit
- Monitored vital signs, administered medications, and managed ventilators
- Collaborated with multidisciplinary healthcare teams including doctors, respiratory therapists, and pharmacists
- Trained 5 new nurses on ICU protocols and best practices
- Maintained accurate patient records and documentation
- Responded to medical emergencies and code blue situations

Emergency Department Nurse | City Hospital | 2019 - 2021
- Treated patients in emergency situations with various medical conditions
- Performed triage and initial patient assessments
- Assisted in emergency procedures and surgeries
- Administered medications and IV therapies
- Maintained accurate patient records and communicated with families
- Worked in high-stress, fast-paced environment

EDUCATION
Bachelor of Nursing | University of Algiers | 2019
- Specialization in Critical Care Nursing
- Clinical rotations in ICU, ER, and Medical-Surgical units
- Graduated with distinction

CLINICAL SKILLS
- Critical Care Nursing
- Emergency Response & Triage
- Patient Assessment & Monitoring
- Medication Administration (IV, IM, PO)
- Wound Care & Dressing Changes
- Ventilator Management
- Central Line Care
- Patient Education & Discharge Planning
- Electronic Health Records (EHR) Systems

CERTIFICATIONS
- BLS (Basic Life Support) - Current (2023)
- ACLS (Advanced Cardiac Life Support) - Current (2023)
- PALS (Pediatric Advanced Life Support) - Current (2022)
- Critical Care Nursing Certificate (2021)
- Emergency Nursing Certification (2020)
- Infection Control & Prevention Training (2023)

CONTINUING EDUCATION
- Advanced Cardiac Life Support Updates (2023)
- Pediatric Emergency Care (2022)
- Pain Management in Critical Care (2021)

LANGUAGES
- French (Native)
- Arabic (Native)
- English (Fluent - B2)
- Turkish (Conversational - A2)

REFERENCES
Available upon request.`
  },
  'sarad@prestalink.app': {
    name: 'Sarad Kaşgarlı',
    gender: 'female',
    phone: '+213555987654',
    bio: 'HR Professional with 7 years of experience in recruitment and talent acquisition. Specialized in international recruitment, especially for European markets. Expert in employer branding, candidate sourcing, and talent management. Fluent in French, Arabic, and English.',
    languages: ['FR', 'AR', 'EN', 'TR'],
    country: 'Algeria',
    city: 'Oran',
    experienceLevel: '5+ years',
    profession: 'HR & Recruitment Specialist',
    profilePhoto: '/uploads/profile-photos/sarad.png',
    certificates: [
      'SHRM Certified Professional (SHRM-CP) (2023)',
      'Talent Acquisition Specialist Certification (2022)',
      'HR Analytics & Data-Driven Recruitment (2022)',
      'Employer Branding Certificate (2021)',
      'International Recruitment Strategies (2021)',
      'LinkedIn Recruiter Certification (2020)'
    ],
    cvUrl: '/uploads/cvs/sarad_kasgarli_cv.pdf',
    cvContent: `SARAD KAŞGARLI
HR & Recruitment Specialist

PROFESSIONAL SUMMARY
Strategic HR Professional with 7 years of experience in recruitment and talent acquisition. Specialized in international recruitment for European markets. Expert in employer branding, candidate sourcing, and building high-performing teams. Proven track record of reducing time-to-hire and improving candidate experience.

WORK EXPERIENCE
Senior Recruitment Specialist | Global Talent Solutions | 2020 - Present
- Managed end-to-end recruitment process for 200+ positions annually
- Developed and executed recruitment strategies for European markets (Germany, France, Netherlands)
- Reduced time-to-hire by 30% through process optimization and automation
- Built strong talent pipelines using LinkedIn, job boards, and professional networking
- Collaborated with hiring managers to define job requirements and candidate profiles
- Conducted interviews and assessments for senior-level positions
- Implemented ATS (Applicant Tracking System) and improved recruitment metrics
- Organized recruitment events and job fairs in multiple countries

HR Coordinator | International HR Services | 2017 - 2020
- Sourced and screened candidates for various positions across different industries
- Conducted phone and video interviews with international candidates
- Coordinated hiring processes and managed candidate communication
- Maintained applicant tracking system (ATS) and recruitment databases
- Organized recruitment events and job fairs
- Assisted in onboarding new employees
- Prepared recruitment reports and analytics

EDUCATION
Master of Human Resources Management | University of Oran | 2017
- Specialization in International HR and Talent Management
- Thesis: "Cross-Cultural Recruitment Strategies for European Markets"

Bachelor of Business Administration | University of Oran | 2015
- Major in Human Resources
- Minor in International Business

CORE COMPETENCIES
- Talent Acquisition & Sourcing
- Interviewing & Assessment Techniques
- Employer Branding & Value Proposition
- ATS Management (Greenhouse, Lever, Workday, BambooHR)
- LinkedIn Recruiter & Social Recruiting
- HR Analytics & Data-Driven Decision Making
- Candidate Relationship Management (CRM)
- International Recruitment & Visa Processes
- Cross-Cultural Communication
- Negotiation & Offer Management

CERTIFICATIONS
- SHRM Certified Professional (SHRM-CP) (2023)
- Talent Acquisition Specialist Certification (2022)
- HR Analytics & Data-Driven Recruitment (2022)
- Employer Branding Certificate (2021)
- International Recruitment Strategies (2021)
- LinkedIn Recruiter Certification (2020)

KEY ACHIEVEMENTS
- Successfully recruited 500+ candidates for European positions
- Reduced time-to-fill by 25% through process improvements
- Built network of 2000+ qualified candidates across Europe
- Improved candidate satisfaction score from 3.5 to 4.7/5.0
- Organized 15+ successful recruitment events

LANGUAGES
- French (Native)
- Arabic (Native)
- English (Fluent - C1)
- Turkish (Conversational - B1)

REFERENCES
Available upon request.`
  }
};

// İş İlanları (Demo için)
const demoJobs = [
  {
    title: 'Senior Quality Control Engineer',
    description: 'We are seeking an experienced Quality Control Engineer to join our manufacturing team in Berlin. The ideal candidate will have expertise in ISO 9001, CMM operations, and quality management systems. You will lead quality inspection teams and implement quality improvement initiatives.',
    salary: '€3,500 - €4,500/month',
    location: 'Berlin, Germany',
    requiredExperience: '5+ years',
    requiredLanguage: 'English, German',
    workType: 'full-time',
    employerEmail: 'sarad@prestalink.app'
  },
  {
    title: 'Full-Stack Software Developer',
    description: 'Join our dynamic tech team in Amsterdam! We are looking for a skilled full-stack developer with experience in React and Node.js. You will work on building scalable web applications and collaborate with international teams. Remote work options available.',
    salary: '€4,000 - €5,500/month',
    location: 'Amsterdam, Netherlands',
    requiredExperience: '3-5 years',
    requiredLanguage: 'English',
    workType: 'full-time',
    employerEmail: 'sarad@prestalink.app'
  },
  {
    title: 'ICU Registered Nurse',
    description: 'Urgent need for experienced ICU nurses in Paris. Must have BLS, ACLS certifications. You will provide critical care to patients in our state-of-the-art intensive care unit. Competitive salary and benefits package. Relocation assistance available.',
    salary: '€3,200 - €4,000/month',
    location: 'Paris, France',
    requiredExperience: '3+ years',
    requiredLanguage: 'French, English',
    workType: 'full-time',
    employerEmail: 'sarad@prestalink.app'
  },
  {
    title: 'Quality Assurance Manager',
    description: 'Lead our quality assurance team in Munich. Must have strong background in manufacturing quality control, ISO standards, and team management. You will be responsible for maintaining quality standards across all production lines.',
    salary: '€4,500 - €6,000/month',
    location: 'Munich, Germany',
    requiredExperience: '7+ years',
    requiredLanguage: 'English, German',
    workType: 'full-time',
    employerEmail: 'ahmet@prestalink.app'
  },
  {
    title: 'Frontend React Developer',
    description: 'Looking for a talented React developer to join our frontend team in Barcelona. Experience with TypeScript and modern React patterns required. You will work on building user-friendly interfaces for our SaaS platform.',
    salary: '€3,500 - €4,800/month',
    location: 'Barcelona, Spain',
    requiredExperience: '2-4 years',
    requiredLanguage: 'English, Spanish',
    workType: 'full-time',
    employerEmail: 'ahmet@prestalink.app'
  },
  {
    title: 'Emergency Department Nurse',
    description: 'Join our emergency department team in Lyon. We need experienced nurses who can handle high-pressure situations. BLS and ACLS certifications required. Fast-paced environment with excellent learning opportunities.',
    salary: '€3,000 - €3,800/month',
    location: 'Lyon, France',
    requiredExperience: '2+ years',
    requiredLanguage: 'French, English',
    workType: 'full-time',
    employerEmail: 'ahmet@prestalink.app'
  },
  {
    title: 'CNC Machinist',
    description: 'Experienced CNC machinist needed for precision manufacturing in Stuttgart. Must have experience with Siemens and Fanuc controls. Competitive salary and opportunities for career growth.',
    salary: '€3,200 - €4,200/month',
    location: 'Stuttgart, Germany',
    requiredExperience: '4+ years',
    requiredLanguage: 'German, English',
    workType: 'full-time',
    employerEmail: 'sarad@prestalink.app'
  },
  {
    title: 'Backend Node.js Developer',
    description: 'We are expanding our backend team and looking for an experienced Node.js developer. You will work on building microservices architecture and RESTful APIs. Experience with MongoDB and Docker preferred.',
    salary: '€4,200 - €5,800/month',
    location: 'Zurich, Switzerland',
    requiredExperience: '4+ years',
    requiredLanguage: 'English',
    workType: 'full-time',
    employerEmail: 'sarad@prestalink.app'
  },
  // Mavi Yaka İş İlanları - Üretim ve İmalat
  {
    title: 'CNC Operatörü - Otomotiv Sektörü',
    description: `AutoTech Manufacturing GmbH, Almanya'nın önde gelen otomotiv yan sanayi firmalarından biridir. 25 yıllık deneyimimizle BMW, Mercedes-Benz ve Volkswagen gibi prestijli markalara yüksek kaliteli parça üretimi yapmaktayız.

Şirketimiz hakkında:
- 1998 yılında kurulmuş, 500+ çalışanı olan köklü bir firmayız
- ISO 9001:2015 ve IATF 16949 kalite sertifikalarına sahibiz
- Modern CNC makineleri ve son teknoloji üretim hatlarımız bulunmaktadır
- Çalışanlarımıza sürekli eğitim ve kariyer gelişim fırsatları sunuyoruz
- Sosyal haklar, sağlık sigortası ve emeklilik planları mevcuttur

İş Tanımı:
- CNC torna ve freze tezgahlarında parça üretimi yapmak
- Program okuma, makine ayarları ve kalite kontrol işlemlerini gerçekleştirmek
- Üretim planlamasına uygun çalışmak ve hedefleri karşılamak
- Makine bakım ve temizlik işlemlerini yapmak
- Kalite standartlarına uygun üretim yapmak

Aradığımız Özellikler:
- CNC operatörlüğü deneyimi (minimum 2 yıl)
- Teknik çizim okuma bilgisi
- Ölçü aletleri kullanımı (kumpas, mikrometre)
- Takım tezgahı bilgisi ve güvenlik kurallarına uyum
- Ekip çalışmasına yatkınlık

Çalışma Koşulları:
- Vardiyalı çalışma sistemi (sabah/akşam vardiyası)
- Haftalık 40 saat çalışma
- Fazla mesai imkanları
- İlk 3 ay deneme süresi`,
    salary: '€2,800 - €3,500/month',
    location: 'Stuttgart, Germany',
    requiredExperience: '2+ years',
    requiredLanguage: 'German, Turkish, English',
    workType: 'full-time',
    employerEmail: 'sarad@prestalink.app'
  },
  {
    title: 'Kaynakçı - İnşaat ve Metal İşleri',
    description: `SteelWorks Construction Ltd., Avrupa'nın önde gelen çelik yapı ve inşaat firmalarından biridir. 30 yıldır Almanya, Fransa ve Hollanda'da büyük ölçekli projelerde yer almaktayız.

Şirketimiz hakkında:
- 1993 yılında kurulmuş, 800+ çalışanı olan uluslararası bir firmayız
- Köprüler, endüstriyel tesisler ve yüksek yapılarda uzmanız
- EN 1090 ve DIN 18800 standartlarına uygun üretim yapmaktayız
- Modern kaynak ekipmanları ve robotik kaynak sistemlerimiz mevcuttur
- Güvenlik öncelikli çalışma kültürümüz vardır
- Çalışanlarımıza konut desteği ve dil eğitimi imkanları sunuyoruz

İş Tanımı:
- Çelik yapı elemanlarının kaynak işlemlerini gerçekleştirmek
- TIG, MIG ve elektrot kaynağı tekniklerini kullanmak
- Kaynak kalitesini kontrol etmek ve test işlemlerini yapmak
- İş güvenliği kurallarına tam uyum sağlamak
- Proje planlamasına uygun çalışmak

Aradığımız Özellikler:
- Kaynakçılık sertifikası (EN 1090, DIN 18800)
- Minimum 3 yıl kaynakçılık deneyimi
- Çelik yapı ve inşaat sektörü bilgisi
- Fiziksel dayanıklılık ve yüksekte çalışma uygunluğu
- Ekip çalışması ve sorumluluk bilinci

Çalışma Koşulları:
- Şantiye ortamında çalışma
- Haftalık 40-45 saat çalışma
- Fazla mesai ve hafta sonu çalışma imkanları
- İş güvenliği ekipmanları sağlanmaktadır`,
    salary: '€3,000 - €3,800/month',
    location: 'Frankfurt, Germany',
    requiredExperience: '3+ years',
    requiredLanguage: 'German, Turkish',
    workType: 'full-time',
    employerEmail: 'sarad@prestalink.app'
  },
  {
    title: 'Montaj İşçisi - Elektronik Üretim',
    description: `TechAssemble Solutions B.V., Hollanda'nın önde gelen elektronik montaj ve üretim firmalarından biridir. Medikal cihazlar, otomotiv elektroniği ve endüstriyel kontrol sistemleri üretmekteyiz.

Şirketimiz hakkında:
- 2005 yılında kurulmuş, 350+ çalışanı olan modern bir üretim tesisidir
- ISO 13485 (Medikal Cihazlar) ve ISO/TS 16949 (Otomotiv) sertifikalarına sahibiz
- Temiz oda (clean room) üretim alanlarımız bulunmaktadır
- Sürekli gelişim ve kalite iyileştirme programlarımız vardır
- Çalışanlarımıza teknik eğitim ve sertifikasyon imkanları sunuyoruz
- Modern çalışma ortamı ve sosyal tesislerimiz mevcuttur

İş Tanımı:
- Elektronik kart ve modül montajı yapmak
- Hassas elektronik bileşenlerin yerleştirilmesi (SMD, THT)
- Lehimleme ve test işlemlerini gerçekleştirmek
- Kalite kontrol ve hata tespiti yapmak
- Üretim dokümantasyonunu doldurmak
- Temiz oda protokollerine uyum sağlamak

Aradığımız Özellikler:
- Elektronik montaj deneyimi (tercihen medikal veya otomotiv)
- İnce motor becerileri ve dikkat
- ESD (Elektrostatik Deşarj) bilgisi
- Kalite odaklı çalışma anlayışı
- Temiz oda çalışma deneyimi (tercih)

Çalışma Koşulları:
- Temiz oda ortamında çalışma
- Haftalık 38 saat çalışma (Hollanda standartları)
- Vardiyalı çalışma sistemi
- İş güvenliği ve sağlık kontrolleri düzenli yapılmaktadır`,
    salary: '€2,500 - €3,200/month',
    location: 'Eindhoven, Netherlands',
    requiredExperience: '1+ years',
    requiredLanguage: 'English, Dutch (tercih)',
    workType: 'full-time',
    employerEmail: 'ahmet@prestalink.app'
  },
  {
    title: 'Forklift Operatörü - Lojistik ve Depo',
    description: `LogiFlow Distribution GmbH, Almanya'nın önde gelen lojistik ve depolama firmalarından biridir. E-ticaret, perakende ve endüstriyel sektörlere hizmet vermekteyiz.

Şirketimiz hakkında:
- 2010 yılında kurulmuş, hızlı büyüyen bir lojistik firmasıyız
- 15,000 m² kapalı depo alanımız ve modern forklift filosu mevcuttur
- WMS (Warehouse Management System) ile dijital yönetim yapmaktayız
- 7/24 çalışma sistemi ile hızlı teslimat garantisi sunuyoruz
- Çalışanlarımıza forklift operatörlüğü eğitimi ve sertifikasyon imkanı sağlıyoruz
- Kariyer gelişim programları ve terfi fırsatları mevcuttur

İş Tanımı:
- Forklift ile yük taşıma ve yerleştirme işlemleri yapmak
- Depo içi malzeme hareketlerini gerçekleştirmek
- Stok sayım ve envanter kontrol işlemlerine katılmak
- Yükleme-boşaltma işlemlerini yapmak
- Depo düzeni ve güvenliğini sağlamak
- WMS sistemini kullanarak işlem kayıtları tutmak

Aradığımız Özellikler:
- Forklift operatörlüğü sertifikası (Staplerführerschein)
- Minimum 1 yıl forklift operatörlüğü deneyimi
- Depo ve lojistik sektörü bilgisi
- Dikkatli ve sorumlu çalışma anlayışı
- Fiziksel dayanıklılık

Çalışma Koşulları:
- Vardiyalı çalışma (sabah/akşam/gece vardiyası)
- Haftalık 40 saat çalışma
- Fazla mesai imkanları
- İş güvenliği ekipmanları sağlanmaktadır`,
    salary: '€2,400 - €3,000/month',
    location: 'Düsseldorf, Germany',
    requiredExperience: '1+ years',
    requiredLanguage: 'German, Turkish',
    workType: 'full-time',
    employerEmail: 'sarad@prestalink.app'
  },
  {
    title: 'Gıda Üretim İşçisi - Gıda İşleme',
    description: `FreshFood Processing S.A., Fransa'nın önde gelen gıda işleme ve paketleme firmalarından biridir. Taze meyve-sebze, hazır yemek ve dondurulmuş gıda üretimi yapmaktayız.

Şirketimiz hakkında:
- 1985 yılında kurulmuş, 600+ çalışanı olan köklü bir firmayız
- HACCP ve ISO 22000 gıda güvenliği sertifikalarına sahibiz
- Modern gıda işleme hatlarımız ve soğuk zincir sistemlerimiz mevcuttur
- Sürekli hijyen ve kalite kontrolü yapılmaktadır
- Çalışanlarımıza gıda güvenliği eğitimi ve sağlık kontrolleri sağlanmaktadır
- Yemekhane ve dinlenme alanlarımız mevcuttur

İş Tanımı:
- Gıda ürünlerinin işlenmesi ve paketlenmesi
- Üretim hatlarında çalışma ve kalite kontrol
- Hijyen kurallarına tam uyum sağlama
- Soğuk depo ve işleme alanlarında çalışma
- Üretim kayıtlarını tutma
- Makine temizliği ve bakım işlemleri

Aradığımız Özellikler:
- Gıda sektörü deneyimi (tercih)
- Hijyen ve gıda güvenliği bilgisi
- Fiziksel dayanıklılık (soğuk ortamda çalışma)
- Dikkatli ve titiz çalışma anlayışı
- Ekip çalışmasına yatkınlık

Çalışma Koşulları:
- Soğuk ortamda çalışma (4-8°C)
- Vardiyalı çalışma sistemi
- Haftalık 35 saat çalışma (Fransa standartları)
- Özel koruyucu kıyafetler sağlanmaktadır`,
    salary: '€2,200 - €2,800/month',
    location: 'Lyon, France',
    requiredExperience: 'No experience required',
    requiredLanguage: 'French, Turkish',
    workType: 'full-time',
    employerEmail: 'ahmet@prestalink.app'
  },
  {
    title: 'Bakım Teknisyeni - Endüstriyel Bakım',
    description: `MaintenancePro Services GmbH, Almanya'nın önde gelen endüstriyel bakım ve onarım firmalarından biridir. Fabrikalar, üretim tesisleri ve endüstriyel makineler için bakım hizmetleri sunmaktayız.

Şirketimiz hakkında:
- 2000 yılında kurulmuş, 450+ teknisyen çalıştıran bir firmayız
- Siemens, ABB, Schneider Electric gibi markalarla çalışmaktayız
- 7/24 acil müdahale hizmeti sunuyoruz
- Sürekli teknik eğitim ve sertifikasyon programlarımız vardır
- Modern araç filosu ve teknik ekipmanlarımız mevcuttur
- Çalışanlarımıza kariyer gelişim ve uzmanlaşma fırsatları sunuyoruz

İş Tanımı:
- Endüstriyel makinelerin periyodik bakımını yapmak
- Arıza tespiti ve onarım işlemlerini gerçekleştirmek
- Elektrik, mekanik ve hidrolik sistemlerde çalışma
- Yedek parça değişimi ve stok takibi
- Bakım kayıtlarını tutmak ve raporlama
- Acil müdahale ve 7/24 nöbet sistemi

Aradığımız Özellikler:
- Endüstriyel bakım teknisyeni deneyimi (minimum 3 yıl)
- Elektrik veya mekanik alanında uzmanlık
- Makine okuma ve teknik çizim bilgisi
- Problem çözme ve analitik düşünme yeteneği
- Sürücü belgesi (B sınıfı)

Çalışma Koşulları:
- Sahada ve fabrika ortamında çalışma
- Vardiyalı çalışma ve nöbet sistemi
- Haftalık 40 saat çalışma
- Fazla mesai ve acil müdahale ücretleri mevcuttur`,
    salary: '€3,200 - €4,000/month',
    location: 'Munich, Germany',
    requiredExperience: '3+ years',
    requiredLanguage: 'German, English',
    workType: 'full-time',
    employerEmail: 'sarad@prestalink.app'
  },
  {
    title: 'Paketleme İşçisi - E-ticaret Lojistik',
    description: `QuickPack Logistics B.V., Hollanda'nın hızlı büyüyen e-ticaret lojistik firmalarından biridir. Online mağazalar için paketleme ve kargo hazırlama hizmetleri sunmaktayız.

Şirketimiz hakkında:
- 2015 yılında kurulmuş, hızlı büyüyen dinamik bir firmayız
- 10,000+ günlük paket kapasitesi ile hızlı teslimat garantisi
- Modern paketleme hatlarımız ve otomasyon sistemlerimiz mevcuttur
- Çalışan dostu ortam ve esnek çalışma saatleri
- Kariyer gelişim ve terfi fırsatları
- Modern tesisler ve sosyal alanlar

İş Tanımı:
- Online siparişlerin paketlenmesi ve hazırlanması
- Kargo etiketleme ve barkod okuma işlemleri
- Paket kontrolü ve kalite kontrol
- Depo içi malzeme taşıma
- Paketleme malzemelerinin stok takibi
- Hızlı ve dikkatli çalışma

Aradığımız Özellikler:
- Hızlı ve dikkatli çalışma yeteneği
- Fiziksel dayanıklılık
- Ekip çalışmasına yatkınlık
- Temel bilgisayar kullanımı (tercih)
- Deneyim şartı yok, eğitim verilecektir

Çalışma Koşulları:
- Haftalık 32-40 saat çalışma
- Esnek çalışma saatleri (sabah/akşam vardiyası)
- Part-time çalışma imkanı
- Hızlı öğrenme ve uyum sağlama`,
    salary: '€2,000 - €2,600/month',
    location: 'Amsterdam, Netherlands',
    requiredExperience: 'No experience required',
    requiredLanguage: 'English, Dutch (tercih)',
    workType: 'full-time',
    employerEmail: 'ahmet@prestalink.app'
  },
  {
    title: 'Temizlik Görevlisi - Endüstriyel Temizlik',
    description: `CleanPro Services S.A., Fransa'nın önde gelen endüstriyel ve ticari temizlik firmalarından biridir. Ofisler, fabrikalar, alışveriş merkezleri ve sağlık tesisleri için temizlik hizmetleri sunmaktayız.

Şirketimiz hakkında:
- 1990 yılında kurulmuş, 1200+ çalışanı olan köklü bir firmayız
- ISO 9001 kalite ve ISO 14001 çevre yönetim sertifikalarına sahibiz
- Modern temizlik ekipmanları ve kimyasallar kullanmaktayız
- Çalışanlarımıza temizlik teknikleri ve güvenlik eğitimi veriyoruz
- Kariyer gelişim ve ekip lideri olma fırsatları mevcuttur
- Sosyal haklar ve sağlık sigortası tam kapsamlıdır

İş Tanımı:
- Endüstriyel ve ticari alanların temizliğini yapmak
- Zemin temizliği, cam temizliği ve genel bakım işlemleri
- Temizlik ekipmanlarının kullanımı ve bakımı
- Atık toplama ve ayrıştırma işlemleri
- Hijyen standartlarına uyum sağlamak
- Müşteri ile iletişim ve raporlama

Aradığımız Özellikler:
- Temizlik sektörü deneyimi (tercih)
- Fiziksel dayanıklılık
- Dikkatli ve titiz çalışma anlayışı
- Zamanında iş teslimi ve sorumluluk bilinci
- Ekip çalışmasına yatkınlık

Çalışma Koşulları:
- Vardiyalı çalışma (sabah/akşam/gece)
- Haftalık 35-40 saat çalışma
- Farklı lokasyonlarda çalışma
- Temizlik malzemeleri ve ekipmanlar sağlanmaktadır`,
    salary: '€1,800 - €2,400/month',
    location: 'Paris, France',
    requiredExperience: 'No experience required',
    requiredLanguage: 'French, Turkish',
    workType: 'full-time',
    employerEmail: 'sarad@prestalink.app'
  },
  {
    title: 'İnşaat İşçisi - Yapı ve İnşaat',
    description: `BuildMaster Construction GmbH, Almanya'nın önde gelen inşaat ve yapı firmalarından biridir. Konut projeleri, ticari binalar ve endüstriyel tesisler inşa etmekteyiz.

Şirketimiz hakkında:
- 1988 yılında kurulmuş, 1000+ çalışanı olan köklü bir inşaat firmasıyız
- Almanya'nın farklı şehirlerinde aktif projelerimiz bulunmaktadır
- Modern inşaat teknikleri ve ekipmanlar kullanmaktayız
- İş güvenliği öncelikli çalışma kültürümüz vardır
- Çalışanlarımıza inşaat teknikleri eğitimi ve sertifikasyon imkanları sunuyoruz
- Konut desteği ve sosyal haklar mevcuttur

İş Tanımı:
- İnşaat sahasında beton, tuğla ve yapı malzemeleri ile çalışma
- İnşaat ekipmanlarının kullanımı (karıştırıcı, vibratör vb.)
- Kalıp kurulumu ve söküm işlemleri
- İş güvenliği kurallarına tam uyum
- Ekip lideri yönetiminde çalışma
- Şantiye düzeni ve temizliği

Aradığımız Özellikler:
- İnşaat sektörü deneyimi (tercih)
- Fiziksel dayanıklılık ve yüksekte çalışma uygunluğu
- İş güvenliği bilgisi ve kurallara uyum
- Ekip çalışması ve sorumluluk bilinci
- Zamanında iş teslimi

Çalışma Koşulları:
- Şantiye ortamında açık havada çalışma
- Haftalık 40-45 saat çalışma
- Hava koşullarına bağlı çalışma
- İş güvenliği ekipmanları sağlanmaktadır`,
    salary: '€2,600 - €3,200/month',
    location: 'Hamburg, Germany',
    requiredExperience: '1+ years',
    requiredLanguage: 'German, Turkish',
    workType: 'full-time',
    employerEmail: 'ahmet@prestalink.app'
  },
  {
    title: 'Otomotiv Montaj İşçisi - Araç Üretimi',
    description: `AutoAssembly Manufacturing GmbH, Almanya'nın önde gelen otomotiv montaj firmalarından biridir. Premium markalar için araç montajı ve yan sanayi üretimi yapmaktayız.

Şirketimiz hakkında:
- 2005 yılında kurulmuş, 800+ çalışanı olan modern bir üretim tesisidir
- BMW, Audi ve Mercedes-Benz için yan sanayi üretimi yapmaktayız
- ISO/TS 16949 otomotiv kalite standardına sahibiz
- Robotik montaj hatlarımız ve modern teknoloji kullanmaktayız
- Çalışanlarımıza otomotiv teknikleri eğitimi ve kariyer gelişim fırsatları sunuyoruz
- Yüksek kalite standartları ve sürekli iyileştirme kültürümüz vardır

İş Tanımı:
- Otomotiv parçalarının montajını yapmak
- Montaj hatlarında çalışma ve kalite kontrol
- Elektrik bağlantıları ve mekanik montaj işlemleri
- Torque (tork) ayarları ve ölçüm işlemleri
- Hata tespiti ve düzeltme işlemleri
- Üretim kayıtlarını tutma

Aradığımız Özellikler:
- Otomotiv montaj deneyimi (tercih)
- İnce motor becerileri ve dikkat
- Kalite odaklı çalışma anlayışı
- Ekip çalışması ve hızlı uyum sağlama
- Teknik okuma ve anlama yeteneği

Çalışma Koşulları:
- Montaj hattında vardiyalı çalışma
- Haftalık 40 saat çalışma
- Fazla mesai imkanları
- İş güvenliği ve ergonomi eğitimleri verilmektedir`,
    salary: '€2,800 - €3,400/month',
    location: 'Wolfsburg, Germany',
    requiredExperience: '1+ years',
    requiredLanguage: 'German, Turkish',
    workType: 'full-time',
    employerEmail: 'sarad@prestalink.app'
  },
  {
    title: 'Güvenlik Görevlisi - Tesis Güvenliği',
    description: `SecureGuard Services B.V., Hollanda'nın önde gelen güvenlik hizmet firmalarından biridir. Ticari binalar, endüstriyel tesisler ve etkinlik alanları için güvenlik hizmetleri sunmaktayız.

Şirketimiz hakkında:
- 2000 yılında kurulmuş, 2000+ güvenlik görevlisi çalıştıran bir firmayız
- SVB (Stichting Veiligheid Branche) sertifikasına sahibiz
- Modern güvenlik sistemleri ve teknolojiler kullanmaktayız
- Çalışanlarımıza güvenlik eğitimi ve sertifikasyon programları sunuyoruz
- Kariyer gelişim ve özel güvenlik görevlisi olma fırsatları mevcuttur
- Düzenli maaş ödemeleri ve sosyal haklar tam kapsamlıdır

İş Tanımı:
- Tesis giriş-çıkış kontrolü ve ziyaretçi yönetimi
- Güvenlik kameraları izleme ve raporlama
- Düzenli güvenlik turu ve kontrol işlemleri
- Acil durum müdahale ve koordinasyon
- Güvenlik kayıtlarını tutma
- Müşteri hizmetleri ve iletişim

Aradığımız Özellikler:
- Güvenlik görevlisi sertifikası (SVB - tercih)
- Güvenlik sektörü deneyimi (tercih)
- İyi iletişim becerileri
- Sorumluluk bilinci ve dikkat
- Fiziksel uygunluk

Çalışma Koşulları:
- Vardiyalı çalışma (sabah/akşam/gece nöbeti)
- Haftalık 40 saat çalışma
- Hafta sonu ve tatil günlerinde çalışma
- Üniforma ve güvenlik ekipmanları sağlanmaktadır`,
    salary: '€2,200 - €2,800/month',
    location: 'Rotterdam, Netherlands',
    requiredExperience: 'No experience required',
    requiredLanguage: 'Dutch, English, Turkish',
    workType: 'full-time',
    employerEmail: 'ahmet@prestalink.app'
  }
];

async function setupDemoProfiles() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    log('✅ MongoDB bağlandı\n', 'green');

    log('═══════════════════════════════════════════════════════', 'cyan');
    log('🎯 DEMO PROFİLLERİ OLUŞTURULUYOR', 'cyan');
    log('═══════════════════════════════════════════════════════\n', 'cyan');

    // 1. Kullanıcı profillerini güncelle
    log('📝 1. Kullanıcı Profilleri Güncelleniyor...\n', 'yellow');
    
    const users = {};
    for (const [email, profileData] of Object.entries(demoUsers)) {
      let user = await User.findOne({ email });
      
      if (!user) {
        log(`   ⚠️  ${email} bulunamadı, oluşturuluyor...`, 'yellow');
        user = await User.create({
          email,
          name: profileData.name,
          password: email.split('@')[0], // mehmet, ahmet, sara, sarad
          phone: profileData.phone,
          role: 'user',
          roles: ['user', 'recruiter', 'admin', 'superadmin'],
          activeRole: 'user',
        });
      }

      // Profil bilgilerini güncelle
      user.name = profileData.name;
      user.gender = profileData.gender;
      user.phone = profileData.phone;
      user.bio = profileData.bio;
      user.languages = profileData.languages;
      user.country = profileData.country;
      user.city = profileData.city;
      user.experienceLevel = profileData.experienceLevel;
      user.certificates = profileData.certificates;
      // ⚠️ PROFİL FOTOĞRAFI KİLİTLİ - DEĞİŞTİRİLEMEZ
      user.profilePhoto = profileData.profilePhoto;
      user.cvUrl = profileData.cvUrl;
      user.cvContent = profileData.cvContent;
      
      // Profil fotoğrafını zorla kaydet (override koruması)
      user.markModified('profilePhoto');

      await user.save();
      users[email] = user;
      log(`   ✅ ${user.name} profili güncellendi`, 'green');
    }

    // 2. İş ilanları oluştur
    log('\n📋 2. İş İlanları Oluşturuluyor...\n', 'yellow');
    
    const createdJobs = [];
    for (const jobData of demoJobs) {
      const employer = users[jobData.employerEmail];
      if (!employer) continue;

      // Mevcut işi kontrol et
      let job = await Job.findOne({
        title: jobData.title,
        location: jobData.location,
        employerId: employer._id
      });

      if (!job) {
        job = await Job.create({
          title: jobData.title,
          description: jobData.description,
          salary: jobData.salary,
          location: jobData.location,
          requiredExperience: jobData.requiredExperience,
          requiredLanguage: jobData.requiredLanguage,
          workType: jobData.workType,
          employerId: employer._id,
          closed: false
        });
      } else {
        // Mevcut işi güncelle
        job.description = jobData.description;
        job.salary = jobData.salary;
        job.requiredExperience = jobData.requiredExperience;
        job.requiredLanguage = jobData.requiredLanguage;
        job.workType = jobData.workType;
        job.closed = false;
        await job.save();
      }

      createdJobs.push(job);
      log(`   ✅ ${job.title} - ${job.location}`, 'green');
    }

    log(`\n   📊 Toplam ${createdJobs.length} iş ilanı hazır\n`, 'cyan');

    // 3. İş Başvuruları oluştur
    log('📝 3. İş Başvuruları Oluşturuluyor...\n', 'yellow');

    const candidateUsers = [
      users['mehmet@prestalink.app'],
      users['ahmet@prestalink.app'],
      users['sara@prestalink.app']
    ].filter(Boolean);

    // Her aday için farklı işlere başvuru (daha fazla başvuru)
    const applicationsMap = {
      'mehmet@prestalink.app': [
        { jobIndex: 0, status: 'reviewing' }, // Senior Quality Control Engineer
        { jobIndex: 3, status: 'interview' }, // Quality Assurance Manager
        { jobIndex: 6, status: 'viewed' },     // CNC Machinist
        { jobIndex: 1, status: 'pending' }      // Full-Stack Software Developer (farklı alan)
      ],
      'ahmet@prestalink.app': [
        { jobIndex: 1, status: 'interview' }, // Full-Stack Software Developer
        { jobIndex: 4, status: 'reviewing' }, // Frontend React Developer
        { jobIndex: 7, status: 'pending' },     // Backend Node.js Developer
        { jobIndex: 0, status: 'viewed' }      // Senior Quality Control Engineer (farklı alan)
      ],
      'sara@prestalink.app': [
        { jobIndex: 2, status: 'accepted' }, // ICU Registered Nurse
        { jobIndex: 5, status: 'viewed' },    // Emergency Department Nurse
        { jobIndex: 2, status: 'reviewing' }   // ICU Registered Nurse (duplicate for demo)
      ]
    };

    let applicationCount = 0;
    for (const candidate of candidateUsers) {
      const applications = applicationsMap[candidate.email] || [];
      
      for (const app of applications) {
        if (app.jobIndex >= createdJobs.length) continue;
        const job = createdJobs[app.jobIndex];

        // Mevcut başvuruyu kontrol et
        let existingApp = await Application.findOne({
          userId: candidate._id,
          jobId: job._id
        });

        if (!existingApp) {
          await Application.create({
            userId: candidate._id,
            jobId: job._id,
            cvUrl: candidate.cvUrl || `/uploads/cvs/${candidate.email.split('@')[0]}_cv.pdf`,
            certificates: candidate.certificates || [],
            status: app.status,
            messages: []
          });
          applicationCount++;
          log(`   ✅ ${candidate.name} → ${job.title} (${app.status})`, 'green');
        } else {
          existingApp.status = app.status;
          existingApp.cvUrl = candidate.cvUrl || `/uploads/cvs/${candidate.email.split('@')[0]}_cv.pdf`;
          existingApp.certificates = candidate.certificates || [];
          await existingApp.save();
          applicationCount++;
          log(`   🔄 ${candidate.name} → ${job.title} güncellendi (${app.status})`, 'yellow');
        }
      }
    }

    log(`\n   📊 Toplam ${applicationCount} başvuru hazır\n`, 'cyan');

    // 4. Bildirimler oluştur
    log('🔔 4. Bildirimler Oluşturuluyor...\n', 'yellow');

    const notifications = [
      // Mehmet için
      {
        targetUserId: users['mehmet@prestalink.app']._id,
        title: 'Application Under Review',
        message: 'Your application for Senior Quality Control Engineer position has been received and is currently under review by the hiring team.',
        read: false
      },
      {
        targetUserId: users['mehmet@prestalink.app']._id,
        title: 'Interview Scheduled',
        message: 'Congratulations! Your interview for Quality Assurance Manager is scheduled for December 20, 2024 at 2:00 PM. Please check your email for details.',
        read: false
      },
      {
        targetUserId: users['mehmet@prestalink.app']._id,
        title: 'Profile Viewed',
        message: 'Your profile was viewed by 3 recruiters this week. Keep your profile updated!',
        read: true
      },
      // Ahmet için
      {
        targetUserId: users['ahmet@prestalink.app']._id,
        title: 'Interview Invitation',
        message: 'You have been invited for an interview for the Full-Stack Software Developer position. The interview will be conducted via video call.',
        read: false
      },
      {
        targetUserId: users['ahmet@prestalink.app']._id,
        title: 'New Job Match',
        message: 'We found 2 new job opportunities matching your profile as a Software Engineer. Check them out!',
        read: false
      },
      {
        targetUserId: users['ahmet@prestalink.app']._id,
        title: 'Application Status Update',
        message: 'Your application for Frontend React Developer has moved to the reviewing stage.',
        read: true
      },
      // Sara için
      {
        targetUserId: users['sara@prestalink.app']._id,
        title: 'Application Accepted! 🎉',
        message: 'Great news! Your application for ICU Registered Nurse has been accepted. Welcome to the team! Please check your email for next steps.',
        read: false
      },
      {
        targetUserId: users['sara@prestalink.app']._id,
        title: 'Document Required',
        message: 'Please upload your updated nursing license and BLS certification to complete your application for Emergency Department Nurse.',
        read: false
      },
      {
        targetUserId: users['sara@prestalink.app']._id,
        title: 'Profile Completion',
        message: 'Your profile is 95% complete. Add your work references to make it 100%!',
        read: true
      },
      // Sarad için (recruiter)
      {
        targetUserId: users['sarad@prestalink.app']._id,
        title: 'New Applications Received',
        message: 'You have received 8 new applications for the Senior Quality Control Engineer position. Review them now!',
        read: false
      },
      {
        targetUserId: users['sarad@prestalink.app']._id,
        title: 'Job Posting Live',
        message: 'Your job posting for Full-Stack Software Developer is now live and receiving applications.',
        read: true
      },
      {
        targetUserId: users['sarad@prestalink.app']._id,
        title: 'Candidate Match Found',
        message: 'We found a strong candidate match for your ICU Registered Nurse position. Review candidate profile now!',
        read: false
      }
    ];

    // Eski bildirimleri temizle ve yenilerini oluştur
    for (const user of Object.values(users)) {
      await Notification.deleteMany({ targetUserId: user._id });
    }

    for (const notif of notifications) {
      await Notification.create(notif);
    }

    log(`   ✅ ${notifications.length} bildirim oluşturuldu\n`, 'green');

    // 5. Favori işler için localStorage verisi hazırla (frontend'de kullanılacak)
    log('⭐ 5. Favori İşler Hazırlanıyor...\n', 'yellow');

    const favoritesData = {
      'mehmet@prestalink.app': [createdJobs[0]._id.toString(), createdJobs[3]._id.toString()], // Quality Control & QA Manager
      'ahmet@prestalink.app': [createdJobs[1]._id.toString(), createdJobs[4]._id.toString(), createdJobs[7]._id.toString()], // Software Developer jobs
      'sara@prestalink.app': [createdJobs[2]._id.toString(), createdJobs[5]._id.toString()], // Nursing jobs
      'sarad@prestalink.app': [] // Recruiter, favori yok
    };

    log('   📋 Favori İşler (localStorage için):', 'cyan');
    for (const [email, jobIds] of Object.entries(favoritesData)) {
      if (jobIds.length > 0) {
        const jobTitles = jobIds.map(id => {
          const job = createdJobs.find(j => j._id.toString() === id);
          return job ? job.title : 'Unknown';
        });
        log(`      ${email}: ${jobTitles.join(', ')}`, 'blue');
      }
    }

    // Özet
    log('\n═══════════════════════════════════════════════════════', 'cyan');
    log('✅ DEMO PROFİLLERİ HAZIR!', 'green');
    log('═══════════════════════════════════════════════════════\n', 'cyan');

    log('📊 ÖZET:', 'yellow');
    log(`   👥 Profil Güncellenen Kullanıcı: ${Object.keys(users).length}`, 'cyan');
    log(`   📋 Hazır İş İlanı: ${createdJobs.length}`, 'cyan');
    log(`   📝 Oluşturulan Başvuru: ${applicationCount}`, 'cyan');
    log(`   🔔 Oluşturulan Bildirim: ${notifications.length}`, 'cyan');
    log(`   ⭐ Favori İş: ${Object.values(favoritesData).flat().length}`, 'cyan');

    log('\n🔐 GİRİŞ BİLGİLERİ:', 'yellow');
    log('─'.repeat(50), 'yellow');
    for (const [email, user] of Object.entries(users)) {
      const password = email.split('@')[0];
      log(`   ${email.padEnd(30)} → Şifre: ${password}`, 'cyan');
    }

    log('\n💡 NOT: Favori işler localStorage\'a eklenecek:', 'yellow');
    log('   Frontend\'de her kullanıcı için localStorage.setItem(\'prestalink-favorites\', JSON.stringify([...jobIds]))', 'blue');
    log('   şeklinde ayarlanabilir.\n', 'blue');

    await mongoose.disconnect();
    log('✅ İşlem tamamlandı!', 'green');
  } catch (error) {
    log(`\n❌ Hata: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

setupDemoProfiles();

