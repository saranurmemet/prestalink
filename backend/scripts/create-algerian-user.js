const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function createAlgerianUser() {
  try {
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI environment variable bulunamadı!');
      console.error('❌ backend/.env dosyasında MONGO_URI tanımlı olmalı.');
      process.exit(1);
    }
    
    console.log('🔌 MongoDB bağlanıyor...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB bağlandı\n');

    console.log('═══════════════════════════════════════════════════════');
    console.log('👤 CEZAYİRLİ KADIN İŞÇİ KULLANICI OLUŞTURULUYOR');
    console.log('═══════════════════════════════════════════════════════\n');

    // Kullanıcı zaten var mı kontrol et
    const existingUser = await User.findOne({ email: 'amina.benali@prestalink.app' });
    if (existingUser) {
      console.log('⚠️  Kullanıcı zaten mevcut. Güncelleniyor...\n');
      existingUser.name = 'Amina Benali';
      existingUser.password = 'amina2024';
      existingUser.phone = '+213555123456';
      existingUser.role = 'user';
      existingUser.roles = ['user'];
      existingUser.activeRole = 'user';
      existingUser.gender = 'female';
      existingUser.country = 'Algeria';
      existingUser.city = 'Algiers';
      existingUser.languages = ['AR', 'FR', 'EN'];
      existingUser.experienceLevel = '3-5 years';
      existingUser.profession = 'Textile Worker';
      existingUser.bio = 'Experienced textile worker with 4 years of hands-on experience in garment manufacturing and quality control. Proven track record in operating industrial sewing machines, maintaining production standards, and ensuring quality compliance. Strong attention to detail, excellent time management skills, and ability to work efficiently in fast-paced production environments. Seeking opportunities in Europe to advance career and contribute to international manufacturing teams.';
      existingUser.profilePhoto = 'https://i.pravatar.cc/400?img=47';
      existingUser.cvUrl = '/uploads/cvs/amina_benali_cv.pdf';
      existingUser.cvContent = `AMINA BENALI
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
Arabic (Native), French (Fluent), English (Intermediate)`;
      existingUser.certificates = [
        'Industrial Safety Certificate (2023)',
        'Textile Manufacturing Training Certificate (2022)',
        'Quality Control Certification (2021)',
      ];
      await existingUser.save();
      console.log('✅ Kullanıcı güncellendi!');
    } else {
      const user = await User.create({
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
      });
      console.log('✅ Kullanıcı oluşturuldu!');
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('✅ İŞLEM TAMAMLANDI');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('📧 Email: amina.benali@prestalink.app');
    console.log('🔑 Şifre: amina2024');
    console.log('👤 İsim: Amina Benali');
    console.log('🌍 Ülke: Algeria');
    console.log('🏙️  Şehir: Algiers');
    console.log('👩 Cinsiyet: Kadın');
    console.log('💼 Meslek: Textile Worker');
    console.log('📜 Sertifikalar: 3 adet\n');

    await mongoose.connection.close();
    console.log('✅ İşlem tamamlandı');
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error.message);
    console.error('❌ Stack:', error.stack);
    process.exit(1);
  }
}

createAlgerianUser();

