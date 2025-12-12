# 🚀 Vercel ile Ücretsiz Deployment Rehberi

## 📋 İçindekiler
1. [Hızlı Başlangıç (5 Dakika)](#hızlı-başlangıç)
2. [Detaylı Adım Adım](#detaylı-adımlar)
3. [Backend Deployment (Railway)](#backend-deployment)
4. [Sorun Giderme](#sorun-giderme)

---

## ⚡ Hızlı Başlangıç (5 Dakika)

### Ön Koşullar:
- ✅ GitHub hesabı
- ✅ Node.js yüklü
- ✅ Git yüklü

### Adımlar:

1. **Projeyi GitHub'a yükleyin**
2. **Vercel CLI kurulumu:**
   ```powershell
   npm install -g vercel
   ```
3. **Frontend deploy:**
   ```powershell
   cd frontend
   vercel
   ```
4. **Environment variables ekleyin** (Vercel Dashboard'dan)
5. **Link paylaşın!** 🎉

---

## 📝 Detaylı Adımlar

### ADIM 1: GitHub Repository Oluşturma

#### 1.1. GitHub'da Repository Oluşturun
1. https://github.com → Sign in
2. **New repository** → **Create repository**
3. Repository adı: `prestalink` (veya istediğiniz)
4. **Public** veya **Private** seçin
5. **Create repository**

#### 1.2. Projeyi GitHub'a Yükleyin

**Eğer Git zaten kullanıyorsanız:**
```powershell
cd C:\Users\RANDOM\Desktop\prestalink
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/prestalink.git
git push -u origin main
```

**Eğer Git kullanmıyorsanız:**
```powershell
# Git kurulumu kontrolü
git --version

# Eğer yoksa: https://git-scm.com/download/win
```

---

### ADIM 2: Vercel Hesabı Oluşturma

1. https://vercel.com → **Sign Up**
2. **Continue with GitHub** (önerilen)
3. GitHub hesabınızı yetkilendirin
4. Vercel hesabınız hazır! ✅

---

### ADIM 3: Vercel CLI Kurulumu

```powershell
npm install -g vercel
```

Kurulumu doğrulayın:
```powershell
vercel --version
```

---

### ADIM 4: Frontend Deployment

#### 4.1. Frontend Klasörüne Gidin
```powershell
cd C:\Users\RANDOM\Desktop\prestalink\frontend
```

#### 4.2. Vercel Login
```powershell
vercel login
```
- Tarayıcı açılacak
- **Authorize Vercel** butonuna tıklayın
- Terminal'e geri dönün

#### 4.3. İlk Deploy
```powershell
vercel
```

**Sorular ve Cevaplar:**

1. **Set up and deploy?** 
   → `Y` (Enter)

2. **Which scope?**
   → GitHub kullanıcı adınızı seçin (Enter)

3. **Link to existing project?**
   → `N` (Enter) - İlk deploy için

4. **What's your project's name?**
   → `prestalink` (Enter) veya istediğiniz isim

5. **In which directory is your code located?**
   → `./` (Enter) - Frontend klasöründeyiz

6. **Want to override the settings?**
   → `N` (Enter) - Şimdilik default ayarlar

**Deploy başlar!** 1-2 dakika sürer.

#### 4.4. Production Deploy
İlk deploy preview'dur. Production için:
```powershell
vercel --prod
```

Veya Vercel Dashboard'dan **Promote to Production** yapabilirsiniz.

---

### ADIM 5: Environment Variables Ekleme

#### 5.1. Vercel Dashboard'a Gidin
1. https://vercel.com/dashboard
2. Projenizi seçin: **prestalink**
3. **Settings** → **Environment Variables**

#### 5.2. Environment Variables Ekleyin

**Şimdilik ekleyin:**
```
Key: NEXT_PUBLIC_API_URL
Value: http://localhost:5000/api
Environment: Production, Preview, Development (hepsini seçin)
```

⚠️ **NOT:** Backend deploy edildikten sonra bu değeri güncelleyeceğiz.

**Add** butonuna tıklayın.

#### 5.3. Redeploy
**Deployments** → Son deployment'ın yanındaki **3 nokta** → **Redeploy**

---

### ADIM 6: Backend URL'i Güncelleme

Backend'i deploy ettikten sonra (ADIM 7'de):
1. Vercel Dashboard → **Settings** → **Environment Variables**
2. `NEXT_PUBLIC_API_URL` değerini güncelleyin:
   ```
   https://prestalink-backend-production.up.railway.app/api
   ```
   (Backend URL'iniz farklı olabilir)
3. **Save**
4. **Redeploy**

---

## 🔧 Backend Deployment (Railway.app - Ücretsiz)

### ADIM 7: Railway Hesabı

1. https://railway.app → **Sign Up**
2. **Continue with GitHub**
3. GitHub hesabınızı yetkilendirin

### ADIM 8: MongoDB Atlas (Ücretsiz Cloud DB)

#### 8.1. Atlas Hesabı
1. https://www.mongodb.com/cloud/atlas → **Sign Up** (ücretsiz)
2. **Free tier (M0)** seçin

#### 8.2. Cluster Oluşturma
1. **Create a Deployment** → **M0 FREE** → **Create**
2. Cluster oluşturulmasını bekleyin (3-5 dakika)
3. **Create** butonuna tıklayın

#### 8.3. Database User Oluşturma
1. **Database Access** → **Add New Database User**
2. Username: `prestalink`
3. Password: Güçlü bir şifre (kaydedin!)
4. **Add User**

#### 8.4. Network Access Ayarlama
1. **Network Access** → **Add IP Address**
2. **Allow Access from Anywhere** → IP: `0.0.0.0/0`
3. **Confirm**

#### 8.5. Connection String Alma
1. **Database** → **Connect**
2. **Connect your application**
3. Connection string'i kopyalayın:
   ```
   mongodb+srv://prestalink:ŞİFRENİZ@cluster0.xxxxx.mongodb.net/prestalink?retryWrites=true&w=majority
   ```
   ⚠️ `<password>` yerine oluşturduğunuz şifreyi yazın!

---

### ADIM 9: Railway Backend Deploy

#### 9.1. Yeni Proje
1. Railway Dashboard → **New Project**
2. **Deploy from GitHub repo**
3. GitHub repo'nuzu seçin
4. **Deploy Now**

#### 9.2. Root Directory Ayarlama
1. Projeye tıklayın
2. **Settings** → **Root Directory**
3. Root Directory: `backend`
4. **Save**

#### 9.3. Start Command Ayarlama
1. **Settings** → **Deploy**
2. Start Command: `npm start` veya `node server.js`
3. **Save**

#### 9.4. Environment Variables Ekleme
**Variables** sekmesinde şunları ekleyin:

```
MONGO_URI=mongodb+srv://prestalink:ŞİFRENİZ@cluster0.xxxxx.mongodb.net/prestalink?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-123456
PORT=5000
CLIENT_URL=https://prestalink.vercel.app
NODE_ENV=production
```

⚠️ **ÖNEMLİ:**
- `ŞİFRENİZ` yerine MongoDB şifrenizi yazın
- `CLIENT_URL` yerine Vercel'in verdiği domain'i yazın
- `JWT_SECRET` için güçlü bir rastgele string kullanın

#### 9.5. Domain Oluşturma
1. **Settings** → **Generate Domain**
2. Domain oluşturulur: `prestalink-backend-production.up.railway.app`
3. Bu domain'i kopyalayın

#### 9.6. Deploy Kontrolü
- Railway otomatik deploy eder
- **Deployments** sekmesinden durumu kontrol edin
- Yeşil ✅ görününce hazır!

---

### ADIM 10: Backend ve Frontend Bağlantısı

#### 10.1. Backend CLIENT_URL Güncelle
Railway → **Variables**:
```
CLIENT_URL=https://prestalink.vercel.app
```
(Vercel'in verdiği gerçek domain)

#### 10.2. Frontend API URL Güncelle
Vercel Dashboard → **Settings** → **Environment Variables**:
```
NEXT_PUBLIC_API_URL=https://prestalink-backend-production.up.railway.app/api
```
(Railway'in verdiği domain + /api)

#### 10.3. Redeploy
Her iki tarafta da redeploy yapın:
- **Vercel:** Deployments → Redeploy
- **Railway:** Deployments → Redeploy

---

## 🎉 Tamamlandı!

Artık uygulamanız canlıda! Link:
```
https://prestalink.vercel.app
```

Bu linki arkadaşınıza gönderebilirsiniz! 🌍

---

## 🔍 Sorun Giderme

### Frontend açılmıyor
- ✅ Environment variables doğru mu kontrol edin
- ✅ Redeploy yapın
- ✅ Build loglarını kontrol edin (Vercel Dashboard → Deployments)

### Backend bağlanmıyor
- ✅ MongoDB Atlas cluster çalışıyor mu?
- ✅ Network Access → 0.0.0.0/0 eklendi mi?
- ✅ MONGO_URI doğru mu? (şifre kontrol)
- ✅ CLIENT_URL doğru mu?
- ✅ Railway loglarını kontrol edin

### CORS Hatası
- ✅ Backend'de CLIENT_URL doğru mu?
- ✅ Frontend'de NEXT_PUBLIC_API_URL doğru mu?
- ✅ Her iki tarafta da redeploy yapın

---

## 📊 Ücretsiz Limitler

### Vercel:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ SSL/HTTPS ücretsiz
- ✅ Custom domain eklenebilir

### Railway:
- ✅ $5 kredi/ay (ücretsiz)
- ✅ Çoğu uygulama için yeterli
- ✅ Sleep mode (kullanılmadığında)

### MongoDB Atlas:
- ✅ 512MB storage (ücretsiz)
- ✅ Shared cluster
- ✅ Test için yeterli

---

## 🚀 İleride Yapılacaklar

1. **Custom Domain:**
   - Vercel Dashboard → Settings → Domains
   - Kendi domain'inizi ekleyin

2. **CI/CD:**
   - GitHub'a push edince otomatik deploy
   - Zaten aktif!

3. **Monitoring:**
   - Vercel Analytics ekleyin
   - Railway metrics kullanın

---

## 📞 Yardım

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com

---

**BAŞARILAR!** 🎉





