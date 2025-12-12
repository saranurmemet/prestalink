// Sara kullanıcısı ile admin giriş testi
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');

const testSaraLogin = async () => {
  try {
    console.log('🔌 MongoDB bağlanıyor...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB bağlandı\n');

    const email = 'sara@prestalink.app';
    const password = 'sara';
    const role = 'admin';

    console.log(`🔍 Admin giriş testi: ${email}\n`);

    // Backend'in yaptığı gibi email'i dönüştür
    const emailParts = email.split('@');
    const searchEmail = `${emailParts[0]}_${role}@${emailParts[1]}`;

    console.log(`   Giriş email: ${email}`);
    console.log(`   Aranan email: ${searchEmail}`);

    const user = await User.findOne({ email: searchEmail });

    if (!user) {
      console.log(`   ❌ Kullanıcı BULUNAMADI: ${searchEmail}`);
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log(`   ✅ Kullanıcı BULUNDU: ${searchEmail}`);
    console.log(`   ✅ Kullanıcı rolü: ${user.role}`);
    console.log(`   ✅ Kullanıcı adı: ${user.name}`);

    const passwordMatch = await user.matchPassword(password);

    if (!passwordMatch) {
      console.log(`   ❌ Şifre YANLIŞ`);
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log(`   ✅ Şifre DOĞRU`);

    if (user.role !== role) {
      console.log(`   ❌ Rol UYUŞMUYOR: Beklenen ${role}, Bulunan ${user.role}`);
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log(`   ✅ Rol UYUŞUYOR`);

    console.log(`\n✅✅✅ GİRİŞ BAŞARILI!`);
    console.log(`\n📋 Giriş Bilgileri:`);
    console.log(`   Email: ${email}`);
    console.log(`   Şifre: ${password}`);
    console.log(`   Rol: ${role}`);
    console.log(`   Dashboard: /admin/dashboard`);
    console.log(`\n🌐 Uygulama URL: http://10.76.212.194:3000`);

    await mongoose.disconnect();
    console.log('\n✅ Test tamamlandı!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
};

testSaraLogin();




