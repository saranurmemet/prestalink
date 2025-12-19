const { chromium } = require('playwright');

async function quickTest() {
  console.log('🚀 Hızlı Test Başlatılıyor...\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();
  
  const results = {
    homepage: false,
    language: false,
    loginCards: false,
  };
  
  try {
    // TEST 1: Ana Sayfa
    console.log('1️⃣ Ana sayfa yükleniyor mu?');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(3000);
    
    const spinner = await page.locator('.animate-spin').first().isVisible().catch(() => false);
    const hero = await page.locator('h1, h2').first().isVisible().catch(() => false);
    
    if (!spinner && hero) {
      results.homepage = true;
      console.log('   ✅ Ana sayfa yüklendi\n');
    } else {
      console.log(`   ❌ Ana sayfa yüklenmedi (spinner: ${spinner}, hero: ${hero})\n`);
    }
    
    // TEST 2: Dil Değişimi
    console.log('2️⃣ Dil değişimi çalışıyor mu?');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    const initialLang = await page.evaluate(() => document.documentElement.lang);
    console.log(`   Başlangıç dili: ${initialLang}`);
    
    // TR butonunu bul ve tıkla
    const trButton = await page.locator('button:has-text("TR")').first();
    const exists = await trButton.count() > 0;
    
    if (exists) {
      await trButton.click();
      await page.waitForTimeout(1000);
      
      const newLang = await page.evaluate(() => document.documentElement.lang);
      const stored = await page.evaluate(() => localStorage.getItem('prestalink-lang'));
      
      if (newLang === 'tr' || stored === 'tr') {
        results.language = true;
        console.log(`   ✅ Dil değişti: ${newLang} (localStorage: ${stored})\n`);
      } else {
        console.log(`   ❌ Dil değişmedi: ${newLang} (localStorage: ${stored})\n`);
      }
    } else {
      console.log('   ❌ TR butonu bulunamadı\n');
    }
    
    // TEST 3: Login Kartları
    console.log('3️⃣ Login kartları çalışıyor mu?');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // React hydration'ı bekle
    await page.waitForFunction(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.some(btn => {
        const reactKey = Object.keys(btn).find(key => key.startsWith('__react'));
        return !!reactKey;
      });
    }, { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(2000);
    
    // Job Seeker kartını bul - button[type="button"] olarak
    let card = await page.locator('button[type="button"]').first();
    let cardExists = await card.count() > 0;
    
    // Eğer bulamazsa, text ile dene
    if (!cardExists) {
      card = await page.locator('button, div').filter({ hasText: /Job Seeker|Candidate|İş Arayan|user/i }).first();
      cardExists = await card.count() > 0;
    }
    
    if (cardExists) {
      console.log('   Kart bulundu, tıklanıyor...');
      
      // Önce selectedRole state'ini kontrol et
      const beforeClick = await page.evaluate(() => {
        return document.querySelector('input[name="email"]') !== null;
      });
      console.log(`   Tıklama öncesi form görünür mü: ${beforeClick}`);
      
      // Button'un React handler'ı var mı kontrol et
      const hasReactHandler = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button[type="button"]'));
        if (buttons[0]) {
          const reactKey = Object.keys(buttons[0]).find(key => key.startsWith('__react'));
          return !!reactKey;
        }
        return false;
      });
      console.log(`   Button'da React handler var mı: ${hasReactHandler}`);
      
      // JavaScript ile direkt tıkla ve state değişimini kontrol et
      const clicked = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button[type="button"]'));
        if (buttons[0]) {
          buttons[0].click();
          // State değişimini kontrol etmek için biraz bekle
          return new Promise(resolve => {
            setTimeout(() => {
              const form = document.querySelector('input[name="email"]');
              resolve(form !== null);
            }, 1000);
          });
        }
        return false;
      });
      console.log(`   JS click sonrası form görünür mü: ${clicked}`);
      await page.waitForTimeout(2000);
      
      // Eğer hala görünmüyorsa, Playwright ile tıkla
      if (!clicked) {
        await card.click({ force: true });
        await page.waitForTimeout(2000);
      }
      
      const emailInput = await page.locator('input[name="email"]').first();
      const formVisible = await emailInput.isVisible().catch(() => false);
      
      // URL'yi kontrol et
      const currentUrl = page.url();
      console.log(`   Mevcut URL: ${currentUrl}`);
      console.log(`   Form görünür mü: ${formVisible}`);
      
      if (formVisible) {
        results.loginCards = true;
        console.log('   ✅ Login formu açıldı\n');
      } else {
        console.log('   ❌ Login formu açılmadı\n');
      }
    } else {
      console.log('   ❌ Login kartı bulunamadı\n');
    }
    
    // ÖZET
    console.log('\n═══════════════════════════════════════════');
    console.log('📊 TEST SONUÇLARI');
    console.log('═══════════════════════════════════════════\n');
    console.log(`Ana Sayfa:     ${results.homepage ? '✅' : '❌'}`);
    console.log(`Dil Değişimi:  ${results.language ? '✅' : '❌'}`);
    console.log(`Login Kartları: ${results.loginCards ? '✅' : '❌'}`);
    console.log(`\n${Object.values(results).every(r => r) ? '✅ TÜM TESTLER BAŞARILI' : '❌ BAZI TESTLER BAŞARISIZ'}\n`);
    
    console.log('⏳ Tarayıcı 10 saniye açık kalacak...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error(`\n❌ Test hatası: ${error.message}`);
  } finally {
    await browser.close();
  }
}

quickTest().catch(console.error);


