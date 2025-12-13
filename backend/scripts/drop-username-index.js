require('dotenv/config');
const mongoose = require('mongoose');

async function dropUsernameIndex() {
  try {
    // MongoDB bağlantısı
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB bağlandı');

    // users collection'ına eriş
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Mevcut index'leri kontrol et
    console.log('\n📋 Mevcut indexler:');
    const indexes = await usersCollection.indexes();
    indexes.forEach(index => {
      console.log(`   ${JSON.stringify(index.key)} - ${index.name}`);
    });

    // username_1 index'ini sil
    try {
      await usersCollection.dropIndex('username_1');
      console.log('\n✅ username_1 index silindi');
    } catch (error) {
      if (error.codeName === 'IndexNotFound') {
        console.log('\n⚠️  username_1 index bulunamadı (zaten yok)');
      } else {
        throw error;
      }
    }

    // Son durum
    console.log('\n📋 Güncel indexler:');
    const finalIndexes = await usersCollection.indexes();
    finalIndexes.forEach(index => {
      console.log(`   ${JSON.stringify(index.key)} - ${index.name}`);
    });

    mongoose.connection.close();
    console.log('\n✅ İşlem tamamlandı');
  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
}

dropUsernameIndex();
