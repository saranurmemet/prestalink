# 🚨 ACİL ÇÖZÜM - SUNUM İÇİN

## ⚠️ DURUM
- Kod tarafında sorun YOK
- Backend Render'da çalışmıyor
- Yarım saat sonra sunum var

## ✅ HIZLI ÇÖZÜM (5 DAKİKA)

### ADIM 1: Render Dashboard'a Gidin
1. https://dashboard.render.com → Giriş yapın
2. `prestalink-backend` servisini bulun

### ADIM 2: Backend'i Restart Edin
1. Backend servis sayfasında
2. **Manual Deploy** → **Deploy latest commit** tıklayın
3. VEYA **Restart** butonuna tıklayın
4. 2-3 dakika bekleyin

### ADIM 3: Kontrol Edin
Tarayıcıda açın:
```
https://prestalink-backend.onrender.com/api/health
```

**Beklenen:** `{"status":"ok", ...}`

### ADIM 4: Test Edin
1. https://prestalink-theta.vercel.app/login
2. Login deneyin
3. Çalışıyorsa hazırsınız!

---

## 🔧 ALTERNATİF: Backend Yoksa

Eğer Render'da backend servisi yoksa:

1. **New +** → **Web Service**
2. GitHub repo: `prestalink` seçin
3. Ayarlar:
   - **Name:** `prestalink-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
4. **Environment Variables:**
   - `MONGO_URI`: MongoDB connection string
   - `JWT_SECRET`: Güvenli rastgele string
   - `CLIENT_URL`: `https://prestalink-theta.vercel.app`
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `HOST`: `0.0.0.0`
5. **Create Web Service**
6. 3-5 dakika bekleyin

---

## 📋 KONTROL LİSTESİ

- [ ] Render dashboard'a gittim
- [ ] Backend servisini buldum
- [ ] Restart/Deploy yaptım
- [ ] Health check çalışıyor
- [ ] Login test ettim
- [ ] Sunum için hazırım

---

**ÖNEMLİ:** Kod tarafında hiçbir değişiklik yapmayın! Sadece Render'da backend'i restart edin.


