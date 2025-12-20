# 🔍 Backend Sorun Tespiti

## ✅ Vercel Ayarı Doğru
- `NEXT_PUBLIC_API_URL` = `https://prestalink-backend.onrender.com/api` ✅

## ❌ Backend Sorunu
- `/api/auth/login` endpoint'i **404** hatası veriyor
- Backend çalışmıyor veya route'lar yüklenmemiş olabilir

## 🔧 Kontrol Edilmesi Gerekenler

### 1. Render Dashboard Kontrolü
1. https://dashboard.render.com → Giriş yapın
2. `prestalink-backend` servisini bulun
3. **Logs** sekmesini açın
4. Son logları kontrol edin:
   - Backend başladı mı?
   - Route'lar yüklendi mi?
   - Hata var mı?

### 2. Backend Health Check
Tarayıcıda açın:
```
https://prestalink-backend.onrender.com/api/health
```

**Beklenen:** `{"status":"ok", ...}`

**Eğer hata alıyorsanız:** Backend deploy edilmemiş veya çalışmıyor

### 3. Backend Deploy Durumu
Render dashboard'da:
- **Events** sekmesini kontrol edin
- Son deployment başarılı mı?
- Hata var mı?

## 🚨 Olası Sorunlar

1. **Backend deploy edilmemiş**
   - Render'da servis yok
   - Çözüm: Backend'i deploy edin

2. **Backend çalışmıyor**
   - Render'da servis var ama çalışmıyor
   - Çözüm: Logs'u kontrol edin, restart edin

3. **Route'lar yüklenmemiş**
   - Backend çalışıyor ama route'lar yok
   - Çözüm: Backend kodunu kontrol edin

4. **Environment variable eksik (Backend)**
   - `MONGO_URI`, `JWT_SECRET` vb. eksik
   - Çözüm: Render'da environment variables ekleyin

## 📋 Adım Adım Çözüm

1. Render dashboard'a gidin
2. Backend servisini bulun
3. Logs'u kontrol edin
4. Hata varsa düzeltin
5. Restart edin
6. Health check yapın
7. Frontend'den login deneyin

---

**ÖNEMLİ:** Vercel ayarı doğru, sorun backend'de!


