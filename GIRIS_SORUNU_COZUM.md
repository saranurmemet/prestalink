# 🔧 Giriş Sorunu Çözüm Rehberi

## ✅ Kontrol Edilenler

1. ✅ MongoDB bağlantısı çalışıyor
2. ✅ Test kullanıcıları mevcut ve şifreler doğru
3. ✅ JWT_SECRET ayarlı

## 🔍 Sorun Tespiti

### 1. Backend URL Sorunu
`CLIENT_URL` yanlış ayarlanmış olabilir. Backend `.env` dosyasında:
```env
CLIENT_URL=http://localhost:3000  # Frontend URL (doğru)
```

### 2. Frontend API URL Sorunu
Frontend'in backend'e bağlanması için `NEXT_PUBLIC_API_URL` ayarlanmalı.

## 🚀 Çözüm Adımları

### Adım 1: Backend'i Kontrol Et
```powershell
cd backend
npm run dev
```

Backend çalışıyorsa şu mesajı görmelisiniz:
```
✅ MongoDB connected
🚀 Server listening on port 5000
```

### Adım 2: Frontend .env.local Dosyası Oluştur
`frontend/.env.local` dosyası oluşturun:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Adım 3: Frontend'i Yeniden Başlat
```powershell
cd frontend
npm run dev
```

### Adım 4: Giriş Testi

#### Test Kullanıcısı ile:
1. `http://localhost:3000/login` adresine gidin
2. **User** rolünü seçin
3. Email: `sara@prestalink.app`
4. Şifre: `sara`
5. Giriş yapın

#### İşveren ile:
1. `http://localhost:3000/login` adresine gidin
2. **Recruiter** rolünü seçin
3. Email: `zer.company@prestalink.app`
4. Şifre: `zer2024`
5. Giriş yapın

## 🔍 Hata Ayıklama

### Browser Console Kontrolü
1. F12 tuşuna basın
2. **Console** sekmesine gidin
3. Hata mesajlarını kontrol edin

### Network Kontrolü
1. F12 > **Network** sekmesi
2. Login butonuna tıklayın
3. `/api/auth/login` isteğini kontrol edin
4. Status code'u kontrol edin:
   - 200: Başarılı
   - 401: Şifre yanlış
   - 500: Backend hatası

### Backend Log Kontrolü
Backend terminal'inde hata mesajlarını kontrol edin:
- `❌ [AUTH]` ile başlayan mesajlar
- Database connection hataları
- JWT_SECRET hataları

## 📋 Test Kullanıcı Bilgileri

### Test Kullanıcısı
- **Email:** `sara@prestalink.app`
- **Şifre:** `sara`
- **Rol:** User

### İşveren
- **Email:** `zer.company@prestalink.app`
- **Şifre:** `zer2024`
- **Rol:** Recruiter

## ⚠️ Yaygın Sorunlar

### 1. CORS Hatası
**Çözüm:** Backend `.env` dosyasında `CLIENT_URL` doğru ayarlanmalı:
```env
CLIENT_URL=http://localhost:3000
```

### 2. API URL Bulunamadı
**Çözüm:** Frontend `.env.local` dosyası oluşturun:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Database Bağlantı Hatası
**Çözüm:** Backend `.env` dosyasında `MONGO_URI` kontrol edin:
```env
MONGO_URI=mongodb://localhost:27017/prestalink
```

### 4. JWT_SECRET Hatası
**Çözüm:** Backend `.env` dosyasında `JWT_SECRET` ayarlı olmalı:
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## 🆘 Hala Çalışmıyorsa

1. Backend ve Frontend'i yeniden başlatın
2. Browser cache'ini temizleyin (Ctrl+Shift+Delete)
3. Incognito/Private mode'da deneyin
4. Backend loglarını kontrol edin

---

**Son Güncelleme:** 2024

