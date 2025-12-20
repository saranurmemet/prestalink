# 🚀 SIFIRDAN DEPLOYMENT REHBERİ

## 📋 ADIM 1: Yeni GitHub Repository Oluşturma

### 1.1. GitHub'da Yeni Repository
1. https://github.com → **Login**
2. Sağ üstte **+** → **New repository**
3. **Repository name:** `prestalink` (veya istediğiniz isim)
4. **Description:** `PrestaLink - Professional Europe Process Management Platform`
5. **Public** veya **Private** seçin (Public önerilir - ücretsiz servisler için)
6. **⚠️ ÖNEMLİ:** 
   - ❌ **Initialize this repository with a README** - İŞARETLEMEYİN
   - ❌ **Add .gitignore** - İŞARETLEMEYİN
   - ❌ **Choose a license** - İŞARETLEMEYİN
7. **Create repository** tıklayın

### 1.2. Repository URL'ini Kopyalayın
Oluşturduktan sonra GitHub size şunu gösterecek:
```
https://github.com/KULLANICI_ADINIZ/prestalink.git
```
**Bu URL'i kopyalayın** (bir sonraki adımda kullanacağız)

---

## 📦 ADIM 2: Projeyi GitHub'a Yükleme

### 2.1. Eski Remote'u Kaldırma (Zaten yapıldı)
```powershell
cd C:\Users\RANDOM\Desktop\prestalink
git remote remove origin
```

### 2.2. Yeni Remote Ekleme
```powershell
git remote add origin https://github.com/KULLANICI_ADINIZ/prestalink.git
```
⚠️ **KULLANICI_ADINIZ** yerine GitHub kullanıcı adınızı yazın

### 2.3. Tüm Değişiklikleri Commit Etme
```powershell
git add .
git commit -m "Initial commit - Ready for deployment with 4 role login, stability improvements, and deployment configs"
```

### 2.4. GitHub'a Push Etme
```powershell
git branch -M main
git push -u origin main
```

**Sorulursa:**
- Username: GitHub kullanıcı adınız
- Password: GitHub Personal Access Token (şifre değil!)

**Personal Access Token oluşturma (gerekirse):**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. **Generate new token (classic)**
3. **Note:** `prestalink-deploy`
4. **Expiration:** 90 days (veya istediğiniz)
5. **Scopes:** `repo` işaretleyin
6. **Generate token**
7. Token'ı kopyalayın (bir daha gösterilmez!)

---

## 🗄️ ADIM 3: MongoDB Atlas (5 dakika)

### 3.1. Hesap Oluşturma
1. https://www.mongodb.com/cloud/atlas → **Try Free**
2. **Sign Up** (Google ile hızlı)
3. Email doğrulama

### 3.2. Free Cluster
1. **Create a Deployment** → **M0 FREE**
2. **Provider:** AWS
3. **Region:** Frankfurt (veya en yakın)
4. **Create Deployment** → 3-5 dakika bekleyin

### 3.3. Database User
1. **Database Access** → **Add New Database User**
2. **Username:** `prestalink`
3. **Password:** Güçlü şifre oluşturun (kaydedin!)
4. **Add User**

### 3.4. Network Access
1. **Network Access** → **Add IP Address**
2. **Allow Access from Anywhere** → `0.0.0.0/0`
3. **Confirm**

### 3.5. Connection String
1. **Database** → Cluster → **Connect**
2. **Connect your application**
3. Connection string'i kopyalayın:
   ```
   mongodb+srv://prestalink:ŞİFRENİZ@cluster0.xxxxx.mongodb.net/prestalink?retryWrites=true&w=majority
   ```
4. **ŞİFRENİZ** yerine gerçek şifreyi yazın
5. **Kaydedin** (Render'da kullanacağız)

---

## 🎨 ADIM 4: Vercel Frontend (10 dakika)

### 4.1. Vercel Hesabı
1. https://vercel.com → **Sign Up**
2. **Continue with GitHub**
3. GitHub'ı yetkilendirin

### 4.2. Proje Oluşturma
1. Vercel Dashboard → **Add New...** → **Project**
2. **Import Git Repository**
3. GitHub repository'nizi seçin: `prestalink`
4. **Import**

### 4.3. Ayarlar
- **Framework Preset:** Next.js (otomatik)
- **Root Directory:** `frontend` ⚠️ **DEĞİŞTİRİN!**
- **Build Command:** `npm run build` (otomatik)
- **Output Directory:** `.next` (otomatik)

### 4.4. Environment Variables (Geçici)
- **Key:** `NEXT_PUBLIC_API_URL`
- **Value:** `http://localhost:5000/api`
- **Environments:** Production, Preview, Development

### 4.5. Deploy
1. **Deploy** tıklayın
2. ⏳ 1-2 dakika bekleyin
3. URL'i kopyalayın: `https://prestalink.vercel.app`

---

## ⚙️ ADIM 5: Render Backend (15 dakika)

### 5.1. Render Hesabı
1. https://dashboard.render.com → **Get Started for Free**
2. **Continue with GitHub**
3. GitHub'ı yetkilendirin

### 5.2. Web Service
1. **New +** → **Web Service**
2. GitHub repository: `prestalink`
3. **Connect**

### 5.3. Ayarlar
- **Name:** `prestalink-backend`
- **Region:** Frankfurt
- **Branch:** `main`
- **Root Directory:** `backend` ⚠️ **ÖNEMLİ!**
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Instance Type:** **Free**

### 5.4. Environment Variables
| Key | Value |
|-----|-------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Rastgele 40+ karakter string |
| `CLIENT_URL` | Vercel URL (örn: https://prestalink.vercel.app) |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `HOST` | `0.0.0.0` |

**JWT_SECRET oluşturma (PowerShell):**
```powershell
-join ((65..90) + (97..122) + (48..57) + (33..47) | Get-Random -Count 40 | ForEach-Object {[char]$_})
```

### 5.5. Deploy
1. **Create Web Service**
2. ⏳ 3-5 dakika bekleyin
3. URL'i kopyalayın: `https://prestalink-backend.onrender.com`

---

## 🔗 ADIM 6: Bağlantı (5 dakika)

### 6.1. Render → CLIENT_URL
1. Render Dashboard → `prestalink-backend` → **Environment**
2. `CLIENT_URL` → **Edit**
3. Vercel URL'i yazın: `https://prestalink.vercel.app`
4. **Save Changes** → Otomatik redeploy

### 6.2. Vercel → API URL
1. Vercel Dashboard → `prestalink` → **Settings** → **Environment Variables**
2. `NEXT_PUBLIC_API_URL` → **Edit**
3. Render URL + `/api`: `https://prestalink-backend.onrender.com/api`
4. **Save**
5. **Deployments** → Son deployment → **Redeploy**

---

## ✅ ADIM 7: Test

1. Frontend: `https://prestalink.vercel.app` → Açılıyor mu?
2. Backend: `https://prestalink-backend.onrender.com/api/health` → `{"status":"ok"}` görünüyor mu?
3. Login sayfası → 4 rol kartı görünüyor mu?

---

## 🎉 TAMAMLANDI!

**Frontend:** `https://prestalink.vercel.app`  
**Backend:** `https://prestalink-backend.onrender.com`

---

## 📝 HIZLI KOMUTLAR

```powershell
# GitHub'a yükleme
cd C:\Users\RANDOM\Desktop\prestalink
git remote add origin https://github.com/KULLANICI_ADINIZ/prestalink.git
git add .
git commit -m "Initial commit - Ready for deployment"
git branch -M main
git push -u origin main
```

**KULLANICI_ADINIZ** yerine GitHub kullanıcı adınızı yazın!


