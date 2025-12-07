# 🔧 Giriş Sorunu Giderme Rehberi

## ❌ Sorun: "Bir hata oluştu." hatası

Eğer login sayfasında "Bir hata oluştu." mesajı görüyorsanız, aşağıdaki adımları izleyin:

---

## 🔍 ADIM 1: Seed Script Çalıştırma

Kullanıcılar veritabanında yoksa giriş yapamazsınız. Seed script'i çalıştırın:

```powershell
cd backend
npm run seed
```

**Beklenen çıktı:**
```
Mongo connected
Created user -> mehmet_user@prestalink.app
Created recruiter -> mehmet_recruiter@prestalink.app
Created admin -> mehmet_admin@prestalink.app
...
Seeding done
```

---

## 🔍 ADIM 2: Kullanıcıların Var Olduğunu Kontrol Etme

Test script'i çalıştırın:

```powershell
cd backend
node scripts/test-login.js
```

Bu script:
- MongoDB bağlantısını kontrol eder
- Kullanıcıların var olup olmadığını gösterir
- Şifre kontrolü yapar

---

## 🔍 ADIM 3: Backend Çalışıyor mu Kontrol

Backend'in çalıştığını kontrol edin:

```powershell
cd backend
npm run dev
```

**Beklenen çıktı:**
```
Server listening on http://0.0.0.0:5000
```

Eğer çalışmıyorsa:
1. MongoDB çalışıyor mu? (`mongod` çalışıyor olmalı)
2. Port 5000 boş mu?
3. `.env` dosyası doğru mu?

---

## 🔍 ADIM 4: Frontend Backend'e Bağlanıyor mu?

`frontend/.env` dosyasını kontrol edin:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Eğer farklı bir port kullanıyorsanız veya production'da iseniz, doğru URL'i yazın.

---

## 🔍 ADIM 5: Browser Console Kontrolü

1. Browser'da **F12** tuşuna basın
2. **Console** sekmesine gidin
3. Login butonuna tıklayın
4. Hata mesajlarını kontrol edin

**Olası hatalar:**
- `Network Error` → Backend çalışmıyor
- `401 Unauthorized` → Email/şifre yanlış veya kullanıcı yok
- `500 Internal Server Error` → Backend hatası

---

## ✅ DOĞRU GİRİŞ YÖNTEMİ

1. **Login sayfasına gidin**
2. **Rol seçin:**
   - User (İş Arayan)
   - Recruiter (İşveren)
   - Admin (Yönetici)
3. **Email girin:** `mehmet@prestalink.app`
4. **Şifre girin:** `mehmet`
5. **Giriş Yap butonuna tıklayın**

**NOT:** Sistem otomatik olarak seçtiğiniz role göre `mehmet_user@prestalink.app` veya `mehmet_recruiter@prestalink.app` gibi email'leri arar.

---

## 🚨 Yaygın Hatalar ve Çözümleri

### Hata 1: "Invalid credentials"
**Sebep:** Kullanıcı veritabanında yok veya şifre yanlış

**Çözüm:**
```powershell
cd backend
npm run seed
```

### Hata 2: Network Error / CORS Error
**Sebep:** Backend çalışmıyor veya CORS ayarı yanlış

**Çözüm:**
1. Backend'i başlatın: `cd backend && npm run dev`
2. `backend/.env` dosyasında `CLIENT_URL` doğru mu kontrol edin

### Hata 3: MongoDB connection error
**Sebep:** MongoDB çalışmıyor veya connection string yanlış

**Çözüm:**
1. Local MongoDB: `mongod` çalıştırın
2. MongoDB Atlas: Connection string'i kontrol edin
3. `backend/.env` dosyasında `MONGO_URI` doğru mu kontrol edin

---

## 📋 Hızlı Kontrol Listesi

- [ ] Backend çalışıyor (`npm run dev`)
- [ ] MongoDB çalışıyor (local veya Atlas)
- [ ] Seed script çalıştırıldı (`npm run seed`)
- [ ] Kullanıcılar veritabanında var (`node scripts/test-login.js`)
- [ ] Frontend `.env` dosyası doğru
- [ ] Backend `.env` dosyası doğru
- [ ] Browser console'da hata yok

---

## 🆘 Hala Çalışmıyorsa

1. **Browser console'u kontrol edin** (F12)
2. **Backend loglarını kontrol edin** (terminal'de)
3. **Test script'i çalıştırın:** `node scripts/test-login.js`
4. **MongoDB'de kullanıcıları kontrol edin:**
   ```javascript
   db.users.find({ email: /mehmet/ })
   ```

---

**Sorun devam ederse, hata mesajlarını paylaşın!** 🔧




