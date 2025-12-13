const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');

const addSara = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/prestalink');
    console.log('MongoDB bağlandı');

    // Önce sara var mı kontrol et
    const existing = await User.findOne({ email: 'sara@test.com' });
    if (existing) {
      console.log('✅ Sara zaten var:', existing.email);
      console.log('   Username:', existing.username);
      console.log('   Role:', existing.role);
      await mongoose.disconnect();
      return;
    }

    // Sara'yı oluştur
    const sara = await User.create({
      username: 'sara',
      name: 'Sara Yılmaz',
      email: 'sara@test.com',
      phone: '+213555222222',
      password: 'sara123',
      role: 'user',
      languages: ['FR', 'AR'],
      profile: {
        firstName: 'Sara',
        lastName: 'Yılmaz',
        birthDate: new Date('1995-03-15'),
        profession: 'Hemşire',
        experience: 3,
        languages: [
          { lang: 'Français', level: 'advanced' },
          { lang: 'Arabe', level: 'native' }
        ],
        drivingLicense: {
          has: true,
          type: 'B'
        },
        motivation: 'Fransa\'da sağlık sektöründe çalışmak istiyorum.'
      },
      payments: {
        firstInstallment: {
          paid: true,
          date: new Date(),
          amount: 10000,
          currency: 'DZD'
        },
        secondInstallment: {
          paid: false,
          amount: 15000,
          currency: 'DZD'
        }
      },
      process: {
        stage: 2,
        completedStages: [1],
        notes: []
      }
    });

    console.log('✅ Sara kullanıcısı oluşturuldu!');
    console.log('   Email: sara@test.com');
    console.log('   Şifre: sara123');
    console.log('   Role: user');

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
};

addSara();
