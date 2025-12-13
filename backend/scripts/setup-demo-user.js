require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

const setupDemoUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB bağlandı\n');

    // Mehmet kullanıcısını bul
    const mehmet = await User.findOne({ email: 'mehmet@prestalink.app' });
    if (!mehmet) {
      console.log('❌ Mehmet kullanıcısı bulunamadı');
      process.exit(1);
    }

    console.log('📝 Mehmet kullanıcısı bulundu:', mehmet.name);

    // Zengin profil bilgileri
    mehmet.name = 'Mehmet Demir';
    mehmet.phone = '+213 555 123 456';
    mehmet.country = 'Algeria';
    mehmet.languages = ['Turkish', 'French', 'English', 'Arabic'];
    mehmet.cvUrl = '/uploads/cv/mehmet_demir_europass_cv.pdf';
    mehmet.profilePhoto = 'https://i.pravatar.cc/400?img=12';
    mehmet.experienceLevel = 'Senior';
    
    mehmet.bio = `Highly skilled CNC Machinist and Technical Operator with 6+ years of progressive experience in precision manufacturing and automotive component production. Proven expertise in operating advanced CNC machinery, CAD/CAM software, and implementing quality control procedures in high-volume production environments.

Successfully managed production schedules, trained junior operators, and consistently achieved 99.8% quality compliance rates. Fluent in Turkish, French, English and Arabic with strong cross-cultural communication skills. Seeking challenging opportunities in European automotive and manufacturing sectors where technical excellence and attention to detail are valued.

Certified in ISO 9001:2015 Quality Management, Advanced CNC Programming, and Workplace Safety Standards. Ready to relocate to Germany, France, or other EU countries for the right opportunity.`;

    mehmet.certificates = [
      'Advanced CNC Programming - Siemens 840D (Siemens Technical Academy, 2021)',
      'ISO 9001:2015 Quality Management Systems (IQCB, Valid until 2025)',
      'Occupational Health & Safety Certificate (Algerian Ministry of Labor, Valid until 2026)',
      'AutoCAD Professional Certification (Autodesk, 2020)',
      'French Language Proficiency - DELF B2 (French Cultural Institute, 2019)',
      'Lean Manufacturing & Six Sigma Yellow Belt (International Six Sigma Institute, 2023)',
      'First Aid & Emergency Response Training (Red Crescent Algeria, 2022)',
      'Advanced Metrology & CMM Operation (National Metrology Institute, 2021)'
    ];

    await mehmet.save();
    console.log('✅ Profil bilgileri güncellendi\n');

    // İş ilanlarını getir
    const jobs = await Job.find({ status: 'active' }).limit(5);
    console.log(`📋 ${jobs.length} iş ilanı bulundu\n`);

    // Mevcut başvuruları sil
    await Application.deleteMany({ userId: mehmet._id });
    console.log('🗑️  Eski başvurular temizlendi\n');

    // Yeni başvurular oluştur
    const applicationStatuses = ['pending', 'reviewing', 'interview', 'accepted', 'rejected'];
    const applications = [];

    for (let i = 0; i < Math.min(jobs.length, 5); i++) {
      const job = jobs[i];
      const status = applicationStatuses[i % applicationStatuses.length];
      
      const application = await Application.create({
        userId: mehmet._id,
        jobId: job._id,
        status: status,
        cvUrl: '/uploads/cv/mehmet_demir_cv.pdf',
        coverLetter: `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${job.title} position at ${job.company}. With ${5} years of experience in my field and proficiency in multiple languages, I am confident I would be a valuable addition to your team.\n\nMy background includes extensive experience in technical operations, quality control, and cross-cultural communication. I am particularly drawn to this opportunity because of your company's reputation for excellence and commitment to employee development.\n\nI am eager to bring my skills and enthusiasm to your organization and contribute to your continued success.\n\nThank you for considering my application.\n\nBest regards,\nMehmet Demir`,
        appliedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Son 30 gün içinde rastgele
      });

      applications.push(application);
      
      const statusEmoji = {
        pending: '⏳',
        reviewing: '👀',
        interview: '🎤',
        accepted: '✅',
        rejected: '❌'
      };

      console.log(`${statusEmoji[status]} Başvuru oluşturuldu:`);
      console.log(`   İş: ${job.title} @ ${job.company}`);
      console.log(`   Konum: ${job.city}, ${job.country}`);
      console.log(`   Durum: ${status}`);
      console.log('');
    }

    console.log('\n✨ Demo kullanıcı hazır!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 MEHMET DEMİR - DEMO PROFİL ÖZET');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`👤 Ad: ${mehmet.name}`);
    console.log(`📧 Email: ${mehmet.email}`);
    console.log(`📱 Telefon: ${mehmet.phone}`);
    console.log(`🌐 Diller: ${mehmet.languages.join(', ')}`);
    console.log(`📄 CV: ${mehmet.cvUrl ? '✓ Yüklü' : '✗ Yok'}`);
    console.log(`🖼️  Profil Resmi: ${mehmet.profilePhoto ? '✓ Var' : '✗ Yok'}`);
    console.log(`📜 Sertifikalar: ${mehmet.certificates.length} adet`);
    console.log(`💼 İş Başvuruları: ${applications.length} adet`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🔐 GİRİŞ BİLGİLERİ:');
    console.log('   Email: mehmet@prestalink.app');
    console.log('   Şifre: mehmet');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

setupDemoUser();
