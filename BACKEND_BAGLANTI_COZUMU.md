# 🔧 Backend Bağlantı Sorunu Çözümü

## ❌ Sorun
Frontend Vercel'de çalışıyor ama backend'e bağlanamıyor. "Bir hata oluştu" hatası alınıyor.

## 🔍 Olası Nedenler

### 1. Vercel'de NEXT_PUBLIC_API_URL Eksik veya Yanlış
Frontend production'da `NEXT_PUBLIC_API_URL` environment variable'ına ihtiyaç duyuyor.

### 2. Backend Render'da Deploy Edilmemiş veya Çalışmıyor
Backend Render'da deploy edilmemiş olabilir veya hata veriyor olabilir.

### 3. CORS Ayarları
Backend'de CORS ayarları frontend URL'ini kabul etmiyor olabilir.

---

## ✅ ÇÖZÜM ADIMLARI

### ADIM 1: Render Backend URL'ini Bulun

1. https://dashboard.render.com → Giriş yapın
2. **Web Services** sekmesine gidin
3. `prestalink-backend` servisini bulun
4. **URL'i kopyalayın:** `https://prestalink-backend.onrender.com` (veya Render'ın verdiği URL)

**Eğer backend deploy edilmemişse:**
1. **New +** → **Web Service**
2. GitHub repository: `prestalink` seçin
3. Ayarlar:
   - **Name:** `prestalink-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
4. **Environment Variables** ekleyin:
   - `MONGO_URI`: MongoDB Atlas connection string
   - `JWT_SECRET`: Güvenli rastgele string (32+ karakter)
   - `PORT`: `5000`
   - `CLIENT_URL`: `https://prestalink-theta.vercel.app` (Vercel frontend URL'iniz)
   - `NODE_ENV`: `production`
   - `HOST`: `0.0.0.0`
5. **Create Web Service** tıklayın
6. Deployment'ın bitmesini bekleyin (3-5 dakika)

---

### ADIM 2: Vercel'de Environment Variable Ekleyin

1. https://vercel.com/dashboard → Giriş yapın
2. `prestalink` projesini seçin
3. **Settings** → **Environment Variables**
4. **Add New** tıklayın
5. Şunu ekleyin:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://prestalink-backend.onrender.com/api` (Render backend URL + `/api`)
   - **Environments:** 
     - ✅ Production
     - ✅ Preview
     - ✅ Development
6. **Save** tıklayın

---

### ADIM 3: Redeploy Yapın

**Vercel'de:**
1. **Deployments** sekmesine gidin
2. En son deployment'ı bulun
3. **...** (üç nokta) → **Redeploy** tıklayın
4. Deployment'ın bitmesini bekleyin (1-2 dakika)

**Render'da:**
1. Backend servis sayfasında
2. **Manual Deploy** → **Deploy latest commit** (eğer gerekirse)

---

### ADIM 4: Backend Health Check

Backend'in çalışıp çalışmadığını kontrol edin:

**Tarayıcıda açın:**
```
https://prestalink-backend.onrender.com/api/health
```

**Beklenen yanıt:**
```json
{
  "message": "Prestalink API is running"
}
```

Eğer hata alıyorsanız, Render dashboard'da **Logs** sekmesini kontrol edin.

---

### ADIM 5: Frontend Test

1. https://prestalink-theta.vercel.app/login adresine gidin
2. Login deneyin
3. Browser console'u açın (F12)
4. **Network** sekmesinde API isteklerini kontrol edin
5. Hata mesajlarını kontrol edin

---

## 🔍 Hata Ayıklama

### Console'da "NEXT_PUBLIC_API_URL is required" hatası
→ Vercel'de environment variable eklenmemiş veya redeploy yapılmamış

### Network'te CORS hatası
→ Backend'de `CLIENT_URL` yanlış ayarlanmış. Render'da `CLIENT_URL` = Vercel frontend URL'i olmalı

### Network'te 404 veya connection refused
→ Backend deploy edilmemiş veya çalışmıyor. Render logs'u kontrol edin

### Network'te timeout
→ Render free tier cold start (50+ saniye). Biraz bekleyip tekrar deneyin

---

## 📋 Kontrol Listesi

- [ ] Render'da backend servisi oluşturuldu
- [ ] Render'da environment variables eklendi (MONGO_URI, JWT_SECRET, CLIENT_URL, vb.)
- [ ] Backend deploy edildi ve çalışıyor
- [ ] Backend health check başarılı: `https://prestalink-backend.onrender.com/api/health`
- [ ] Vercel'de `NEXT_PUBLIC_API_URL` environment variable eklendi
- [ ] Vercel'de redeploy yapıldı
- [ ] Frontend'de login test edildi

---

## 🚀 Hızlı Çözüm

Eğer backend Render'da deploy edilmişse, sadece Vercel'de environment variable ekleyip redeploy yapın:

1. Vercel Dashboard → Settings → Environment Variables
2. `NEXT_PUBLIC_API_URL` = `https://prestalink-backend.onrender.com/api`
3. Save → Redeploy

Bu genellikle sorunu çözer!


