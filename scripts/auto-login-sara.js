// Sara kullanıcısı ile otomatik giriş script'i
// Playwright kullanarak tarayıcıda otomatik giriş yapar

const { chromium } = require('playwright');

const BASE_URL = 'http://192.168.1.14:3000';
const EMAIL = 'sara@prestalink.app';
const PASSWORD = 'sara';

const roles = [
  { name: 'User', selector: 'button:has-text("İş Arayan"), button:has-text("User"), button:has-text("Job Seeker")' },
  { name: 'Recruiter', selector: 'button:has-text("İşveren"), button:has-text("Recruiter"), button:has-text("Employer")' },
  { name: 'Admin', selector: 'button:has-text("Yönetici"), button:has-text("Admin"), button:has-text("Administrator")' },
];

async function loginAsRole(browser, role) {
  console.log(`\n🔐 ${role.name} rolü ile giriş yapılıyor...`);
  
  const page = await browser.newPage();
  
  try {
    // Direkt login sayfasına git
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    console.log(`✅ Login sayfası açıldı: ${page.url()}`);
    
    // Sayfanın tam yüklenmesini bekle
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Rol seçimini bekle ve seç
    try {
      // Rol kartlarını bul - grid içindeki butonları ara
      console.log(`🔍 Rol kartları aranıyor...`);
      
      // Role göre index belirle
      const roleIndex = role.name === 'User' ? 0 : role.name === 'Recruiter' ? 1 : 2;
      
      // Grid içindeki butonları bul
      const roleButtons = await page.$$('div.grid button, button.glass-panel');
      
      if (roleButtons.length >= 3) {
        // İlk 3 butondan doğru index'i seç
        await roleButtons[roleIndex].click();
        console.log(`✅ ${role.name} rolü seçildi (index: ${roleIndex})`);
      } else {
        // Alternatif: Tüm butonları kontrol et
        const allButtons = await page.$$('button');
        const roleKeywords = {
          'User': ['User', 'İş Arayan', 'Aday', 'Job Seeker', 'Candidate', 'user'],
          'Recruiter': ['Recruiter', 'İşveren', 'Employer', 'İşe Alım', 'recruiter'],
          'Admin': ['Admin', 'Yönetici', 'Administrator', 'admin'],
        };
        
        const keywords = roleKeywords[role.name] || [role.name];
        let found = false;
        
        for (const button of allButtons) {
          const text = await button.textContent();
          if (text) {
            const buttonText = text.trim().toLowerCase();
            for (const keyword of keywords) {
              if (buttonText.includes(keyword.toLowerCase())) {
                await button.click();
                console.log(`✅ ${role.name} rolü seçildi (metin: ${text.trim()})`);
                found = true;
                break;
              }
            }
            if (found) break;
          }
        }
        
        if (!found) {
          throw new Error('Rol kartı bulunamadı');
        }
      }
      
      // Form'un yüklenmesini bekle
      await page.waitForTimeout(2000);
      
      // Email input'unu bul ve doldur
      console.log(`📧 Email giriliyor...`);
      const emailInput = await page.waitForSelector('input[name="email"]', { timeout: 10000 });
      await emailInput.fill(EMAIL);
      console.log(`✅ Email girildi: ${EMAIL}`);
      
      // Password input'unu bul ve doldur
      console.log(`🔑 Şifre giriliyor...`);
      const passwordInput = await page.waitForSelector('input[name="password"]', { timeout: 10000 });
      await passwordInput.fill(PASSWORD);
      console.log(`✅ Şifre girildi`);
      
      // Submit butonunu bul ve tıkla
      console.log(`🚀 Giriş yapılıyor...`);
      const submitButton = await page.waitForSelector('button[type="submit"]', { timeout: 10000 });
      await submitButton.click();
      console.log(`✅ Giriş butonu tıklandı`);
      
      // Yönlendirmeyi bekle (dashboard'a gitmeli)
      try {
        await page.waitForURL(/\/dashboard/, { timeout: 15000 });
        const currentUrl = page.url();
        console.log(`✅ Giriş başarılı! Dashboard: ${currentUrl}`);
        
        // Kısa bir süre bekle (kullanıcı görebilsin)
        await page.waitForTimeout(3000);
        
        return { success: true, url: currentUrl };
      } catch (e) {
        // Dashboard'a gitmedi, kontrol et
        await page.waitForTimeout(3000);
        const currentUrl = page.url();
        
        if (currentUrl.includes('dashboard')) {
          console.log(`✅ Giriş başarılı! Dashboard: ${currentUrl}`);
          return { success: true, url: currentUrl };
        }
        
        // Hata mesajı var mı?
        const errorElement = await page.$('p.text-red-500, .text-red-400, [class*="error"]');
        if (errorElement) {
          const errorText = await errorElement.textContent();
          console.log(`❌ Giriş hatası: ${errorText}`);
          await page.screenshot({ path: `error-${role.name.toLowerCase()}.png` });
          return { success: false, error: errorText };
        }
        
        console.log(`⚠️  Dashboard'a yönlendirilmedi. Mevcut URL: ${currentUrl}`);
        await page.screenshot({ path: `debug-${role.name.toLowerCase()}.png` });
        return { success: false, error: 'Dashboard\'a yönlendirilmedi' };
      }
    } catch (error) {
      console.error(`❌ Hata: ${error.message}`);
      // Ekran görüntüsü al
      try {
        await page.screenshot({ path: `error-${role.name.toLowerCase()}.png` });
      } catch (e) {}
      return { success: false, error: error.message };
    }
  } finally {
    // Sayfayı kapatma, kullanıcı görebilsin
    // await page.close();
  }
}

async function main() {
  console.log('🚀 Otomatik Giriş Başlatılıyor...');
  console.log(`📍 URL: ${BASE_URL}`);
  console.log(`👤 Kullanıcı: ${EMAIL}`);
  console.log(`🔑 Şifre: ${PASSWORD}`);
  
  const browser = await chromium.launch({ 
    headless: false, // Tarayıcıyı göster
    slowMo: 500, // Yavaşlat (izlemek için)
  });
  
  const results = [];
  
  for (const role of roles) {
    const result = await loginAsRole(browser, role);
    results.push({ role: role.name, ...result });
    
    // Roller arası bekleme
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Özet
  console.log('\n📊 ÖZET');
  console.log('='.repeat(50));
  results.forEach(result => {
    if (result.success) {
      console.log(`✅ ${result.role}: Başarılı - ${result.url}`);
    } else {
      console.log(`❌ ${result.role}: Başarısız - ${result.error}`);
    }
  });
  
  // Tarayıcıyı kapatma, kullanıcı görebilsin
  console.log('\n✅ Tüm girişler tamamlandı!');
  console.log('📌 Tarayıcı açık kalacak, manuel olarak kapatabilirsiniz.');
  console.log('💡 Her rol için ayrı sekme açıldı, aralarında geçiş yapabilirsiniz.');
  
  // Tarayıcıyı kapatmadan önce bekle
  console.log('\n⏳ 30 saniye sonra tarayıcı kapanacak (Ctrl+C ile erken kapatabilirsiniz)...');
  await new Promise(resolve => setTimeout(resolve, 30000));
  
  await browser.close();
  console.log('✅ Tamamlandı!');
}

main().catch(console.error);

