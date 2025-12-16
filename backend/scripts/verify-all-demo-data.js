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

async function verifyAllDemoData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    log('✅ MongoDB bağlandı\n', 'green');

    const demoEmails = ['mehmet@prestalink.app', 'ahmet@prestalink.app', 'sara@prestalink.app', 'sarad@prestalink.app'];
    const users = await User.find({ email: { $in: demoEmails } });

    log('═══════════════════════════════════════════════════════', 'cyan');
    log('🔍 TÜM DEMO VERİLERİ KONTROL EDİLİYOR', 'cyan');
    log('═══════════════════════════════════════════════════════\n', 'cyan');

    let totalIssues = 0;

    // 1. Kullanıcı Profilleri Kontrolü
    log('📝 1. KULLANICI PROFİLLERİ KONTROLÜ\n', 'yellow');
    for (const user of users) {
      log(`   👤 ${user.email}`, 'cyan');
      
      const issues = [];
      
      // İsim kontrolü
      if (!user.name || user.name.trim() === '') {
        issues.push('❌ İsim boş');
        totalIssues++;
      } else {
        log(`      ✅ İsim: ${user.name}`, 'green');
      }

      // Soy isim kontrolü (isimde soy isim var mı?)
      const nameParts = user.name.split(' ');
      if (nameParts.length < 2) {
        issues.push('⚠️  Soy isim yok (sadece isim var)');
      } else {
        log(`      ✅ Soy isim: ${nameParts.slice(1).join(' ')}`, 'green');
      }

      // CV içeriği kontrolü
      if (!user.cvContent || user.cvContent.trim() === '') {
        issues.push('❌ CV içeriği yok');
        totalIssues++;
      } else {
        // CV'de kullanıcı adı var mı?
        const cvFirstLine = user.cvContent.split('\n')[0];
        if (cvFirstLine.includes(user.name.toUpperCase()) || cvFirstLine.includes(user.name)) {
          log(`      ✅ CV içeriği var ve kullanıcı adı doğru: "${cvFirstLine}"`, 'green');
        } else {
          issues.push(`❌ CV içeriğinde kullanıcı adı "${user.name}" bulunamadı. İlk satır: "${cvFirstLine}"`);
          totalIssues++;
        }

        // Mehmet Demir kontrolü
        if (user.email !== 'mehmet@prestalink.app' && 
            (user.cvContent.includes('MEHMET DEMIR') || user.cvContent.includes('Mehmet Demir'))) {
          issues.push('❌ CV içeriğinde "Mehmet Demir" bulundu ama bu kullanıcı Mehmet değil!');
          totalIssues++;
        }
      }

      // Profil bilgileri
      if (!user.bio) issues.push('⚠️  Bio yok');
      if (!user.country) issues.push('⚠️  Ülke yok');
      if (!user.city) issues.push('⚠️  Şehir yok');
      if (!user.experienceLevel) issues.push('⚠️  Deneyim seviyesi yok');
      if (!user.languages || user.languages.length === 0) issues.push('⚠️  Dil yok');
      if (!user.certificates || user.certificates.length === 0) issues.push('⚠️  Sertifika yok');

      if (issues.length > 0) {
        issues.forEach(issue => log(`      ${issue}`, 'red'));
      }

      log('');
    }

    // 2. İş Başvuruları Kontrolü
    log('📝 2. İŞ BAŞVURULARI KONTROLÜ\n', 'yellow');
    for (const user of users) {
      const applications = await Application.find({ userId: user._id });
      log(`   👤 ${user.name}: ${applications.length} başvuru`, 'cyan');

      if (applications.length === 0 && user.email !== 'sarad@prestalink.app') {
        log(`      ❌ Başvuru yok!`, 'red');
        totalIssues++;
      } else {
        for (const app of applications) {
          const job = await Job.findById(app.jobId);
          if (!job) {
            log(`      ❌ Başvuru var ama iş bulunamadı (jobId: ${app.jobId})`, 'red');
            totalIssues++;
          } else {
            log(`      ✅ ${job.title} - Durum: ${app.status}`, 'green');
          }

          // CV URL kontrolü
          if (!app.cvUrl) {
            log(`      ⚠️  Başvuruda CV URL yok`, 'yellow');
          } else if (app.cvUrl.includes('mehmet') && user.email !== 'mehmet@prestalink.app') {
            log(`      ❌ Başvuruda Mehmet'in CV URL'i var: ${app.cvUrl}`, 'red');
            totalIssues++;
          }
        }
      }
      log('');
    }

    // 3. Bildirimler Kontrolü
    log('🔔 3. BİLDİRİMLER KONTROLÜ\n', 'yellow');
    for (const user of users) {
      const notifications = await Notification.find({ targetUserId: user._id });
      log(`   👤 ${user.name}: ${notifications.length} bildirim`, 'cyan');

      if (notifications.length === 0) {
        log(`      ⚠️  Bildirim yok`, 'yellow');
      } else {
        const unreadCount = notifications.filter(n => !n.read).length;
        log(`      ✅ Okunmamış: ${unreadCount}, Okunmuş: ${notifications.length - unreadCount}`, 'green');
      }
      log('');
    }

    // 4. İş İlanları Kontrolü
    log('📋 4. İŞ İLANLARI KONTROLÜ\n', 'yellow');
    const allJobs = await Job.find({ closed: false });
    log(`   Toplam ${allJobs.length} aktif iş ilanı`, 'cyan');
    
    if (allJobs.length === 0) {
      log(`      ❌ İş ilanı yok!`, 'red');
      totalIssues++;
    } else {
      for (const job of allJobs.slice(0, 5)) {
        const employer = await User.findById(job.employerId);
        log(`      ✅ ${job.title} - ${job.location} (İşveren: ${employer?.name || 'Bilinmiyor'})`, 'green');
      }
      if (allJobs.length > 5) {
        log(`      ... ve ${allJobs.length - 5} iş ilanı daha`, 'blue');
      }
    }
    log('');

    // Özet
    log('═══════════════════════════════════════════════════════', 'cyan');
    if (totalIssues === 0) {
      log('✅ TÜM KONTROLLER BAŞARILI!', 'green');
    } else {
      log(`⚠️  TOPLAM ${totalIssues} SORUN BULUNDU!`, 'yellow');
    }
    log('═══════════════════════════════════════════════════════\n', 'cyan');

    await mongoose.disconnect();
  } catch (error) {
    log(`\n❌ Hata: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

verifyAllDemoData();

