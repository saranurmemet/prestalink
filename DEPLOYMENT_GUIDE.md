# PrestaLink Otomatik Deployment Rehberi

Bu rehber PrestaLink uygulamasını production ortamına deploy etmek için gerekli tüm adımları içerir.

## 📋 İçindekiler

1. [Ön Gereksinimler](#ön-gereksinimler)
2. [GitHub Repository Oluşturma](#github-repository-oluşturma)
3. [MongoDB Atlas Kurulumu](#mongodb-atlas-kurulumu)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Backend Deployment (Render)](#backend-deployment-render)
6. [Environment Variables](#environment-variables)
7. [Son Kontroller](#son-kontroller)

---

## Ön Gereksinimler

- Node.js (v16+) kurulu
- npm veya yarn
- GitHub hesabı
- Vercel hesabı (ücretsiz)
- Render hesabı (ücretsiz)
- MongoDB Atlas hesabı (ücretsiz)

---

## GitHub Repository Oluşturma

### Yöntem 1: GitHub CLI ile (Önerilen)

```powershell
# GitHub CLI kurulumu (eğer yoksa)
winget install --id GitHub.cli

# GitHub'a giriş yap
gh auth login

# Repository oluştur ve push et
cd C:\Users\RANDOM\Desktop\prestalink
git init
git add .
git commit -m "Initial commit: PrestaLink deployment ready"
gh repo create PrestaLink --public --source=. --remote=origin --push
```

### Yöntem 2: Manuel (Web Arayüzü)

1. https://github.com/new adresine gidin
2. Repository name: `PrestaLink`
3. Public seçin
4. "Create repository" tıklayın
5. Terminal'de şu komutları çalıştırın:

```powershell
cd C:\Users\RANDOM\Desktop\prestalink
git init
git add .
git commit -m "Initial commit: PrestaLink deployment ready"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/PrestaLink.git
git push -u origin main
```

---

## MongoDB Atlas Kurulumu

### 1. Cluster Oluşturma

1. https://www.mongodb.com/cloud/atlas adresine gidin
2. "Try Free" butonuna tıklayın
3. Hesap oluşturun (Google ile giriş yapabilirsiniz)
4. "Create a Deployment" seçin
5. "M0 FREE" (Shared) seçin
6. Cloud Provider: AWS (veya tercih ettiğiniz)
7. Region: En yakın bölgeyi seçin
8. Cluster Name: `prestalink-cluster` (veya istediğiniz isim)
9. "Create Deployment" tıklayın

### 2. Database User Oluşturma

1. "Create Database User" seçin
2. Authentication Method: Password
3. Username: `prestalink-admin` (veya istediğiniz)
4. Password: Güvenli bir şifre oluşturun (SAKLAYIN!)
5. "Create Database User" tıklayın

### 3. Network Access Ayarlama

1. "Add My Current IP Address" tıklayın (development için)
2. Production için: "Allow Access from Anywhere" seçin
   - IP Address: `0.0.0.0/0`
   - Comment: "Allow all IPs for Render deployment"
3. "Confirm" tıklayın

### 4. Connection String Alma

1. "Connect" butonuna tıklayın
2. "Drivers" seçin
3. Driver: Node.js
4. Version: 5.5 veya üzeri
5. Connection string'i kopyalayın

**Connection string formatı:**
```
mongodb+srv://prestalink-admin:<PASSWORD>@prestalink-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**ÖNEMLİ:** `<PASSWORD>` kısmını gerçek şifrenizle değiştirin!

**Database adını ekleyin:**
```
mongodb+srv://prestalink-admin:PASSWORD@prestalink-cluster.xxxxx.mongodb.net/prestalink?retryWrites=true&w=majority
```

Bu connection string'i Render environment variables'a ekleyeceksiniz.

---

## Frontend Deployment (Vercel)

### Otomatik Yöntem (CLI)

```powershell
cd C:\Users\RANDOM\Desktop\prestalink\frontend
vercel login
vercel --yes
```

Sorular:
- **Set up and deploy?** → `Y`
- **Which scope?** → Kendi hesabınızı seçin
- **Link to existing project?** → `N`
- **What's your project's name?** → `prestalink` (veya Enter)
- **In which directory is your code located?** → `./` (Enter)
- **Want to override the settings?** → `N`

Deployment tamamlandıktan sonra Vercel URL'iniz:
```
https://prestalink.vercel.app
```
(veya vercel tarafından atanan URL)

### Manuel Yöntem (Web Arayüzü)

1. https://vercel.com/new adresine gidin
2. GitHub repository'nizi import edin
3. Root Directory: `frontend` seçin
4. Framework Preset: Next.js (otomatik algılanır)
5. Build Command: `npm run build` (otomatik)
6. Output Directory: `.next` (otomatik)
7. "Deploy" tıklayın

### Environment Variables Ekleme (ÖNEMLİ!)

Vercel deployment sonrası:

1. Vercel Dashboard > PrestaLink Project > Settings > Environment Variables
2. Şu değişkeni ekleyin:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://prestalink-backend.onrender.com/api` (Render backend URL'iniz)
   - **Environment:** Production, Preview, Development (hepsini seçin)
3. "Save" tıklayın
4. **Redeploy yapın:** Deployments > En son deployment > "..." > Redeploy

---

## Backend Deployment (Render)

### 1. Render Dashboard'a Giriş

1. https://dashboard.render.com adresine gidin
2. "Get Started for Free" ile GitHub hesabınızla giriş yapın

### 2. Web Service Oluşturma

1. "New +" butonuna tıklayın
2. "Web Service" seçin
3. GitHub repository'nizi bağlayın:
   - "Connect account" (ilk seferinde)
   - Repository: `PrestaLink` seçin
   - "Connect" tıklayın

### 3. Web Service Ayarları

- **Name:** `prestalink-backend`
- **Region:** En yakın bölge (örn: Frankfurt)
- **Branch:** `main` (veya ana branch'iniz)
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Instance Type:** Free (veya ücretli plan)

### 4. Environment Variables Ekleme

**Environment Variables** bölümüne şunları ekleyin:

| Key | Value | Açıklama |
|-----|-------|----------|
| `MONGO_URI` | `mongodb+srv://...` | MongoDB Atlas connection string (yukarıda aldığınız) |
| `JWT_SECRET` | `RastgeleGüvenliString123!` | Güvenli rastgele string (32+ karakter) |
| `PORT` | `5000` | Backend port |
| `CLIENT_URL` | `https://prestalink.vercel.app` | Frontend URL'iniz (Vercel) |
| `NODE_ENV` | `production` | Environment |
| `HOST` | `0.0.0.0` | Network binding |

**JWT_SECRET oluşturma:**
```powershell
# PowerShell'de:
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

Veya online: https://randomkeygen.com/ (CodeIgniter Encryption Keys)

### 5. Deploy

1. "Create Web Service" tıklayın
2. Render otomatik olarak build ve deploy başlatacak
3. Logları izleyin (3-5 dakika sürebilir)
4. Deployment tamamlandığında backend URL'iniz:
   ```
   https://prestalink-backend.onrender.com
   ```

### 6. Health Check

Backend'in çalıştığını kontrol edin:
```bash
curl https://prestalink-backend.onrender.com/
```

Response: `{"message":"Prestalink API is running"}`

---

## Environment Variables Özeti

### Vercel (Frontend)

```env
NEXT_PUBLIC_API_URL=https://prestalink-backend.onrender.com/api
```

### Render (Backend)

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/prestalink?retryWrites=true&w=majority
JWT_SECRET=RastgeleGüvenliString123!456
PORT=5000
CLIENT_URL=https://prestalink.vercel.app
NODE_ENV=production
HOST=0.0.0.0
```

---

## Son Kontroller

### 1. Frontend Kontrolü

1. Vercel URL'inize gidin: `https://prestalink.vercel.app`
2. Ana sayfa yükleniyor mu?
3. Browser console'da hata var mı?

### 2. Backend Kontrolü

1. Render URL'inize gidin: `https://prestalink-backend.onrender.com`
2. Response: `{"message":"Prestalink API is running"}`
3. API test: `https://prestalink-backend.onrender.com/api/jobs`

### 3. Database Kontrolü

1. MongoDB Atlas > Browse Collections
2. `prestalink` database'i var mı?
3. Collections görünüyor mu? (ilk kullanımda boş olabilir)

### 4. Full System Test

1. Frontend'te kayıt ol
2. Login yap
3. İş ilanları görünüyor mu?
4. Başvuru yapabiliyor musun?

---

## Troubleshooting

### Backend Connection Error

**Problem:** Frontend backend'e bağlanamıyor

**Çözüm:**
- Render backend URL'ini kontrol edin
- Vercel'de `NEXT_PUBLIC_API_URL` doğru mu?
- Render logs'da hata var mı?

### MongoDB Connection Error

**Problem:** Backend MongoDB'ye bağlanamıyor

**Çözüm:**
- MongoDB Atlas > Network Access > IP whitelist doğru mu? (0.0.0.0/0)
- Connection string'de şifre doğru mu?
- Database user aktif mi?

### CORS Error

**Problem:** Browser'da CORS hatası

**Çözüm:**
- Backend'de `CLIENT_URL` doğru mu? (Vercel URL'iniz)
- Render'da environment variable güncel mi?
- Redeploy yapın

### Build Errors

**Problem:** Vercel veya Render build hatası

**Çözüm:**
- Logları kontrol edin
- `package.json` dependencies eksik mi?
- Environment variables eksik mi?

---

## Seed Database (İsteğe Bağlı)

Production'da test verileri oluşturmak için:

1. Render > Web Service > Shell
2. Şu komutları çalıştırın:
```bash
cd backend
npm run seed
```

Veya lokal olarak MongoDB connection string ile:
```bash
cd backend
MONGO_URI="mongodb+srv://..." npm run seed
```

---

## 🎉 Başarılı Deployment!

Artık PrestaLink uygulamanız production'da çalışıyor:

- **Frontend:** https://prestalink.vercel.app
- **Backend:** https://prestalink-backend.onrender.com
- **Database:** MongoDB Atlas (Cloud)

Herhangi bir sorun için yukarıdaki troubleshooting bölümüne bakın!



