# 🚀 ÜCRETSİZ DEPLOYMENT REHBERİ - ADIM ADIM

## 📋 GENEL BAKIŞ

Bu rehber **tamamen ücretsiz** servisler kullanarak PrestaLink'i deploy etmek için hazırlanmıştır:
- ✅ **Vercel** (Frontend) - Ücretsiz, sınırsız
- ✅ **Render** (Backend) - Ücretsiz tier (750 saat/ay)
- ✅ **MongoDB Atlas** (Database) - Ücretsiz M0 cluster

**Toplam Maliyet: $0** 💰

---

## 🎯 ADIM 1: MongoDB Atlas (5 dakika)

### 1.1. Hesap Oluşturma
1. https://www.mongodb.com/cloud/atlas → **Try Free** tıklayın
2. **Sign Up** ile hesap oluşturun (Google ile hızlı)
3. Email doğrulama yapın

### 1.2. Free Cluster Oluşturma
1. **Create a Deployment** butonuna tıklayın
2. **M0 FREE** seçeneğini seçin (512MB, ücretsiz)
3. **Provider:** AWS (veya istediğiniz)
4. **Region:** En yakın bölgeyi seçin (örn: Frankfurt)
5. **Cluster Name:** `prestalink-cluster` (veya istediğiniz)
6. **Create Deployment** tıklayın
7. ⏳ **3-5 dakika bekleyin** (cluster oluşturuluyor)

### 1.3. Database User Oluşturma
1. Sol menüden **Database Access** → **Add New Database User**
2. **Authentication Method:** Password
3. **Username:** `prestalink`
4. **Password:** Güçlü bir şifre oluşturun (kaydedin!)
   - Örnek: `PrestaLink2024!Secure`
5. **Database User Privileges:** Atlas admin (varsayılan)
6. **Add User** tıklayın

### 1.4. Network Access (ÖNEMLİ!)
1. Sol menüden **Network Access** → **Add IP Address**
2. **Add Current IP Address** tıklayın (kendi IP'niz için)
3. **Add IP Address** → **Allow Access from Anywhere**
   - IP Address: `0.0.0.0/0`
   - Comment: `Allow all IPs for Render`
4. **Confirm** tıklayın

### 1.5. Connection String Alma
1. Sol menüden **Database** → Cluster'ınıza tıklayın
2. **Connect** butonuna tıklayın
3. **Connect your application** seçeneğini seçin
4. **Driver:** Node.js, **Version:** 5.5 or later
5. Connection string'i kopyalayın:
   ```
   mongodb+srv://prestalink:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **ÖNEMLİ:** `<password>` yerine 1.3'te oluşturduğunuz şifreyi yazın
7. Sonuna database adını ekleyin: `...mongodb.net/prestalink?retryWrites=true&w=majority`
8. **Tam connection string örneği:**
   ```
   mongodb+srv://prestalink:PrestaLink2024!Secure@cluster0.xxxxx.mongodb.net/prestalink?retryWrites=true&w=majority
   ```
9. **Bu string'i bir yere kaydedin** (Render'da kullanacağız)

---

## 🎨 ADIM 2: Vercel Frontend (10 dakika)

### 2.1. Vercel Hesabı
1. https://vercel.com → **Sign Up**
2. **Continue with GitHub** tıklayın (önerilen)
3. GitHub hesabınızı yetkilendirin
4. Vercel hesabınız hazır! ✅

### 2.2. GitHub Repository Hazırlığı
**Eğer projeniz GitHub'da yoksa:**

1. https://github.com → **New repository**
2. Repository name: `prestalink`
3. **Public** veya **Private** seçin
4. **Create repository**

**Projeyi GitHub'a yükleyin:**
```powershell
cd C:\Users\RANDOM\Desktop\prestalink
git init
git add .
git commit -m "Initial commit - Ready for deployment"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/prestalink.git
git push -u origin main
```

### 2.3. Vercel'de Proje Oluşturma
1. https://vercel.com/dashboard → **Add New...** → **Project**
2. **Import Git Repository** → GitHub repository'nizi seçin: `prestalink`
3. **Import** tıklayın

### 2.4. Vercel Project Ayarları
**ÖNEMLİ AYARLAR:**

- **Framework Preset:** Next.js (otomatik algılanır)
- **Root Directory:** `frontend` ⚠️ **DEĞİŞTİRİN!**
  - Varsayılan: `.` (root)
  - **Yeni değer:** `frontend` yazın
- **Build Command:** `npm run build` (otomatik)
- **Output Directory:** `.next` (otomatik)
- **Install Command:** `npm install` (otomatik)

### 2.5. Environment Variables (Geçici)
**Deploy butonuna tıklamadan önce:**

1. **Environment Variables** sekmesine gidin
2. **Add** butonuna tıklayın
3. Şunu ekleyin:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `http://localhost:5000/api` (geçici, sonra güncelleyeceğiz)
   - **Environments:** Production, Preview, Development (hepsini seçin)
4. **Save** tıklayın

### 2.6. Deploy
1. **Deploy** butonuna tıklayın
2. ⏳ Build işlemini bekleyin (1-2 dakika)
3. ✅ Deployment tamamlandığında:
   - **Visit** butonuna tıklayın veya
   - URL'i kopyalayın: `https://prestalink.vercel.app` (veya Vercel'in verdiği domain)
4. **Bu URL'i bir yere kaydedin** (Render'da kullanacağız)

---

## ⚙️ ADIM 3: Render Backend (15 dakika)

### 3.1. Render Hesabı
1. https://dashboard.render.com → **Get Started for Free**
2. **Continue with GitHub** tıklayın
3. GitHub hesabınızı yetkilendirin
4. Render hesabınız hazır! ✅

### 3.2. Web Service Oluşturma
1. Render Dashboard → **New +** → **Web Service**
2. **Connect account** (ilk seferinde) veya
3. GitHub repository'nizi seçin: `prestalink`
4. **Connect** tıklayın

### 3.3. Service Ayarları
**Aşağıdaki ayarları yapın:**

- **Name:** `prestalink-backend`
- **Region:** Frankfurt (veya size en yakın)
- **Branch:** `main` (veya ana branch'iniz)
- **Root Directory:** `backend` ⚠️ **ÖNEMLİ!**
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Instance Type:** **Free** (ücretsiz)

### 3.4. Environment Variables
**Environment Variables** bölümüne şunları ekleyin:

#### 3.4.1. MONGO_URI
- **Key:** `MONGO_URI`
- **Value:** MongoDB Atlas'tan aldığınız connection string
  ```
  mongodb+srv://prestalink:ŞİFRENİZ@cluster0.xxxxx.mongodb.net/prestalink?retryWrites=true&w=majority
  ```
- **Add** tıklayın

#### 3.4.2. JWT_SECRET
**PowerShell'de güçlü bir secret oluşturun:**
```powershell
-join ((65..90) + (97..122) + (48..57) + (33..47) | Get-Random -Count 40 | ForEach-Object {[char]$_})
```

- **Key:** `JWT_SECRET`
- **Value:** Oluşturduğunuz rastgele string (40+ karakter)
- **Add** tıklayın

#### 3.4.3. CLIENT_URL
- **Key:** `CLIENT_URL`
- **Value:** Vercel'den aldığınız frontend URL
  ```
  https://prestalink.vercel.app
  ```
- **Add** tıklayın

#### 3.4.4. NODE_ENV
- **Key:** `NODE_ENV`
- **Value:** `production`
- **Add** tıklayın

#### 3.4.5. PORT
- **Key:** `PORT`
- **Value:** `5000`
- **Add** tıklayın

#### 3.4.6. HOST
- **Key:** `HOST`
- **Value:** `0.0.0.0`
- **Add** tıklayın

### 3.5. Deploy
1. **Create Web Service** tıklayın
2. ⏳ Deployment başlar (3-5 dakika)
3. **Logs** sekmesinden ilerlemeyi izleyin
4. ✅ Yeşil "Live" görününce hazır!
5. Backend URL'i kopyalayın: `https://prestalink-backend.onrender.com` (veya Render'ın verdiği domain)
6. **Bu URL'i bir yere kaydedin**

---

## 🔗 ADIM 4: Frontend ve Backend Bağlantısı (5 dakika)

### 4.1. Render'da CLIENT_URL Güncelle
1. Render Dashboard → `prestalink-backend` → **Environment** sekmesi
2. `CLIENT_URL` değişkenini bulun
3. **Edit** tıklayın
4. Değeri Vercel'den aldığınız URL ile güncelleyin:
   ```
   https://prestalink.vercel.app
   ```
5. **Save Changes** tıklayın
6. ⏳ Otomatik redeploy başlar (2-3 dakika)

### 4.2. Vercel'de API URL Güncelle
1. Vercel Dashboard → `prestalink` → **Settings** → **Environment Variables**
2. `NEXT_PUBLIC_API_URL` değişkenini bulun
3. **Edit** tıklayın
4. Değeri Render'dan aldığınız URL + `/api` ile güncelleyin:
   ```
   https://prestalink-backend.onrender.com/api
   ```
5. **Save** tıklayın
6. **Deployments** sekmesine gidin
7. Son deployment'ın yanındaki **3 nokta** → **Redeploy**
8. ⏳ Redeploy işlemini bekleyin (1-2 dakika)

---

## ✅ ADIM 5: Test ve Kontrol (5 dakika)

### 5.1. Frontend Test
1. Vercel URL'inizi açın: `https://prestalink.vercel.app`
2. Sayfa yükleniyor mu? ✅
3. Console'u açın (F12 → Console)
4. Hata var mı kontrol edin

### 5.2. Backend Test
1. Render Dashboard → **Logs** sekmesi
2. Hata var mı kontrol edin
3. Health check: `https://prestalink-backend.onrender.com/api/health`
   - Browser'da açın
   - `{"status":"ok"}` görmelisiniz ✅

### 5.3. API Bağlantısı Test
1. Frontend'de login sayfasına gidin
2. F12 → **Network** tab
3. Bir rol kartına tıklayın
4. Email ve şifre girin (test için)
5. API istekleri görünüyor mu? ✅
6. CORS hatası var mı? ❌ (olmamalı)

---

## 🎉 TAMAMLANDI!

Artık uygulamanız canlıda! 

**Frontend:** `https://prestalink.vercel.app`  
**Backend:** `https://prestalink-backend.onrender.com`

Bu linkleri arkadaşlarınızla paylaşabilirsiniz! 🌍

---

## 🔧 SORUN GİDERME

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

## 📊 ÜCRETSİZ LİMİTLER

### Vercel (Frontend)
- ✅ **Sınırsız** deployments
- ✅ **100GB** bandwidth/ay
- ✅ **SSL/HTTPS** ücretsiz
- ✅ Custom domain eklenebilir
- ✅ **Yeterli:** Çoğu proje için fazlasıyla yeterli

### Render (Backend)
- ✅ **750 saat/ay** ücretsiz (31 gün × 24 saat = 744 saat)
- ✅ **Sleep mode:** 15 dakika kullanılmazsa uykuya geçer
- ✅ İlk istekte 30-60 saniye uyanma süresi
- ✅ **SSL/HTTPS** ücretsiz
- ⚠️ **Not:** Sleep mode için ilk istek yavaş olabilir

### MongoDB Atlas
- ✅ **512MB** storage (ücretsiz)
- ✅ Shared cluster
- ✅ **Yeterli:** Test ve küçük projeler için yeterli

---

## 💡 İPUÇLARI

### Render Sleep Mode
- İlk istek 30-60 saniye sürebilir (uyanma)
- Sonraki istekler hızlıdır
- Sleep mode'u kapatmak için ücretli plan gerekir

### MongoDB Atlas
- 512MB yeterli değilse ücretli plana geçebilirsiniz
- Veya başka bir ücretsiz MongoDB servisi kullanabilirsiniz

### Vercel
- Custom domain ekleyebilirsiniz (ücretsiz)
- Analytics ekleyebilirsiniz (ücretsiz)

---

## 📞 YARDIM

Sorun yaşarsanız:
1. Build loglarını kontrol edin (Vercel/Render Dashboard)
2. Browser Console'u kontrol edin (F12)
3. Network tab'inde API isteklerini kontrol edin

**BAŞARILAR!** 🚀


