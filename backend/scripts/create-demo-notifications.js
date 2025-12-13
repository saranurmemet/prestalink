require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Notification = require('../models/Notification');

const createDemoNotifications = async () => {
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

    // Mevcut bildirimleri sil
    await Notification.deleteMany({ userId: mehmet._id });
    console.log('🗑️  Eski bildirimler temizlendi\n');

    // Yeni bildirimler oluştur
    const notifications = [
      {
        targetUserId: mehmet._id,
        title: '🎉 Başvurunuz kabul edildi!',
        message: 'Infirmier pozisyonu için başvurunuz kabul edildi. Görüşme tarihi için sizinle iletişime geçilecek.',
        read: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 saat önce
      },
      {
        targetUserId: mehmet._id,
        title: '📅 Görüşme planlandı',
        message: 'Chef cuisinier pozisyonu için görüşmeniz 18 Aralık 2025, Saat 14:00\'te planlandı. Lütfen hazırlıklı olun.',
        read: false,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 saat önce
      },
      {
        targetUserId: mehmet._id,
        title: '📄 Belge gerekli',
        message: 'Başvurunuzun tamamlanması için güncel pasaport fotokopinizi yüklemeniz gerekmektedir.',
        read: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 gün önce
      },
      {
        targetUserId: mehmet._id,
        title: '💼 Yeni iş fırsatı!',
        message: 'Profilinize uygun 2 yeni iş ilanı eklendi. Hemen inceleyin ve başvurun!',
        read: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 gün önce
      },
      {
        targetUserId: mehmet._id,
        title: '✅ Profil güncellendi',
        message: 'CV\'niz başarıyla yüklendi ve profiliniz tamamlandı. Artık tüm işlere başvurabilirsiniz.',
        read: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 gün önce
      },
      {
        targetUserId: mehmet._id,
        title: '👋 Hoş geldiniz!',
        message: 'PrestaLink\'e hoş geldiniz! Profilinizi tamamlayın ve Avrupa\'daki iş fırsatlarını keşfedin.',
        read: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 gün önce
      }
    ];

    for (const notif of notifications) {
      await Notification.create(notif);
      const statusEmoji = notif.read ? '📖' : '🆕';
      console.log(`${statusEmoji} Bildirim oluşturuldu:`);
      console.log(`   ${notif.title}`);
      console.log(`   Durum: ${notif.read ? 'Okundu' : 'Okunmadı'}`);
      console.log('');
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    console.log('\n✨ Demo bildirimler hazır!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📬 BİLDİRİM ÖZET');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Toplam Bildirim: ${notifications.length} adet`);
    console.log(`🆕 Okunmamış: ${unreadCount} adet`);
    console.log(`📖 Okunmuş: ${notifications.length - unreadCount} adet`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

createDemoNotifications();
