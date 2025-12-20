/**
 * ZER Company Production Deployment Script
 * 
 * Bu script production MongoDB veritabanına ZER company profilini oluşturur.
 * 
 * Kullanım:
 * 1. Production MongoDB URI'sini environment variable olarak ayarlayın:
 *    export MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/prestalink?retryWrites=true&w=majority"
 * 
 * 2. Script'i çalıştırın:
 *    NODE_ENV=production node scripts/deploy-zer-company-production.js
 * 
 * Veya Render/Railway gibi platformlarda:
 *    Environment Variables'da MONGO_URI'yi ayarlayın ve script'i çalıştırın.
 */

const mongoose = require('mongoose');
const User = require('../models/User');

// Production MongoDB URI - Environment variable'dan alınır
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI environment variable bulunamadı!');
  console.error('❌ Production deployment için MONGO_URI ayarlanmalı.');
  console.error('❌ Örnek: export MONGO_URI="mongodb+srv://..."');
  process.exit(1);
}

async function deployZERCompanyToProduction() {
  try {
    console.log('🔌 Production MongoDB bağlanıyor...');
    console.log(`📍 MongoDB Host: ${MONGO_URI.split('@')[1]?.split('/')[0] || 'Bağlanıyor...'}`);
    
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log('✅ Production MongoDB bağlandı\n');

    console.log('═══════════════════════════════════════════════════════');
    console.log('🏢 ZER COMPANY PRODUCTION DEPLOYMENT');
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

    // Profil tamamlanma kontrolü
    const user = await User.findOne({ email: 'zer.company@prestalink.app' });
    const isComplete = user && 
      user.companyName && 
      user.companyDescription && 
      user.industry && 
      user.country && 
      user.city && 
      user.email && 
      user.phone;

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('✅ PRODUCTION DEPLOYMENT TAMAMLANDI');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('📧 Email: zer.company@prestalink.app');
    console.log('🔑 Şifre: zer2024');
    console.log('🏢 Şirket Adı: ZER company');
    console.log('🌍 Ülke: France');
    console.log('🏙️  Şehir: Paris');
    console.log('💼 Sektör: Human Resources & Recruitment Services');
    console.log('👤 Rol: Recruiter (İşveren)');
    console.log('📝 Profil Durumu:', isComplete ? '✅ Eksiksiz' : '❌ Eksik');
    console.log('\n📋 Profil Alanları:');
    console.log('   ✓ Şirket Adı:', user?.companyName ? '✅' : '❌');
    console.log('   ✓ Şirket Açıklaması:', user?.companyDescription ? '✅' : '❌');
    console.log('   ✓ Sektör:', user?.industry ? '✅' : '❌');
    console.log('   ✓ Ülke:', user?.country ? '✅' : '❌');
    console.log('   ✓ Şehir:', user?.city ? '✅' : '❌');
    console.log('   ✓ Email:', user?.email ? '✅' : '❌');
    console.log('   ✓ Telefon:', user?.phone ? '✅' : '❌');
    console.log('   ✓ Profil Fotoğrafı:', user?.profilePhoto ? '✅' : '❌');
    console.log('   ✓ Bio:', user?.bio ? '✅' : '❌');
    console.log('   ✓ Diller:', user?.languages?.length > 0 ? `✅ (${user.languages.length})` : '❌');
    console.log('');

    await mongoose.connection.close();
    console.log('✅ Production deployment tamamlandı');
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error.message);
    console.error('❌ Stack:', error.stack);
    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  }
}

deployZERCompanyToProduction();

