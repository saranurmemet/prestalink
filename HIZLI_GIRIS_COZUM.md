# 🚀 Hızlı Giriş Çözümü

## ✅ Yapılan Düzeltmeler

1. ✅ Frontend `.env.local` dosyası oluşturuldu
2. ✅ API URL ayarlandı: `http://localhost:5000/api`

## 📋 Giriş Bilgileri

### Test Kullanıcısı (Aday)
- **Email:** `sara@prestalink.app`
- **Şifre:** `sara`
- **Rol:** User

### İşveren
- **Email:** `zer.company@prestalink.app`
- **Şifre:** `zer2024`
- **Rol:** Recruiter

## 🔧 Adımlar

### 1. Backend'i Başlat
```powershell
cd backend
npm run dev
```

Backend çalışıyorsa şu mesajı görmelisiniz:
```
✅ MongoDB connected
🚀 Server listening on port 5000
```

### 2. Frontend'i Yeniden Başlat
```powershell
cd frontend
npm run dev
```

**ÖNEMLİ:** Frontend'i yeniden başlatmanız gerekiyor çünkü `.env.local` dosyası eklendi!

### 3. Giriş Yap
1. Tarayıcıda `http://localhost:3000/login` adresine gidin
2. **User** veya **Recruiter** rolünü seçin
3. Yukarıdaki bilgilerle giriş yapın

## ⚠️ Hala Çalışmıyorsa

### Browser Console Kontrolü
1. F12 tuşuna basın
2. **Console** sekmesinde hata var mı kontrol edin
3. **Network** sekmesinde `/api/auth/login` isteğini kontrol edin

### Backend Kontrolü
Backend terminal'inde şu mesajları görmelisiniz:
- `✅ MongoDB connected`
- `🚀 Server listening on port 5000`
- Login isteği geldiğinde log mesajları

### Frontend Kontrolü
Frontend terminal'inde hata olmamalı. Eğer varsa:
- `.env.local` dosyasının doğru yerde olduğundan emin olun
- Frontend'i yeniden başlatın

---

**Not:** Frontend'i mutlaka yeniden başlatın! `.env.local` dosyası değişiklikleri için gerekli.

