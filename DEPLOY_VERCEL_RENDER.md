# 🚀 Vercel + Render Deployment Rehberi

## 📋 Hızlı Başlangıç

Bu rehber PrestaLink uygulamasını **Vercel** (Frontend) ve **Render** (Backend) üzerinde deploy etmek için hazırlanmıştır.

---

## 🎯 ÖN KOŞULLAR

- ✅ GitHub hesabı
- ✅ MongoDB Atlas hesabı (ücretsiz)
- ✅ Vercel hesabı (ücretsiz)
- ✅ Render hesabı (ücretsiz)

---

## 📦 ADIM 1: MongoDB Atlas Kurulumu

### 1.1. MongoDB Atlas Hesabı
1. https://www.mongodb.com/cloud/atlas → **Sign Up** (ücretsiz)
2. **Free tier (M0)** seçin
3. Hesap oluşturun

### 1.2. Cluster Oluşturma
1. **Create a Deployment** → **M0 FREE** → **Create**
2. Cluster oluşturulmasını bekleyin (3-5 dakika)
3. **Create** butonuna tıklayın

### 1.3. Database User
1. **Database Access** → **Add New Database User**
2. Username: `prestalink`
3. Password: Güçlü bir şifre oluşturun (kaydedin!)
4. **Add User**

### 1.4. Network Access
1. **Network Access** → **Add IP Address**
2. **Allow Access from Anywhere** → IP: `0.0.0.0/0`
3. **Confirm**

### 1.5. Connection String
1. **Database** → **Connect**
2. **Connect your application**
3. Connection string'i kopyalayın:
   ```
   mongodb+srv://prestalink:ŞİFRENİZ@cluster0.xxxxx.mongodb.net/prestalink?retryWrites=true&w=majority
   ```
   ⚠️ `<password>` yerine oluşturduğunuz şifreyi yazın!

---

## 🎨 ADIM 2: Frontend Deployment (Vercel)

### 2.1. Vercel Hesabı
1. https://vercel.com → **Sign Up**
2. **Continue with GitHub** (önerilen)
3. GitHub hesabınızı yetkilendirin

### 2.2. Vercel CLI Kurulumu
```powershell
npm install -g vercel
```

Kurulumu doğrulayın:
```powershell
vercel --version
```

### 2.3. Frontend Deploy
```powershell
cd frontend
vercel login
vercel
```

**Sorular:**
- **Set up and deploy?** → `Y`
- **Which scope?** → GitHub kullanıcı adınızı seçin
- **Link to existing project?** → `N`
- **What's your project's name?** → `prestalink`
- **In which directory is your code located?** → `./`
- **Want to override the settings?** → `N`

### 2.4. Production Deploy
```powershell
vercel --prod
```

Veya Vercel Dashboard'dan **Promote to Production** yapabilirsiniz.

### 2.5. Environment Variables (Geçici)
Vercel Dashboard → **Settings** → **Environment Variables**:
```
Key: NEXT_PUBLIC_API_URL
Value: http://localhost:5000/api
Environment: Production, Preview, Development (hepsini seçin)
```

⚠️ **NOT:** Backend deploy edildikten sonra bu değeri güncelleyeceğiz.

**Redeploy:** Deployments → Son deployment → **Redeploy**

---

## ⚙️ ADIM 3: Backend Deployment (Render)

### 3.1. Render Hesabı
1. https://dashboard.render.com → **Get Started for Free**
2. GitHub hesabınızla giriş yapın

### 3.2. Web Service Oluşturma
1. **New +** → **Web Service**
2. GitHub repository'nizi seçin: `prestalink`
3. **Connect** tıklayın

### 3.3. Service Ayarları
- **Name:** `prestalink-backend`
- **Region:** Frankfurt (veya en yakın)
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Instance Type:** Free

### 3.4. Environment Variables
**Environment Variables** bölümüne ekleyin:

| Key | Value | Açıklama |
|-----|-------|----------|
| `MONGO_URI` | `mongodb+srv://prestalink:ŞİFRENİZ@cluster0.xxxxx.mongodb.net/prestalink?retryWrites=true&w=majority` | MongoDB connection string |
| `JWT_SECRET` | `RastgeleGüvenliString123!456789` | Güvenli rastgele string (32+ karakter) |
| `PORT` | `5000` | Backend port |
| `CLIENT_URL` | `https://prestalink.vercel.app` | Frontend URL (Vercel'den alacağınız) |
| `NODE_ENV` | `production` | Environment |
| `HOST` | `0.0.0.0` | Network binding |

**JWT_SECRET Oluşturma (PowerShell):**
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### 3.5. Deploy
1. **Create Web Service** tıklayın
2. Deployment loglarını izleyin (3-5 dakika)
3. Yeşil ✅ görününce hazır!

**Backend URL:** `https://prestalink-backend.onrender.com` (veya Render'ın verdiği domain)

---

## 🔗 ADIM 4: Frontend ve Backend Bağlantısı

### 4.1. Backend CLIENT_URL Güncelle
Render Dashboard → **Environment** → `CLIENT_URL`:
```
https://prestalink.vercel.app
```
(Vercel'in verdiği gerçek domain)

**Save Changes** → Otomatik redeploy olacak

### 4.2. Frontend API URL Güncelle
Vercel Dashboard → **Settings** → **Environment Variables**:
```
Key: NEXT_PUBLIC_API_URL
Value: https://prestalink-backend.onrender.com/api
```
(Render'ın verdiği domain + `/api`)

**Save** → **Redeploy**

---

## ✅ ADIM 5: Test

### 5.1. Frontend Kontrolü
1. Vercel URL'inizi açın: `https://prestalink.vercel.app`
2. Sayfa yükleniyor mu kontrol edin
3. Console'da hata var mı kontrol edin (F12)

### 5.2. Backend Kontrolü
1. Render Dashboard → **Logs** sekmesi
2. Hata var mı kontrol edin
3. Health check: `https://prestalink-backend.onrender.com/api/health`

### 5.3. API Bağlantısı
1. Frontend'de login sayfasına gidin
2. Network tab'inde (F12) API isteklerini kontrol edin
3. CORS hatası var mı kontrol edin

---

## 🔧 Sorun Giderme

### Frontend açılmıyor
- ✅ Environment variables doğru mu kontrol edin
- ✅ Redeploy yapın
- ✅ Build loglarını kontrol edin (Vercel Dashboard → Deployments)

### Backend bağlanmıyor
- ✅ MongoDB Atlas cluster çalışıyor mu?
- ✅ Network Access → 0.0.0.0/0 eklendi mi?
- ✅ MONGO_URI doğru mu? (şifre kontrol)
- ✅ CLIENT_URL doğru mu?
- ✅ Render loglarını kontrol edin

### CORS Hatası
- ✅ Backend'de CLIENT_URL doğru mu?
- ✅ Frontend'de NEXT_PUBLIC_API_URL doğru mu?
- ✅ Her iki tarafta da redeploy yapın

### 401 Unauthorized
- ✅ JWT_SECRET doğru mu?
- ✅ Token gönderiliyor mu? (Network tab)
- ✅ Backend loglarını kontrol edin

---

## 📊 Ücretsiz Limitler

### Vercel:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ SSL/HTTPS ücretsiz
- ✅ Custom domain eklenebilir

### Render:
- ✅ Free tier: 750 saat/ay
- ✅ Sleep mode (kullanılmadığında)
- ✅ SSL/HTTPS ücretsiz

### MongoDB Atlas:
- ✅ 512MB storage (ücretsiz)
- ✅ Shared cluster
- ✅ Test için yeterli

---

## 🎉 Tamamlandı!

Artık uygulamanız canlıda! Link:
```
https://prestalink.vercel.app
```

Bu linki arkadaşınıza gönderebilirsiniz! 🌍

---

## 📞 Yardım

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com

**BAŞARILAR!** 🎉


