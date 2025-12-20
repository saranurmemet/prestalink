# 🔧 Backend Bağlantı Sorunu - Hızlı Çözüm

## ❌ Sorun
Frontend: `https://prestalink-theta.vercel.app` ✅ Çalışıyor
Backend: ❌ Bağlanamıyor - "Bir hata oluştu" hatası

---

## ✅ ÇÖZÜM (2 Adım)

### ADIM 1: Render Backend URL'ini Bulun

1. **Render Dashboard:** https://dashboard.render.com
2. **Web Services** → `prestalink-backend` servisini bulun
3. **URL'i kopyalayın:** Örnek: `https://prestalink-backend.onrender.com`

**Eğer backend yoksa:**
- **New +** → **Web Service**
- GitHub repo: `prestalink` seçin
- **Root Directory:** `backend`
- **Build:** `npm install`
- **Start:** `npm start`
- **Environment Variables:**
  - `MONGO_URI`: MongoDB connection string
  - `JWT_SECRET`: Rastgele 32+ karakter
  - `CLIENT_URL`: `https://prestalink-theta.vercel.app`
  - `NODE_ENV`: `production`
  - `PORT`: `5000`
  - `HOST`: `0.0.0.0`

---

### ADIM 2: Vercel'de Environment Variable Ekleyin

1. **Vercel Dashboard:** https://vercel.com/dashboard
2. `prestalink` projesini seçin
3. **Settings** → **Environment Variables**
4. **Add New:**
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://prestalink-backend.onrender.com/api` (Render URL + `/api`)
   - **Environments:** Production, Preview, Development (hepsini seçin)
5. **Save**
6. **Deployments** → En son deployment → **Redeploy**

---

## 🔍 Test

1. Backend health check: `https://prestalink-backend.onrender.com/api/health`
2. Frontend: `https://prestalink-theta.vercel.app/login`
3. Login deneyin

---

**Detaylı rehber:** `BACKEND_BAGLANTI_COZUMU.md`


