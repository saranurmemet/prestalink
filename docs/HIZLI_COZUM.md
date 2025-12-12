# 🚀 PRSTAlink Giriş Sorunu - Hızlı Çözüm

## ❌ Sorun: Kullanıcılar Uygulamaya Giremiyor

Bu rehber, kullanıcıların PRSTAlink uygulamasına giriş yapamama sorununu hızlıca çözmek için hazırlanmıştır.

---

## ⚡ HIZLI ÇÖZÜM (3 Adım)

### 1️⃣ Otomatik Tanılama Çalıştır

```powershell
cd backend
npm run diagnose
```

Bu komut tüm sistemi kontrol eder ve sorunları tespit eder.

### 2️⃣ Eksik Bağımlılıkları Yükle

```powershell
cd backend
npm install
```

### 3️⃣ Backend ve Frontend'i Başlat

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

---

## 🔍 Yaygın Sorunlar ve Çözümleri

### Sorun 1: "Backend'e bağlanılamıyor" Hatası

**Sebep:** Backend çalışmıyor veya yanlış API URL'i

**Çözüm:**
1. Backend'in çalıştığından emin olun: `cd backend && npm run dev`
2. `frontend/.env` dosyası oluşturun:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
3. Frontend'i yeniden başlatın

### Sorun 2: "Invalid credentials" Hatası

**Sebep:** Kullanıcılar veritabanında yok

**Çözüm:**
```powershell
cd backend
npm run seed
```

Bu komut test kullanıcılarını oluşturur:
- `mehmet@prestalink.app` / `mehmet` (tüm roller)
- `sara@prestalink.app` / `sara` (tüm roller)

### Sorun 3: MongoDB Bağlantı Hatası

**Sebep:** MongoDB çalışmıyor veya connection string yanlış

**Çözüm:**
1. Local MongoDB kullanıyorsanız: `mongod` çalıştırın
2. MongoDB Atlas kullanıyorsanız: Connection string'i kontrol edin
3. `backend/.env` dosyasında `MONGO_URI` tanımlı olmalı:
   ```env
   MONGO_URI=mongodb://localhost:27017/prestalink
   # veya
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/prestalink
   ```

### Sorun 4: CORS Hatası

**Sebep:** Frontend URL'i backend'de izin verilenler arasında değil

**Çözüm:**
`backend/.env` dosyasına ekleyin:
```env
CLIENT_URL=http://localhost:3000
```

Birden fazla URL için:
```env
CLIENT_URL=http://localhost:3000,http://localhost:3001
```

---

## 📋 Kontrol Listesi

Giriş yapmadan önce şunları kontrol edin:

- [ ] Backend çalışıyor (`npm run dev` - Terminal'de "Server listening" mesajı görünmeli)
- [ ] MongoDB çalışıyor (local veya Atlas bağlantısı aktif)
- [ ] Kullanıcılar oluşturuldu (`npm run seed` çalıştırıldı)
- [ ] Frontend `.env` dosyası var ve doğru (`NEXT_PUBLIC_API_URL=http://localhost:5000/api`)
- [ ] Backend `.env` dosyası var ve doğru (`MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`)
- [ ] Browser console'da hata yok (F12 > Console)

---

## 🎯 Doğru Giriş Yöntemi

1. **Login sayfasına gidin:** `http://localhost:3000/login`

2. **Rol seçin:**
   - **User** (İş Arayan) - Mavi kart
   - **Recruiter** (İşveren) - Turuncu kart
   - **Admin** (Yönetici) - Mor kart

3. **Giriş bilgileri:**
   - **Email:** `mehmet@prestalink.app`
   - **Şifre:** `mehmet`

4. **Giriş Yap** butonuna tıklayın

**Not:** Sistem otomatik olarak seçtiğiniz role göre email'i dönüştürür:
- User seçerseniz → `mehmet_user@prestalink.app` aranır
- Recruiter seçerseniz → `mehmet_recruiter@prestalink.app` aranır
- Admin seçerseniz → `mehmet_admin@prestalink.app` aranır

---

## 🆘 Hala Çalışmıyorsa

1. **Otomatik tanılama çalıştırın:**
   ```powershell
   cd backend
   npm run diagnose
   ```

2. **Browser Developer Tools'u açın (F12):**
   - **Console** sekmesinde hata mesajlarını kontrol edin
   - **Network** sekmesinde API isteklerini kontrol edin
   - Hangi istekler başarısız oluyor?

3. **Backend loglarını kontrol edin:**
   - Backend terminal'inde hata mesajları var mı?
   - MongoDB bağlantı mesajları görünüyor mu?

4. **Detaylı rehberi okuyun:**
   - `docs/GIRIS_SORUN_GIDERME.md` dosyasına bakın

---

## ✨ Yeni Özellikler

### Geliştirilmiş Hata Mesajları
Artık login sayfasında daha açıklayıcı hata mesajları gösteriliyor:
- **Network Error**: Backend'e bağlanılamıyor - Backend çalışıyor mu kontrol edin
- **Invalid Credentials**: Email/şifre hatalı - Kullanıcı var mı kontrol edin
- **Forbidden**: Bu rol için yetki yok
- **Server Error**: Sunucu hatası - Backend loglarını kontrol edin

### Otomatik Tanılama
`npm run diagnose` komutu ile tüm sistemi otomatik kontrol edebilirsiniz:
- MongoDB bağlantısı
- Kullanıcı varlığı
- Backend sunucu durumu
- Login endpoint'leri
- Environment variables
- Test login işlemi

---

## 📞 Yardım

Sorun devam ederse:
1. `npm run diagnose` çıktısını paylaşın
2. Browser console hatalarını paylaşın (F12 > Console)
3. Backend terminal loglarını paylaşın

---

**Başarılar! 🎉**


