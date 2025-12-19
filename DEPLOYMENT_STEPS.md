# 🚀 Deployment Adımları - ŞİMDİ YAPILACAKLAR

## ✅ Hazır Olanlar
- ✅ MongoDB Atlas hesabı
- ✅ Vercel hesabı
- ✅ Render hesabı
- ✅ GitHub hesabı

---

## 📝 ADIM 1: MongoDB Atlas Connection String

### 1.1. MongoDB Atlas'a Giriş
1. https://cloud.mongodb.com → Login
2. Cluster'ınızı seçin

### 1.2. Connection String Alma
1. **Database** → **Connect**
2. **Connect your application** seçin
3. **Driver:** Node.js, **Version:** 5.5 veya daha yeni
4. Connection string'i kopyalayın:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/prestalink?retryWrites=true&w=majority
   ```
5. `<password>` yerine gerçek şifrenizi yazın
6. **Kopyalayın ve bir yere kaydedin** (Render'da kullanacağız)

### 1.3. Network Access Kontrolü
1. **Network Access** → IP adresleri kontrol edin
2. Eğer `0.0.0.0/0` yoksa → **Add IP Address** → **Allow Access from Anywhere**

---

## 🎨 ADIM 2: Vercel Frontend Deployment

### 2.1. GitHub'a Push (Eğer henüz yapmadıysanız)
```powershell
cd C:\Users\RANDOM\Desktop\prestalink
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2.2. Vercel Dashboard'dan Deploy
1. https://vercel.com/dashboard → Login
2. **Add New...** → **Project**
3. GitHub repository'nizi seçin: `prestalink`
4. **Import** tıklayın

### 2.3. Vercel Project Ayarları
- **Framework Preset:** Next.js (otomatik algılanır)
- **Root Directory:** `frontend` (ÖNEMLİ!)
- **Build Command:** `npm run build` (otomatik)
- **Output Directory:** `.next` (otomatik)
- **Install Command:** `npm install` (otomatik)

### 2.4. Environment Variables (Geçici)
**Deploy** butonuna tıklamadan önce:
1. **Environment Variables** sekmesine gidin
2. Şunu ekleyin:
   ```
   Key: NEXT_PUBLIC_API_URL
   Value: http://localhost:5000/api
   Environment: Production, Preview, Development (hepsini seçin)
   ```
3. **Add** tıklayın

### 2.5. Deploy
1. **Deploy** butonuna tıklayın
2. Build işlemini bekleyin (1-2 dakika)
3. Deployment tamamlandığında URL'i kopyalayın:
   ```
   https://prestalink.vercel.app
   ```
   (veya Vercel'in verdiği domain)

---

## ⚙️ ADIM 3: Render Backend Deployment

### 3.1. Render Dashboard
1. https://dashboard.render.com → Login
2. **New +** → **Web Service**

### 3.2. Repository Bağlama
1. GitHub repository'nizi seçin: `prestalink`
2. **Connect** tıklayın

### 3.3. Service Ayarları
- **Name:** `prestalink-backend`
- **Region:** Frankfurt (veya size en yakın)
- **Branch:** `main` (veya ana branch'iniz)
- **Root Directory:** `backend` (ÖNEMLİ!)
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Instance Type:** Free

### 3.4. Environment Variables
**Environment Variables** bölümüne şunları ekleyin:

| Key | Value | Not |
|-----|-------|-----|
| `MONGO_URI` | `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/prestalink?retryWrites=true&w=majority` | MongoDB Atlas'tan aldığınız connection string |
| `JWT_SECRET` | `PrestaLink2024SecretKey!@#$%^&*()` | Güçlü bir rastgele string (32+ karakter) |
| `PORT` | `5000` | Backend port |
| `CLIENT_URL` | `https://prestalink.vercel.app` | Vercel'den aldığınız frontend URL |
| `NODE_ENV` | `production` | Environment |
| `HOST` | `0.0.0.0` | Network binding |

**JWT_SECRET Oluşturma (PowerShell):**
```powershell
-join ((65..90) + (97..122) + (48..57) + (33..47) | Get-Random -Count 40 | ForEach-Object {[char]$_})
```

### 3.5. Deploy
1. **Create Web Service** tıklayın
2. Deployment loglarını izleyin (3-5 dakika)
3. Yeşil ✅ görününce hazır!
4. Backend URL'i kopyalayın:
   ```
   https://prestalink-backend.onrender.com
   ```
   (veya Render'ın verdiği domain)

---

## 🔗 ADIM 4: Frontend ve Backend Bağlantısı

### 4.1. Render'da CLIENT_URL Güncelle
1. Render Dashboard → `prestalink-backend` → **Environment**
2. `CLIENT_URL` değişkenini bulun
3. Değeri Vercel'den aldığınız URL ile güncelleyin:
   ```
   https://prestalink.vercel.app
   ```
4. **Save Changes** → Otomatik redeploy başlar

### 4.2. Vercel'de API URL Güncelle
1. Vercel Dashboard → `prestalink` → **Settings** → **Environment Variables**
2. `NEXT_PUBLIC_API_URL` değişkenini bulun
3. Değeri Render'dan aldığınız URL + `/api` ile güncelleyin:
   ```
   https://prestalink-backend.onrender.com/api
   ```
4. **Save**
5. **Deployments** → Son deployment → **3 nokta** → **Redeploy**

---

## ✅ ADIM 5: Test ve Kontrol

### 5.1. Frontend Test
1. Vercel URL'inizi açın: `https://prestalink.vercel.app`
2. Sayfa yükleniyor mu?
3. Console'da hata var mı? (F12 → Console)

### 5.2. Backend Test
1. Render Dashboard → **Logs** sekmesi
2. Hata var mı kontrol edin
3. Health check: `https://prestalink-backend.onrender.com/api/health`
   - Browser'da açın, `{"status":"ok"}` görmelisiniz

### 5.3. API Bağlantısı Test
1. Frontend'de login sayfasına gidin
2. F12 → **Network** tab
3. Bir işlem yapın (ör: login denemesi)
4. API istekleri görünüyor mu?
5. CORS hatası var mı?

---

## 🔧 Sorun Giderme

### Frontend açılmıyor
- ✅ Vercel Dashboard → Deployments → Build loglarını kontrol edin
- ✅ Environment variables doğru mu?
- ✅ Root Directory `frontend` olarak ayarlı mı?

### Backend bağlanmıyor
- ✅ Render Dashboard → Logs → Hata mesajlarını kontrol edin
- ✅ MONGO_URI doğru mu? (şifre kontrol)
- ✅ MongoDB Atlas → Network Access → `0.0.0.0/0` var mı?

### CORS Hatası
- ✅ Render → CLIENT_URL doğru mu?
- ✅ Vercel → NEXT_PUBLIC_API_URL doğru mu?
- ✅ Her iki tarafta da redeploy yapıldı mı?

### 401 Unauthorized
- ✅ JWT_SECRET doğru mu?
- ✅ Backend loglarını kontrol edin
- ✅ Token gönderiliyor mu? (Network tab)

---

## 🎉 Tamamlandı!

Artık uygulamanız canlıda! 

**Frontend:** `https://prestalink.vercel.app`  
**Backend:** `https://prestalink-backend.onrender.com`

Bu linkleri arkadaşlarınızla paylaşabilirsiniz! 🌍

---

## 📞 Yardım

Sorun yaşarsanız:
1. Build loglarını kontrol edin (Vercel/Render Dashboard)
2. Browser Console'u kontrol edin (F12)
3. Network tab'inde API isteklerini kontrol edin

**BAŞARILAR!** 🚀

