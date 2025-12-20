/**
 * PRESENTATION CHANGES ROLLBACK SCRIPT
 * Bu script sunum iyileştirmelerini geri alır
 * Kullanım: node scripts/rollback-presentation-changes.js
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Yedeklenen dosyalar
const backups = {
  'frontend/components/sections/QuickStats.tsx': 'frontend/components/sections/QuickStats.tsx.backup',
  'frontend/app/user/dashboard/page.tsx': 'frontend/app/user/dashboard/page.tsx.backup',
  'frontend/components/sections/TestimonialsSection.tsx': 'frontend/components/sections/TestimonialsSection.tsx.backup',
  'frontend/components/jobs/JobCard.tsx': 'frontend/components/jobs/JobCard.tsx.backup',
  'frontend/app/user/profile/page.tsx': 'frontend/app/user/profile/page.tsx.backup',
};

function rollback() {
  log('═══════════════════════════════════════════════════════', 'cyan');
  log('🔄 SUNUM İYİLEŞTİRMELERİ GERİ ALINIYOR', 'cyan');
  log('═══════════════════════════════════════════════════════\n', 'cyan');

  let restored = 0;
  let failed = 0;

  for (const [original, backup] of Object.entries(backups)) {
    const originalPath = path.join(process.cwd(), original);
    const backupPath = path.join(process.cwd(), backup);

    try {
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, originalPath);
        fs.unlinkSync(backupPath);
        log(`   ✅ ${original} geri yüklendi`, 'green');
        restored++;
      } else {
        log(`   ⚠️  ${backup} yedeği bulunamadı`, 'yellow');
      }
    } catch (error) {
      log(`   ❌ ${original} geri yüklenemedi: ${error.message}`, 'red');
      failed++;
    }
  }

  log('\n═══════════════════════════════════════════════════════', 'cyan');
  if (failed === 0) {
    log('✅ TÜM DEĞİŞİKLİKLER GERİ ALINDI!', 'green');
  } else {
    log(`⚠️  ${restored} dosya geri yüklendi, ${failed} dosya başarısız`, 'yellow');
  }
  log('═══════════════════════════════════════════════════════\n', 'cyan');
}

rollback();


