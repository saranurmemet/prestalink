# 🚀 PRESTALINK DEPLOYMENT REHBERİ

## 📋 Gereksinimler

- GitHub hesabı
- Render.com hesabı (Backend için)
- Vercel hesabı (Frontend için)
- MongoDB Atlas hesabı (Database için)

---

## 1️⃣ MONGODB ATLAS KURULUMU

### Adım 1: MongoDB Atlas Hesabı
1. https://www.mongodb.com/cloud/atlas/register adresinden kayıt olun
2. "Create a New Cluster" seçeneğini tıklayın
3. **FREE** tier'ı seçin (M0 Sandbox)
4. **Region:** Europe (Frankfurt veya Ireland)
5. Cluster Name: `prestalink-db`
6. "Create Cluster" tıklayın

### Adım 2: Database User Oluşturma
1. Sol menüden **Database Access** tıklayın
2. **Add New Database User** tıklayın
3. Authentication Method: **Password**
4. Username: `prestalink-admin`
5. Password: Güçlü bir şifre oluşturun (kaydedin!)
6. Database User Privileges: **Read and write to any database**
7. "Add User" tıklayın

### Adım 3: Network Access Ayarlama
1. Sol menüden **Network Access** tıklayın
2. **Add IP Address** tıklayın
3. **Allow Access from Anywhere** seçin (0.0.0.0/0)
4. "Confirm" tıklayın

### Adım 4: Connection String Alma
1. Sol menüden **Database** (Clusters) tıklayın
2. Cluster'ınızın yanındaki **Connect** butonuna tıklayın
3. **Connect your application** seçin
4. Driver: **Node.js**, Version: **5.5 or later**
5. Connection string'i kopyalayın:
```
mongodb+srv://prestalink-admin:<password>@prestalink-db.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
6. `<password>` yerine oluşturduğunuz şifreyi yazın
7. URL'nin sonuna database adı ekleyin: `/prestalink`

**Final Connection String:**
```
mongodb+srv://prestalink-admin:SIFRENI_BURAYA@prestalink-db.xxxxx.mongodb.net/prestalink?retryWrites=true&w=majority
```

---

## 2️⃣ BACKEND DEPLOYMENT (Render.com)

### Adım 1: GitHub'a Push
```powershell
# Git repository oluştur (henüz yoksa)
git init
git add .
git commit -m "Initial commit - Ready for deployment"

# GitHub'da yeni repo oluştur: prestalink
# Sonra:
git remote add origin https://github.com/KULLANICI_ADIN/prestalink.git
git branch -M main
git push -u origin main
```

### Adım 2: Render.com'da Proje Oluşturma
1. https://render.com adresine gidin ve GitHub ile login olun
2. Dashboard'da **New +** → **Web Service** tıklayın
3. GitHub repository'nizi seçin: `prestalink`
4. Ayarlar:
   - **Name:** `prestalink-backend`
   - **Region:** Frankfurt (Europe)
   - **Root Directory:** `backend`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free

### Adım 3: Environment Variables Ekleme
**Environment** sekmesinden şu değişkenleri ekleyin:

```
NODE_ENV=production
MONGO_URI=mongodb+srv://prestalink-admin:SIFRE@prestalink-db.xxxxx.mongodb.net/prestalink?retryWrites=true&w=majority
JWT_SECRET=super-gizli-jwt-secret-key-2024-prestalink-12345678
CLIENT_URL=https://prestalink.vercel.app,https://prestalink-git-main-kullanici.vercel.app
PORT=5000
```

### Adım 4: Deploy
1. **Create Web Service** butonuna tıklayın
2. Deploy başlayacak (5-10 dakika sürer)
3. Deploy tamamlandığında URL'iniz hazır olacak:
   - `https://prestalink-backend.onrender.com`

### Adım 5: Test
```powershell
# API'yi test edin
curl https://prestalink-backend.onrender.com/api/jobs
```

---

## 3️⃣ FRONTEND DEPLOYMENT (Vercel)

### Adım 1: Environment Variables Hazırlama
Frontend klasöründe `.env.production` dosyası oluşturun:

```powershell
cd frontend
New-Item -ItemType File -Name .env.production -Force
```

İçeriği:
```env
NEXT_PUBLIC_API_URL=https://prestalink-backend.onrender.com/api
```

### Adım 2: Vercel CLI ile Deploy (Önerilen)
```powershell
# Vercel CLI yükleyin (global)
npm install -g vercel

# Frontend klasörüne gidin
cd frontend

# Vercel'e login olun
vercel login

# Deploy
vercel
```

Sorulacak sorular:
- Set up and deploy: **Y**
- Which scope: Kendi hesabınızı seçin
- Link to existing project: **N**
- Project name: `prestalink`
- Directory: **. (default)**
- Want to modify settings: **N**

### Adım 3: Production Deploy
```powershell
vercel --prod
```

### Adım 4: Vercel Dashboard Ayarları
1. https://vercel.com/dashboard adresine gidin
2. `prestalink` projenizi seçin
3. **Settings** → **Environment Variables**
4. Ekleyin:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://prestalink-backend.onrender.com/api`
   - Environments: Production, Preview, Development (hepsi seçili)

### Adım 5: Domain (Opsiyonel)
Kendi domain'inizi bağlayabilirsiniz:
1. Settings → Domains
2. Domain ekleyin (örn: prestalink.app)
3. DNS ayarlarını yapın

**Vercel URL:** `https://prestalink.vercel.app`

---

## 4️⃣ BACKEND CLIENT_URL GÜNCELLEMESİ

Frontend deploy olduktan sonra backend'deki CLIENT_URL'i güncelleyin:

1. Render Dashboard → `prestalink-backend` → Environment
2. `CLIENT_URL` değişkenini düzenleyin:
```
https://prestalink.vercel.app
```
3. **Save Changes** → Otomatik redeploy olacak

---

## 5️⃣ TEST KULLANICILARI OLUŞTURMA

Production database'de test kullanıcıları oluşturun:

```powershell
# Backend klasöründe .env.production oluşturun
cd backend
New-Item -ItemType File -Name .env.production -Force
```

İçeriği:
```env
MONGO_URI=mongodb+srv://prestalink-admin:SIFRE@prestalink-db.xxxxx.mongodb.net/prestalink?retryWrites=true&w=majority
JWT_SECRET=super-gizli-jwt-secret-key-2024-prestalink-12345678
```

Sonra:
```powershell
# Production environment ile script çalıştır
node -r dotenv/config scripts/create-test-users.js dotenv_config_path=.env.production
node -r dotenv/config scripts/setup-demo-user.js dotenv_config_path=.env.production
node -r dotenv/config scripts/create-demo-notifications.js dotenv_config_path=.env.production
```

---

## 6️⃣ FINAL CHECKS

### ✅ Kontrol Listesi

1. **MongoDB Atlas:**
   - [ ] Cluster oluşturuldu
   - [ ] Database user oluşturuldu
   - [ ] Network access ayarlandı (0.0.0.0/0)
   - [ ] Connection string alındı

2. **Backend (Render):**
   - [ ] GitHub'a push edildi
   - [ ] Render'da web service oluşturuldu
   - [ ] Environment variables eklendi
   - [ ] Deploy başarılı (yeşil tick)
   - [ ] API test edildi

3. **Frontend (Vercel):**
   - [ ] Vercel CLI ile deploy edildi
   - [ ] Environment variables eklendi
   - [ ] Production deploy yapıldı
   - [ ] Site açılıyor

4. **Integration:**
   - [ ] Frontend backend'e bağlanıyor
   - [ ] Login çalışıyor
   - [ ] Database'e veri yazılıyor
   - [ ] Test kullanıcılar oluşturuldu

### Test URL'leri
- **Frontend:** https://prestalink.vercel.app
- **Backend:** https://prestalink-backend.onrender.com
- **API Test:** https://prestalink-backend.onrender.com/api/jobs

---

## 🔧 SORUN GİDERME

### Backend Hatası
1. Render Dashboard → Logs kontrol edin
2. Environment variables doğru mu kontrol edin
3. MongoDB connection string'i test edin

### Frontend Hatası
1. Vercel Dashboard → Logs kontrol edin
2. Build logs'u inceleyin
3. Browser console'da network errors kontrol edin

### CORS Hatası
Backend'de `CLIENT_URL` environment variable'ı frontend URL'ini içermeli

---

## 📝 NOTLAR

- **Free Tier Limitler:**
  - Render: 750 saat/ay (yeterli)
  - Vercel: Unlimited deployments
  - MongoDB Atlas: 512MB storage (başlangıç için yeterli)

- **Cold Start:**
  - Render free tier'da 15 dakika inaktivite sonrası sleep mode
  - İlk istek 30-60 saniye sürebilir

- **Production Monitoring:**
  - Render: Built-in metrics
  - Vercel: Analytics (ücretsiz)
  - MongoDB Atlas: Performance monitoring

---

## 🎯 YATIRIMCI SUNUMU İÇİN

Demo kullanıcı bilgileri:
- **Email:** mehmet@prestalink.app
- **Şifre:** mehmet
- **Profil:** Tam dolu, CV yüklü, 3 başvuru, 6 bildirim

**Sunum Senaryosu:**
1. Ana sayfayı göster (yeni tasarım)
2. Login ol (mehmet)
3. Dashboard'u göster (profil fotoğrafı, istatistikler)
4. CV'yi göster
5. Bildirimleri göster
6. Başvuruları göster
7. İş ilanlarını göster

---

## 🚀 HIZLI DEPLOYMENT

Tek komutla deploy (her şey hazırsa):

```powershell
# Backend + Frontend deploy
.\scripts\quick-deploy.ps1
```

Ya da manuel:
```powershell
# Backend
git add .
git commit -m "Production ready"
git push origin main

# Frontend
cd frontend
vercel --prod
```

---

İyi şanslar! 🎉
