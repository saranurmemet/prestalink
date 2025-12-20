/**
 * Tüm İş İlanlarını Silme Script'i
 * 
 * Bu script tüm iş ilanlarını veritabanından siler.
 * Application'ları da kontrol eder ve ilgili application'ları siler.
 * 
 * Kullanım:
 * Local: node scripts/delete-all-jobs.js
 * Production: MONGO_URI ayarlı olmalı
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Job = require('../models/Job');
const Application = require('../models/Application');

async function deleteAllJobs() {
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
    console.log('🗑️  TÜM İŞ İLANLARINI SİLME İŞLEMİ');
    console.log('═══════════════════════════════════════════════════════\n');

    // Önce mevcut job sayısını kontrol et
    const jobCount = await Job.countDocuments();
    console.log(`📊 Toplam iş ilanı sayısı: ${jobCount}`);

    if (jobCount === 0) {
      console.log('✅ Zaten hiç iş ilanı yok. İşlem tamamlandı.');
      await mongoose.connection.close();
      process.exit(0);
    }

    // İlgili application'ları kontrol et
    const applicationCount = await Application.countDocuments();
    console.log(`📊 Toplam başvuru sayısı: ${applicationCount}\n`);

    // Onay iste
    console.log('⚠️  UYARI: Bu işlem geri alınamaz!');
    console.log(`⚠️  ${jobCount} adet iş ilanı silinecek.`);
    if (applicationCount > 0) {
      console.log(`⚠️  ${applicationCount} adet başvuru da silinecek.\n`);
    }

    // Application'ları önce sil (foreign key constraint için)
    if (applicationCount > 0) {
      console.log('🗑️  Başvurular siliniyor...');
      const deleteApplicationsResult = await Application.deleteMany({});
      console.log(`✅ ${deleteApplicationsResult.deletedCount} adet başvuru silindi.\n`);
    }

    // Tüm job'ları sil
    console.log('🗑️  İş ilanları siliniyor...');
    const deleteResult = await Job.deleteMany({});
    console.log(`✅ ${deleteResult.deletedCount} adet iş ilanı silindi.\n`);

    // Son kontrol
    const remainingJobs = await Job.countDocuments();
    const remainingApplications = await Application.countDocuments();

    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ İŞLEM TAMAMLANDI');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log(`📊 Kalan iş ilanı sayısı: ${remainingJobs}`);
    console.log(`📊 Kalan başvuru sayısı: ${remainingApplications}`);
    console.log('✅ Tüm iş ilanları başarıyla silindi.\n');

    await mongoose.connection.close();
    console.log('✅ İşlem tamamlandı');
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error.message);
    console.error('❌ Stack:', error.stack);
    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  }
}

deleteAllJobs();

