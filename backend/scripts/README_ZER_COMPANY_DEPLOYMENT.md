# 🏢 ZER Company Production Deployment Rehberi

Bu rehber, ZER company işveren profilini production veritabanına deploy etmek için adım adım talimatlar içerir.

## 📋 Ön Gereksinimler

1. ✅ Production MongoDB URI'sine erişim
2. ✅ Render/Railway gibi deployment platformunda environment variable ayarlama yetkisi
3. ✅ Node.js yüklü (local test için)

---

## 🚀 Production Deployment Yöntemleri

### Yöntem 1: Render/Railway Console'dan (Önerilen)

#### Adım 1: Render/Railway Console'a Giriş
1. Render Dashboard: https://dashboard.render.com
2. Veya Railway Dashboard: https://railway.app

#### Adım 2: Shell/Console Açma
1. Backend servisinizi seçin
2. **Shell** veya **Console** sekmesine tıklayın
3. Terminal açılacak

#### Adım 3: Script'i Çalıştırma
```bash
cd backend
node scripts/deploy-zer-company-production.js
```

**Not:** `MONGO_URI` environment variable'ı zaten Render/Railway'de ayarlı olmalı.

---

### Yöntem 2: Local'den Production'a Deploy

#### Adım 1: Production MongoDB URI'sini Ayarlama

**PowerShell (Windows):**
```powershell
$env:MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/prestalink?retryWrites=true&w=majority"
```

**Bash (Linux/Mac):**
```bash
export MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/prestalink?retryWrites=true&w=majority"
```

#### Adım 2: Script'i Çalıştırma
```bash
cd backend
NODE_ENV=production node scripts/deploy-zer-company-production.js
```

---

### Yöntem 3: GitHub Actions / CI/CD (Gelişmiş)

`.github/workflows/deploy-zer-company.yml` dosyası oluşturun:

```yaml
name: Deploy ZER Company

on:
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Deploy ZER Company
        env:
          MONGO_URI: ${{ secrets.MONGO_URI }}
        run: |
          cd backend
          node scripts/deploy-zer-company-production.js
```

---

## ✅ Deployment Sonrası Kontrol

### 1. Profil Kontrolü
Script çalıştıktan sonra şu bilgileri göreceksiniz:

```
✅ PRODUCTION DEPLOYMENT TAMAMLANDI
📧 Email: zer.company@prestalink.app
🔑 Şifre: zer2024
🏢 Şirket Adı: ZER company
🌍 Ülke: France
🏙️  Şehir: Paris
💼 Sektör: Human Resources & Recruitment Services
👤 Rol: Recruiter (İşveren)
📝 Profil Durumu: ✅ Eksiksiz
```

### 2. Frontend'den Giriş Testi
1. Production frontend URL'inize gidin
2. **Recruiter Login** sayfasına gidin
3. Şu bilgilerle giriş yapın:
   - Email: `zer.company@prestalink.app`
   - Şifre: `zer2024`

### 3. Profil Kontrolü
1. Giriş yaptıktan sonra **Company Profile** sayfasına gidin
2. Tüm alanların dolu olduğunu kontrol edin:
   - ✅ Şirket Adı
   - ✅ Şirket Açıklaması
   - ✅ Sektör
   - ✅ Ülke
   - ✅ Şehir
   - ✅ Email
   - ✅ Telefon

---

## 🔧 Sorun Giderme

### Hata: "MONGO_URI environment variable bulunamadı"
**Çözüm:**
- Render/Railway'de Environment Variables sekmesine gidin
- `MONGO_URI` değişkeninin tanımlı olduğundan emin olun
- Değişikliklerden sonra servisi yeniden başlatın

### Hata: "MongoDB connection timeout"
**Çözüm:**
- MongoDB Atlas Network Access ayarlarını kontrol edin
- IP adresinizin whitelist'te olduğundan emin olun
- Veya "Allow Access from Anywhere" (0.0.0.0/0) ayarını yapın

### Hata: "User already exists"
**Çözüm:**
- Bu normal bir durumdur
- Script mevcut kullanıcıyı güncelleyecektir
- Tüm alanlar güncellenecektir

---

## 📝 Profil Bilgileri

### ZER Company Profil Detayları

- **Email:** zer.company@prestalink.app
- **Şifre:** zer2024
- **Şirket Adı:** ZER company
- **Ülke:** France
- **Şehir:** Paris
- **Sektör:** Human Resources & Recruitment Services
- **Telefon:** +33123456789
- **Rol:** Recruiter (İşveren)
- **Diller:** FR, EN, AR, TR, DE

### Profil Alanları (Tümü Dolu)
- ✅ Şirket Adı
- ✅ Şirket Açıklaması (Detaylı)
- ✅ Sektör
- ✅ Ülke
- ✅ Şehir
- ✅ Email
- ✅ Telefon
- ✅ Profil Fotoğrafı
- ✅ Bio
- ✅ Diller

---

## 🔄 Güncelleme

Profil bilgilerini güncellemek için:

1. `backend/scripts/create-zer-company.js` dosyasını düzenleyin
2. İstediğiniz değişiklikleri yapın
3. Script'i tekrar çalıştırın (mevcut kullanıcı güncellenecek)

---

## 📞 Destek

Sorun yaşarsanız:
1. Script çıktısını kontrol edin
2. MongoDB bağlantısını test edin
3. Environment variable'ları doğrulayın

---

**Son Güncelleme:** 2024
**Script Versiyonu:** 1.0.0

