# 🔄 PWA Güncelleme Sorunu - Çözüm Rehberi

## ❓ Neden Güncelleme Gelmiyor?

### 1. **Development Modu (En Olası Neden)**
Eğer telefonunuzdan **local network IP** üzerinden erişiyorsanız (`http://192.168.1.14:3000`):
- ❌ PWA **development modunda devre dışı**
- ✅ PWA sadece **production build'de** çalışır
- ✅ **Vercel URL'inden** erişmeniz gerekir

**Çözüm:** Vercel production URL'ini kullanın (örn: `https://prestalink.vercel.app`)

### 2. **Vercel Deploy Bekleniyor**
GitHub'a push ettik ama Vercel henüz deploy etmemiş olabilir.

**Kontrol:**
1. Vercel dashboard'unuza gidin
2. Son deploy'un tamamlanıp tamamlanmadığını kontrol edin
3. Deploy tamamlandıktan sonra 1-2 dakika bekleyin

### 3. **Service Worker Cache'i**
Telefonda eski service worker hala aktif olabilir.

**Çözüm:** Cache temizleme sayfasını kullanın:
- Telefonunuzda: `https://prestalink.vercel.app/force-update.html`
- Veya tarayıcı ayarlarından cache'i temizleyin

### 4. **Manifest Versiyonu**
Versiyon 3.0.0'a güncelledik ama service worker henüz yeniden build edilmemiş.

**Çözüm:** Vercel'de yeni bir build başlatın veya bekleyin.

---

## ✅ Hızlı Çözüm Adımları

### Adım 1: Hangi URL'den Erişiyorsunuz?
- ❌ `http://192.168.1.14:3000` → Development modu, PWA çalışmaz
- ✅ `https://prestalink.vercel.app` → Production, PWA çalışır

### Adım 2: Cache Temizleme
1. Telefonunuzda uygulamayı açın
2. Tarayıcı menüsünden **"Site Ayarları"** → **"Depolama"** → **"Verileri Temizle"**
3. Veya: `https://prestalink.vercel.app/force-update.html` sayfasını açın

### Adım 3: Service Worker'ı Kaldırma
1. Tarayıcı menüsünden **"Site Ayarları"** → **"Service Worker"**
2. **"Unregister"** butonuna tıklayın
3. Uygulamayı yeniden açın

### Adım 4: Uygulamayı Yeniden Yükleme
1. Uygulamayı ana ekrandan kaldırın
2. Tarayıcıdan Vercel URL'ini açın
3. **"Ana Ekrana Ekle"** ile tekrar yükleyin

---

## 🔧 Otomatik Güncelleme Nasıl Çalışır?

1. **Her 30 saniyede bir** güncelleme kontrol edilir
2. **Sayfa açıldığında** kontrol edilir
3. **Uygulamaya geri dönüldüğünde** kontrol edilir
4. **Yeni versiyon bulunduğunda** otomatik yüklenir ve sayfa yenilenir

---

## 📱 Test Etmek İçin

1. **Vercel URL'inden** eriştiğinizden emin olun
2. **Production build** olduğundan emin olun (development değil)
3. **Cache'i temizleyin** (`/force-update.html`)
4. **1-2 dakika bekleyin** (otomatik kontrol için)
5. **Uygulamayı kapatıp açın**

---

## 🚨 Hala Çalışmıyorsa

1. Vercel dashboard'da deploy durumunu kontrol edin
2. Browser console'da hata var mı kontrol edin
3. Service worker durumunu kontrol edin (`/force-update.html`)
4. Manifest versiyonunu kontrol edin (v3.0.0 olmalı)

---

**Not:** Development modunda (`npm run dev`) PWA çalışmaz. Sadece production build'de (`npm run build && npm start`) çalışır.

