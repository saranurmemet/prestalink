const path = require('path');
// Production için environment variable'dan, local için .env dosyasından oku
const envPath = process.env.NODE_ENV === 'production' 
  ? null // Production'da environment variable kullan
  : path.join(__dirname, '..', '.env');
if (envPath) {
  require('dotenv').config({ path: envPath });
}
const mongoose = require('mongoose');
const User = require('../models/User');

async function createZERCompany() {
  try {
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI environment variable bulunamadı!');
      console.error('❌ Production için: MONGO_URI environment variable olarak ayarlanmalı.');
      console.error('❌ Local için: backend/.env dosyasında MONGO_URI tanımlı olmalı.');
      process.exit(1);
    }
    
    console.log('🔌 MongoDB bağlanıyor...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB bağlandı\n');

    console.log('═══════════════════════════════════════════════════════');
    console.log('🏢 ZER COMPANY İŞVEREN PROFİLİ OLUŞTURULUYOR');
    console.log('═══════════════════════════════════════════════════════\n');

    // Kullanıcı zaten var mı kontrol et
    const existingUser = await User.findOne({ email: 'zer.company@prestalink.app' });
    if (existingUser) {
      console.log('⚠️  Kullanıcı zaten mevcut. Güncelleniyor...\n');
      existingUser.name = 'ZER company';
      existingUser.password = 'zer2024';
      existingUser.phone = '+33123456789';
      existingUser.role = 'recruiter';
      existingUser.roles = ['recruiter'];
      existingUser.activeRole = 'recruiter';
      existingUser.companyName = 'ZER company';
      existingUser.companyDescription = 'ZER company is a leading international recruitment and talent acquisition firm specializing in connecting skilled professionals with top-tier employers across Europe. With over 15 years of experience in the industry, we have successfully placed thousands of candidates in various sectors including manufacturing, technology, healthcare, and hospitality. Our mission is to bridge the gap between talented individuals seeking career opportunities and companies looking for exceptional talent. We pride ourselves on our comprehensive understanding of international labor markets, cultural integration support, and personalized approach to both candidates and employers. Our team of experienced recruiters works tirelessly to ensure the best match between candidates and positions, providing ongoing support throughout the recruitment process and beyond.';
      existingUser.industry = 'Human Resources & Recruitment Services';
      existingUser.country = 'France';
      existingUser.city = 'Paris';
      existingUser.profilePhoto = 'https://i.pravatar.cc/400?img=68';
      existingUser.bio = 'Leading international recruitment firm with 15+ years of experience in talent acquisition and placement services across Europe. Specialized in connecting skilled professionals with top-tier employers in manufacturing, technology, healthcare, and hospitality sectors.';
      existingUser.languages = ['FR', 'EN', 'AR', 'TR', 'DE'];
      await existingUser.save();
      console.log('✅ İşveren profili güncellendi!');
    } else {
      const user = await User.create({
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
      });
      console.log('✅ İşveren profili oluşturuldu!');
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('✅ İŞLEM TAMAMLANDI');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('📧 Email: zer.company@prestalink.app');
    console.log('🔑 Şifre: zer2024');
    console.log('🏢 Şirket Adı: ZER company');
    console.log('🌍 Ülke: France');
    console.log('🏙️  Şehir: Paris');
    console.log('💼 Sektör: Human Resources & Recruitment Services');
    console.log('👤 Rol: Recruiter (İşveren)');
    console.log('📝 Profil: Eksiksiz dolduruldu\n');

    await mongoose.connection.close();
    console.log('✅ İşlem tamamlandı');
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error.message);
    console.error('❌ Stack:', error.stack);
    process.exit(1);
  }
}

createZERCompany();

